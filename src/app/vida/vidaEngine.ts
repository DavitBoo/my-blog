// Motor imperativo de la escena 3D del archipiélago "Vida".
// Puerto a TypeScript/three.js real de la lógica del prototipo de Claude Design
// (Vida - Archipielago.dc.html), sin el framework DCLogic del sandbox del diseño.
// No usa React: expone callbacks para que el componente que lo monta actualice su UI.

import * as THREE from 'three';
import { VidaCategoria, VidaItem, VidaLibroDestacado } from '../utils/vidaApi';
import { PAL, COL, Tema } from './vidaFormat';

const MAPA = { x0: -270, x1: 270, z0: -200, z1: 260 };
const N = 52;
const K_NIEBLA = 'vida:niebla:v1';
const K_ISLAS = 'vida:islas:v1';

export interface VidaHoverInfo {
  titulo: string;
  resumen: string;
  categoria: string;
}

export interface VidaEngineCallbacks {
  onHover: (info: VidaHoverInfo | null) => void;
  onCursorMove: (x: number, y: number) => void;
  onSelectItem: (item: VidaItem | null) => void;
  onSelectPortal: () => void;
  onDiscoveryChange: (descubiertas: number, total: number) => void;
}

type Edificio = {
  item: VidaItem | { slug: string; peso: number };
  mesh: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
  esFaro?: boolean;
};

type Isla = {
  cat: VidaCategoria;
  group: THREE.Group;
  topY: number;
  R: number;
  edificios: Edificio[];
  niebla: THREE.Group;
  nieblaMat: THREE.MeshStandardMaterial;
  portal: boolean;
  visto: boolean;
  disipando: number | null;
  faroLuz?: THREE.Mesh;
};

// Casi todos los materiales de la isla comparten flatShading:true + roughness:1 por defecto
// (los mismos valores que ya usaba cada `new THREE.MeshStandardMaterial({...})` suelto);
// centralizarlo aquí evita repetir esas dos props en las ~17 llamadas de crearIsla/crearBiblioteca.
type StdMatOpts = Partial<THREE.MeshStandardMaterialParameters> & {
  color: THREE.ColorRepresentation;
};

function stdMat(opts: StdMatOpts): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ flatShading: true, roughness: 1, ...opts });
}

export class VidaEngine {
  private canvas: HTMLCanvasElement;
  private miniCanvas: HTMLCanvasElement | null;
  private categorias: VidaCategoria[];
  private items: VidaItem[];
  private librosDestacados: VidaLibroDestacado[];
  private tema: Tema;
  private nieblaActiva: boolean;
  private cb: VidaEngineCallbacks;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private hemi!: THREE.HemisphereLight;
  private sun!: THREE.DirectionalLight;
  private fill!: THREE.DirectionalLight;
  private mar!: THREE.Mesh;
  private marGeo!: THREE.PlaneGeometry;
  private marBase!: Float32Array;
  private marMat!: THREE.MeshStandardMaterial;
  private nubes!: THREE.Group;
  private conex!: THREE.Group;
  private marca: THREE.Mesh | null = null;
  private raycaster = new THREE.Raycaster();
  private reloj = new THREE.Clock();
  private raf = 0;
  private vivo = false;

  private islas: Isla[] = [];
  private picks: THREE.Mesh[] = [];
  private catMap: Record<string, VidaCategoria> = {};
  private itemMap: Record<string, VidaItem> = {};
  private fog = new Uint8Array(N * N);
  private desc: Record<string, boolean> = {};
  private miniFogCanvas: HTMLCanvasElement | null = null;
  private miniFogDirty = true;

  private cam = { tx: 0, tz: -10, dist: 250 };
  private camObj = { tx: 0, tz: -10, dist: 250 };
  private yaw = -0.62;
  private pitch = 0.78;
  private puntero: { x: number; y: number } | null = null;
  private pedirHover = false;
  private hoverSlug: string | null = null;
  private tick = 0;
  private guardarT = 0;

  private cvEnlazado: HTMLCanvasElement | null = null;
  private miniEnlazado: HTMLCanvasElement | null = null;
  private listeners: Array<() => void> = [];

  constructor(
    canvas: HTMLCanvasElement,
    miniCanvas: HTMLCanvasElement | null,
    categorias: VidaCategoria[],
    items: VidaItem[],
    librosDestacados: VidaLibroDestacado[],
    tema: Tema,
    nieblaActiva: boolean,
    callbacks: VidaEngineCallbacks,
  ) {
    this.canvas = canvas;
    this.miniCanvas = miniCanvas;
    this.categorias = categorias;
    this.items = items;
    this.librosDestacados = librosDestacados;
    this.tema = tema;
    this.nieblaActiva = nieblaActiva;
    this.cb = callbacks;
    categorias.forEach((c) => (this.catMap[c.slug] = c));
    items.forEach((i) => (this.itemMap[i.slug] = i));
  }

  get discoveredCount() {
    return Object.keys(this.desc).length;
  }

  // ---------- ciclo de vida ----------

  start() {
    this.vivo = true;
    this.cargarProgreso();
    this.construir();
    this.enlazarEventos();
    this.revelar(true);
    this.bucle();
  }

  destroy() {
    this.vivo = false;
    cancelAnimationFrame(this.raf);
    this.desenlazar();
    this.guardarProgreso();
    if (this.renderer) {
      this.scene.traverse((o) => {
        if ('geometry' in o) (o as THREE.Mesh).geometry?.dispose?.();
        if ('material' in o) {
          const mat = (o as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose();
        }
      });
      this.renderer.dispose();
    }
  }

  resize() {
    this.medir();
  }

  setTema(t: Tema) {
    this.tema = t;
    this.aplicarTema(t);
  }

  reiniciarNiebla = () => {
    this.fog.fill(0);
    this.desc = {};
    this.miniFogDirty = true;
    this.islas.forEach((isla) => {
      isla.visto = false;
      isla.disipando = null;
      isla.niebla.visible = true;
      isla.nieblaMat.opacity = 0.94;
      isla.niebla.scale.set(1, 1, 1);
      isla.edificios.forEach((e) => {
        e.mesh.visible = false;
      });
    });
    this.cb.onDiscoveryChange(0, this.islas.length);
    this.seleccionarItem(null);
    this.limpiarConex();
    this.resaltar(null);
    this.guardarProgreso();
  };

  seleccionarItem(slugOrNull: string | null) {
    if (!slugOrNull) {
      this.cb.onSelectItem(null);
      this.resaltar(null);
      this.limpiarConex();
      if (this.marca) {
        this.marca.parent?.remove(this.marca);
        this.marca = null;
      }
      return;
    }
    const item = this.itemMap[slugOrNull];
    if (!item) return;
    this.abrir(item);
  }

  // ---------- utilidades ----------

  private paleta() {
    return PAL[this.tema] || PAL.oscuro;
  }
  private rnd(seed: number) {
    let s = seed >>> 0;
    return () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  private hash(str: string) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // ---------- progreso (localStorage) ----------

  private cargarProgreso() {
    try {
      const f = localStorage.getItem(K_NIEBLA);
      if (f && f.length === N * N)
        for (let i = 0; i < f.length; i++) this.fog[i] = f[i] === '1' ? 1 : 0;
      const d = JSON.parse(localStorage.getItem(K_ISLAS) || '[]');
      if (Array.isArray(d)) d.forEach((s: string) => (this.desc[s] = true));
    } catch {
      /* sesión limpia */
    }
  }
  private guardarProgreso() {
    try {
      let s = '';
      for (let i = 0; i < this.fog.length; i++) s += this.fog[i] ? '1' : '0';
      localStorage.setItem(K_NIEBLA, s);
      localStorage.setItem(K_ISLAS, JSON.stringify(Object.keys(this.desc)));
    } catch {
      /* ignorar */
    }
  }

  // ---------- escena ----------

  private construir() {
    const T = THREE;
    const p = this.paleta();

    // antialias:false + pixelRatio tope 1.5 recortan mucho coste de fragment shading
    // (notable en pantallas de alta densidad) a cambio de un antialiasing casi imperceptible
    // sobre una estética ya low-poly/flat-shaded.
    this.renderer = new T.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;

    this.scene = new T.Scene();
    this.scene.background = new T.Color(p.horizonte);
    this.scene.fog = new T.Fog(p.horizonte, p.marTop, p.marBot);

    this.camera = new T.PerspectiveCamera(42, 1, 1, 2400);

    this.hemi = new T.HemisphereLight(p.cieloLuz, p.suelo, 0.75);
    this.scene.add(this.hemi);
    this.sun = new T.DirectionalLight(p.sol, 1.55);
    this.sun.position.set(150, 240, 120);
    this.sun.castShadow = true;
    // Mapa de sombras más pequeño + frustum ajustado al área jugable real (en vez de
    // sobrar hasta ±300): mismo aspecto, bastante menos coste de la pasada de sombras.
    this.sun.shadow.mapSize.set(1024, 1024);
    const sc = this.sun.shadow.camera;
    sc.left = -250;
    sc.right = 250;
    sc.top = 250;
    sc.bottom = -250;
    sc.near = 1;
    sc.far = 700;
    this.sun.shadow.bias = -0.0006;
    this.scene.add(this.sun);
    this.fill = new T.DirectionalLight(p.relleno, 0.55);
    this.fill.position.set(-160, 90, -180);
    this.scene.add(this.fill);

    // Menos subdivisión: sigue leyendo bien desde la cámara isométrica y reduce a la mitad
    // el trabajo por vértice que hace el oleaje cada frame en la CPU.
    this.marGeo = new T.PlaneGeometry(1800, 1800, 56, 56);
    this.marGeo.rotateX(-Math.PI / 2);
    this.marBase = Float32Array.from(this.marGeo.attributes.position.array);
    this.marMat = stdMat({ color: p.mar, roughness: 0.38, metalness: 0.18 });
    this.mar = new T.Mesh(this.marGeo, this.marMat);
    this.mar.receiveShadow = true;
    this.scene.add(this.mar);

    this.nubes = new T.Group();
    this.scene.add(this.nubes);
    const rc = this.rnd(7);
    for (let i = 0; i < 9; i++) {
      const g = new T.Group();
      const mat = stdMat({ color: p.nube, transparent: true, opacity: 0.5 });
      for (let j = 0; j < 4; j++) {
        const m = new T.Mesh(new T.IcosahedronGeometry(6 + rc() * 7, 0), mat);
        m.position.set((rc() - 0.5) * 26, (rc() - 0.5) * 4, (rc() - 0.5) * 18);
        m.scale.y = 0.55;
        g.add(m);
      }
      g.position.set((rc() - 0.5) * 620, 78 + rc() * 34, (rc() - 0.5) * 620);
      g.userData.vel = 1.5 + rc() * 2;
      this.nubes.add(g);
    }

    this.islas = [];
    this.picks = [];
    this.categorias.forEach((c) => this.islas.push(this.crearIsla(c)));
    this.conex = new T.Group();
    this.scene.add(this.conex);

    this.medir();
  }

  private crearIsla(cat: VidaCategoria): Isla {
    const T = THREE;
    const p = this.paleta();
    const R = cat.radio;
    const r = this.rnd(this.hash(cat.slug));
    const g = new T.Group();
    g.position.set(cat.posX, 0, cat.posY);

    const base = new T.CylinderGeometry(R * 0.66, R * 1.0, 13, 11, 3, false);
    const pos = base.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const j = 0.06 * R;
      pos.setX(i, pos.getX(i) + (r() - 0.5) * j);
      pos.setZ(i, pos.getZ(i) + (r() - 0.5) * j);
      if (y > 5) pos.setY(i, y + (r() - 0.5) * 2.2);
    }
    base.computeVertexNormals();
    const tierra = new T.Mesh(base, stdMat({ color: p.tierra, roughness: 0.92 }));
    tierra.position.y = -4;
    tierra.castShadow = true;
    tierra.receiveShadow = true;
    g.add(tierra);

    const meseta = new T.Mesh(
      new T.CylinderGeometry(R * 0.6, R * 0.68, 2.4, 11, 1),
      stdMat({ color: p.tierraAlta, roughness: 0.88 }),
    );
    meseta.position.y = 3.6;
    meseta.castShadow = true;
    meseta.receiveShadow = true;
    g.add(meseta);
    const topY = 4.8;

    const playa = new T.Mesh(
      new T.CylinderGeometry(R * 1.06, R * 1.16, 1.6, 22, 1),
      stdMat({ color: p.arena }),
    );
    playa.position.y = -8.6;
    playa.receiveShadow = true;
    g.add(playa);

    const espuma = new T.Mesh(
      new T.RingGeometry(R * 1.14, R * 1.3, 30),
      new T.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        side: T.DoubleSide,
      }),
    );
    espuma.rotation.x = -Math.PI / 2;
    espuma.position.y = 0.35;
    g.add(espuma);

    for (let i = 0; i < 5 + Math.round(R / 9); i++) {
      const ang = r() * Math.PI * 2;
      const rad = R * (0.72 + r() * 0.24);
      const roca = new T.Mesh(
        new T.IcosahedronGeometry(1.2 + r() * 2.4, 0),
        stdMat({ color: p.roca }),
      );
      roca.position.set(Math.cos(ang) * rad, 0.4 + r(), Math.sin(ang) * rad);
      // Sin castShadow: son muchas por isla y apenas se nota su sombra a estas distancias,
      // pero cada una añade una pasada extra al render de sombras.
      g.add(roca);
    }
    for (let i = 0; i < 4 + Math.round(R / 7); i++) {
      const ang = r() * Math.PI * 2;
      const rad = R * (0.34 + r() * 0.3);
      const h = 4 + r() * 4;
      const tr = new T.Group();
      const tronco = new T.Mesh(
        new T.CylinderGeometry(0.32, 0.45, h * 0.4, 5),
        stdMat({ color: 0x5b4632 }),
      );
      tronco.position.y = h * 0.2;
      const copa = new T.Mesh(
        new T.ConeGeometry(1.5 + r(), h * 0.85, 6),
        stdMat({ color: p.tierra, roughness: 0.95 }),
      );
      copa.position.y = h * 0.62;
      tr.add(tronco, copa);
      tr.position.set(Math.cos(ang) * rad, topY, Math.sin(ang) * rad);
      g.add(tr);
    }

    const isla: Isla = {
      cat,
      group: g,
      topY,
      R,
      edificios: [],
      niebla: new T.Group(),
      nieblaMat: stdMat({ color: 0xdfeef5, transparent: true, opacity: 0.94 }),
      portal: cat.tipoContenido === 'portal',
      visto: false,
      disipando: null,
    };

    if (isla.portal) this.crearBiblioteca(isla, r);
    else this.crearEdificios(isla, r);

    for (let i = 0; i < 11; i++) {
      const ang = (i / 11) * Math.PI * 2 + r();
      const rad = R * (0.15 + r() * 0.85);
      const m = new T.Mesh(new T.IcosahedronGeometry(R * (0.3 + r() * 0.3), 1), isla.nieblaMat);
      m.position.set(Math.cos(ang) * rad, 6 + r() * 14, Math.sin(ang) * rad);
      m.scale.y = 0.6;
      isla.niebla.add(m);
    }
    g.add(isla.niebla);

    const visible = !!this.desc[cat.slug] || !this.nieblaActiva;
    isla.visto = visible;
    isla.niebla.visible = !visible;
    isla.nieblaMat.opacity = visible ? 0 : 0.94;
    isla.edificios.forEach((e) => (e.mesh.visible = visible));

    this.scene.add(g);
    return isla;
  }

  private formaEdificio(item: VidaItem, w: number, h: number): THREE.BufferGeometry {
    const T = THREE;
    const clave = item.ambito || item.categoria;
    switch (clave) {
      case 'lutheria':
        return new T.CylinderGeometry(w * 0.5, w * 0.62, h, 6);
      case 'electronica':
        return new T.BoxGeometry(w * 0.72, h, w * 0.72);
      case 'carpinteria':
        return new T.BoxGeometry(w, h, w * 1.15);
      case 'comunidad':
        return new T.CylinderGeometry(w * 0.95, w * 1.05, h * 0.7, 8);
      case 'audiovisual':
        return new T.ConeGeometry(w * 0.8, h, 5);
      case 'desarrollo':
        return new T.BoxGeometry(w * 0.85, h, w * 0.85);
      case 'viajes':
        return new T.CylinderGeometry(w * 0.18, w * 0.72, h, 4);
      case 'estudios':
        return new T.CylinderGeometry(w * 0.55, w * 0.7, h, 6);
      case 'idiomas':
        return new T.CylinderGeometry(w * 0.6, w * 0.6, h, 10);
      case 'musica':
        return new T.ConeGeometry(w * 0.75, h, 4);
      default:
        return new T.BoxGeometry(w * 0.9, h, w * 0.9);
    }
  }

  private crearEdificios(isla: Isla, r: () => number) {
    const T = THREE;
    const cat = isla.cat;
    const items = this.items
      .filter((i) => i.categoria === cat.slug)
      .sort((a, b) => b.peso - a.peso);
    const col = new T.Color(COL[cat.slug] ?? 0x04adbf);
    const g = 2.399963;
    items.forEach((item, k) => {
      const rad = isla.R * 0.5 * Math.sqrt((k + 0.55) / items.length);
      const ang = k * g + r() * 0.25;
      const h = 2.6 + item.peso * 2.35;
      const w = 2.1 + item.peso * 0.62;
      const geo = this.formaEdificio(item, w, h);
      const c = col.clone();
      c.offsetHSL((r() - 0.5) * 0.045, 0, (item.peso - 3) * 0.045);
      const mat = stdMat({
        color: c,
        roughness: 0.42,
        metalness: 0.22,
        emissive: new T.Color(COL[cat.slug] ?? 0x04adbf),
        emissiveIntensity: item.destacado ? 0.32 : 0.1,
        transparent: true,
        opacity: 1,
      });
      const m = new T.Mesh(geo, mat);
      m.position.set(Math.cos(ang) * rad, isla.topY + h / 2, Math.sin(ang) * rad);
      m.rotation.y = r() * Math.PI;
      m.castShadow = true;
      m.receiveShadow = true;
      m.userData = { item, isla, baseY: m.position.y, baseEm: mat.emissiveIntensity };
      isla.group.add(m);

      if (item.destacado) {
        const faro = new T.Mesh(
          new T.OctahedronGeometry(w * 0.34, 0),
          stdMat({ color: 0xffffff, emissive: new T.Color(0xd9cb04), emissiveIntensity: 1.5 }),
        );
        faro.position.set(m.position.x, m.position.y + h / 2 + w * 0.42, m.position.z);
        faro.userData = { item, isla, faro: true };
        isla.group.add(faro);
        isla.edificios.push({
          item,
          mesh: faro,
          mat: faro.material as THREE.MeshStandardMaterial,
          esFaro: true,
        });
        this.picks.push(faro);
      }
      isla.edificios.push({ item, mesh: m, mat });
      this.picks.push(m);
    });
  }

  private crearBiblioteca(isla: Isla, r: () => number) {
    const T = THREE;
    const drum = new T.Mesh(
      new T.CylinderGeometry(isla.R * 0.44, isla.R * 0.5, 9, 10),
      stdMat({
        color: 0xc9a870,
        roughness: 0.6,
        emissive: new T.Color(0xb08d4a),
        emissiveIntensity: 0.16,
        transparent: true,
        opacity: 1,
      }),
    );
    drum.position.y = isla.topY + 4.5;
    drum.castShadow = true;
    drum.receiveShadow = true;
    drum.userData = { portal: true, isla };
    isla.group.add(drum);
    this.picks.push(drum);
    isla.edificios.push({
      item: { slug: '__lecturas', peso: 5 },
      mesh: drum,
      mat: drum.material as THREE.MeshStandardMaterial,
    });

    const torre = new T.Mesh(
      new T.CylinderGeometry(1.9, 2.6, 20, 8),
      stdMat({ color: 0xe8dcc0, roughness: 0.7, transparent: true, opacity: 1 }),
    );
    torre.position.set(isla.R * 0.02, isla.topY + 14, isla.R * 0.02);
    torre.castShadow = true;
    torre.userData = { portal: true, isla };
    isla.group.add(torre);
    this.picks.push(torre);
    isla.edificios.push({
      item: { slug: '__torre', peso: 3 },
      mesh: torre,
      mat: torre.material as THREE.MeshStandardMaterial,
    });

    const luz = new T.Mesh(
      new T.OctahedronGeometry(2.1, 0),
      stdMat({ color: 0xfff6d0, emissive: new T.Color(0xd9cb04), emissiveIntensity: 2.1 }),
    );
    luz.position.set(torre.position.x, isla.topY + 25.4, torre.position.z);
    isla.group.add(luz);
    isla.faroLuz = luz;

    const libros = this.librosDestacados || [];
    libros.slice(0, 5).forEach((l, k) => {
      const ang = (k / 5) * Math.PI * 2 + 0.4;
      const rad = isla.R * 0.72;
      const alto = 5 + r() * 4;
      const m = new T.Mesh(
        new T.BoxGeometry(4.6, alto, 1.5 + r()),
        stdMat({
          color: new T.Color(l.color || '#8a6a3d'),
          roughness: 0.75,
          transparent: true,
          opacity: 1,
        }),
      );
      m.position.set(Math.cos(ang) * rad, isla.topY + alto / 2, Math.sin(ang) * rad);
      m.rotation.y = -ang;
      m.castShadow = true;
      m.userData = { portal: true, isla };
      isla.group.add(m);
      this.picks.push(m);
      isla.edificios.push({
        item: { slug: '__libro' + k, peso: 2 },
        mesh: m,
        mat: m.material as THREE.MeshStandardMaterial,
      });
    });
  }

  private aplicarTema(t: Tema) {
    if (!this.scene) return;
    const T = THREE;
    const p = this.paleta();
    this.scene.background = new T.Color(p.horizonte);
    this.scene.fog = new T.Fog(p.horizonte, p.marTop, p.marBot);
    this.marMat.color = new T.Color(p.mar);
    this.hemi.color = new T.Color(p.cieloLuz);
    this.hemi.groundColor = new T.Color(p.suelo);
    this.sun.color = new T.Color(p.sol);
    this.fill.color = new T.Color(p.relleno);
    this.nubes.children.forEach((g) =>
      (g as THREE.Group).children.forEach((m) => {
        ((m as THREE.Mesh).material as THREE.MeshStandardMaterial).color = new T.Color(p.nube);
      }),
    );
    this.islas.forEach((isla) => {
      const ch = isla.group.children;
      const tierra = ch[0] as THREE.Mesh;
      const meseta = ch[1] as THREE.Mesh;
      const playa = ch[2] as THREE.Mesh;
      if (tierra?.material)
        (tierra.material as THREE.MeshStandardMaterial).color = new T.Color(p.tierra);
      if (meseta?.material)
        (meseta.material as THREE.MeshStandardMaterial).color = new T.Color(p.tierraAlta);
      if (playa?.material)
        (playa.material as THREE.MeshStandardMaterial).color = new T.Color(p.arena);
    });
  }

  // ---------- eventos ----------

  private desenlazar() {
    this.listeners.forEach((off) => off());
    this.listeners = [];
    this.cvEnlazado = null;
    this.miniEnlazado = null;
  }

  private on(
    target: EventTarget,
    type: string,
    fn: EventListenerOrEventListenerObject,
    opts?: AddEventListenerOptions,
  ) {
    target.addEventListener(type, fn, opts);
    this.listeners.push(() => target.removeEventListener(type, fn, opts));
  }

  private enlazarEventos() {
    this.desenlazar();
    const cv = this.canvas;
    const mini = this.miniCanvas;
    this.cvEnlazado = cv;
    this.miniEnlazado = mini;

    let px = 0,
      py = 0,
      down = false,
      moved = 0,
      pinch = 0;
    const pos = (e: MouseEvent | TouchEvent) => {
      const t = 'touches' in e && e.touches.length ? e.touches[0] : (e as MouseEvent);
      return { x: t.clientX, y: t.clientY };
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length === 2) {
        pinch = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        return;
      }
      const q = pos(e);
      px = q.x;
      py = q.y;
      down = true;
      moved = 0;
      cv.style.cursor = 'grabbing';
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length === 2 && pinch) {
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        this.camObj.dist = Math.max(80, Math.min(430, this.camObj.dist * (pinch / d)));
        pinch = d;
        return;
      }
      const q = pos(e);
      if (down) {
        const dx = q.x - px,
          dy = q.y - py;
        moved += Math.abs(dx) + Math.abs(dy);
        px = q.x;
        py = q.y;
        const k = this.camObj.dist * 0.0026;
        const cy = Math.cos(this.yaw),
          sy = Math.sin(this.yaw);
        // Base de paneo en el plano del suelo para la cámara orbital fija (yaw, pitch):
        // "derecha" en pantalla = (cy, -sy), "arriba" en pantalla proyectado al suelo = (-sy, -cy).
        this.camObj.tx -= (dx * cy + dy * sy) * k;
        this.camObj.tz -= (dy * cy - dx * sy) * k;
        this.camObj.tx = Math.max(-320, Math.min(320, this.camObj.tx));
        this.camObj.tz = Math.max(-260, Math.min(310, this.camObj.tz));
      } else if (!('touches' in e)) {
        this.puntero = q;
        this.pedirHover = true;
        this.cb.onCursorMove(q.x, q.y);
      }
    };
    const onUp = (e: MouseEvent | TouchEvent) => {
      cv.style.cursor = 'grab';
      if (down && moved < 8) {
        this.puntero = pos(e);
        this.clic();
      }
      down = false;
      pinch = 0;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      this.camObj.dist = Math.max(
        80,
        Math.min(430, this.camObj.dist * (1 + Math.sign(e.deltaY) * 0.09)),
      );
    };

    this.on(cv, 'mousedown', onDown as EventListener);
    this.on(cv, 'touchstart', onDown as EventListener, { passive: true });
    this.on(window, 'mousemove', onMove as EventListener);
    this.on(cv, 'touchmove', onMove as EventListener, { passive: true });
    this.on(window, 'mouseup', onUp as EventListener);
    this.on(cv, 'touchend', onUp as EventListener);
    this.on(cv, 'wheel', onWheel as EventListener, { passive: false });
    this.on(window, 'resize', () => this.medir());

    const mini_ = this.miniCanvas;
    if (mini_) {
      const onMini = (e: MouseEvent | TouchEvent) => {
        const R = mini_.getBoundingClientRect();
        const t = 'touches' in e && e.touches.length ? e.touches[0] : (e as MouseEvent);
        const fx = (t.clientX - R.left) / R.width;
        const fy = (t.clientY - R.top) / R.height;
        const wx = MAPA.x0 + fx * (MAPA.x1 - MAPA.x0);
        const wz = MAPA.z0 + fy * (MAPA.z1 - MAPA.z0);
        const ix = Math.floor(fx * N);
        const iy = Math.floor(fy * N);
        if (this.nieblaActiva && !this.fog[iy * N + ix]) return;
        this.camObj.tx = wx;
        this.camObj.tz = wz;
      };
      this.on(mini_, 'mousedown', onMini as EventListener);
      this.on(mini_, 'touchstart', onMini as EventListener, { passive: true });
    }
  }

  private medir() {
    const cv = this.canvas;
    if (!cv || !this.renderer) return;
    const w = cv.clientWidth || window.innerWidth;
    const h = cv.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private rayo(): THREE.Mesh | null {
    const cv = this.canvas;
    const q = this.puntero;
    if (!cv || !q) return null;
    const R = cv.getBoundingClientRect();
    const v = new THREE.Vector2(
      ((q.x - R.left) / R.width) * 2 - 1,
      -((q.y - R.top) / R.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(v, this.camera);
    const hits = this.raycaster.intersectObjects(this.picks, false);
    for (const h of hits) {
      const obj = h.object as THREE.Mesh;
      const isla = obj.userData.isla as Isla | undefined;
      if (obj.visible && isla && isla.visto) return obj;
    }
    return null;
  }

  private clic() {
    const o = this.rayo();
    if (!o) return;
    if (o.userData.portal) {
      this.cb.onSelectPortal();
      this.limpiarConex();
      this.resaltar(null);
      return;
    }
    this.abrir(o.userData.item as VidaItem);
  }

  private abrir(item: VidaItem) {
    this.cb.onSelectItem(item);
    this.resaltar(item);
    this.dibujarConex(item);
    const isla = this.islas.find((i) => i.cat.slug === item.categoria);
    if (isla) {
      this.camObj.tx = isla.cat.posX;
      this.camObj.tz = isla.cat.posY + isla.R * 0.9;
      this.camObj.dist = Math.max(105, isla.R * 3.4);
    }
  }

  private resaltar(item: VidaItem | null) {
    const rel = item ? new Set([item.slug, ...(item.relacionados || [])]) : null;
    this.islas.forEach((isla) =>
      isla.edificios.forEach((e) => {
        const m = e.mat;
        if (!rel) {
          m.opacity = 1;
          if (m.emissiveIntensity != null && e.mesh.userData.baseEm != null)
            m.emissiveIntensity = e.mesh.userData.baseEm;
          return;
        }
        const on = rel.has(e.item.slug);
        m.opacity = on ? 1 : 0.16;
        if (m.emissiveIntensity != null && e.mesh.userData.baseEm != null)
          m.emissiveIntensity = on ? 0.75 : 0.02;
      }),
    );
    if (this.marca) {
      this.marca.parent?.remove(this.marca);
      this.marca = null;
    }
    if (item) {
      const found = this.buscarMesh(item.slug);
      if (found) {
        const T = THREE;
        const anillo = new T.Mesh(
          new T.TorusGeometry(4.6, 0.42, 8, 26),
          stdMat({ color: 0xd9cb04, emissive: new T.Color(0xd9cb04), emissiveIntensity: 1.2 }),
        );
        anillo.rotation.x = -Math.PI / 2;
        anillo.position.set(found.mesh.position.x, found.isla.topY + 1.4, found.mesh.position.z);
        found.isla.group.add(anillo);
        this.marca = anillo;
      }
    }
  }

  private buscarMesh(slug: string): { mesh: THREE.Mesh; isla: Isla } | null {
    for (const isla of this.islas) {
      const e = isla.edificios.find((x) => x.item.slug === slug && !x.esFaro);
      if (e) return { mesh: e.mesh, isla };
    }
    return null;
  }

  private limpiarConex() {
    while (this.conex.children.length) {
      const c = this.conex.children.pop() as THREE.Mesh;
      c.geometry?.dispose();
      (c.material as THREE.Material)?.dispose();
    }
  }

  private dibujarConex(item: VidaItem) {
    this.limpiarConex();
    const T = THREE;
    const a = this.buscarMesh(item.slug);
    if (!a) return;
    const p0 = new T.Vector3().copy(a.mesh.position).add(a.isla.group.position);
    p0.y = a.mesh.position.y + 4;
    (item.relacionados || []).forEach((slug) => {
      const b = this.buscarMesh(slug);
      if (!b) return;
      const p1 = new T.Vector3().copy(b.mesh.position).add(b.isla.group.position);
      p1.y = b.mesh.position.y + 4;
      const d = p0.distanceTo(p1);
      const mid = new T.Vector3().addVectors(p0, p1).multiplyScalar(0.5);
      mid.y += Math.min(70, 16 + d * 0.28);
      const curva = new T.QuadraticBezierCurve3(p0, mid, p1);
      const tubo = new T.Mesh(
        new T.TubeGeometry(curva, 44, 0.5, 6, false),
        stdMat({
          color: 0xd9cb04,
          emissive: new T.Color(0xd9cb04),
          emissiveIntensity: 1.1,
          transparent: true,
          opacity: 0.85,
          flatShading: false, // única de las 17 que no llevaba flat-shading; se preserva igual
        }),
      );
      this.conex.add(tubo);
    });
  }

  // ---------- niebla de guerra ----------

  private revelar(inicial: boolean) {
    const rev = 44 + this.cam.dist * 0.1;
    const cw = (MAPA.x1 - MAPA.x0) / N;
    const ch = (MAPA.z1 - MAPA.z0) / N;
    const i0 = Math.max(0, Math.floor((this.cam.tx - rev - MAPA.x0) / cw));
    const i1 = Math.min(N - 1, Math.ceil((this.cam.tx + rev - MAPA.x0) / cw));
    const j0 = Math.max(0, Math.floor((this.cam.tz - rev - MAPA.z0) / ch));
    const j1 = Math.min(N - 1, Math.ceil((this.cam.tz + rev - MAPA.z0) / ch));
    for (let j = j0; j <= j1; j++)
      for (let i = i0; i <= i1; i++) {
        const x = MAPA.x0 + (i + 0.5) * cw,
          z = MAPA.z0 + (j + 0.5) * ch;
        if (!this.fog[j * N + i] && Math.hypot(x - this.cam.tx, z - this.cam.tz) < rev) {
          this.fog[j * N + i] = 1;
          this.miniFogDirty = true;
        }
      }
    let nuevas = false;
    this.islas.forEach((isla) => {
      if (isla.visto) return;
      const d = Math.hypot(isla.cat.posX - this.cam.tx, isla.cat.posY - this.cam.tz);
      if (d < isla.R + 62 || !this.nieblaActiva) {
        isla.visto = true;
        this.desc[isla.cat.slug] = true;
        nuevas = true;
        isla.edificios.forEach((e) => (e.mesh.visible = true));
        isla.disipando = 0.0001;
      }
    });
    if (nuevas) {
      this.cb.onDiscoveryChange(Object.keys(this.desc).length, this.islas.length);
      this.guardarProgreso();
    }
    if (!inicial) {
      this.guardarT++;
      if (this.guardarT % 240 === 0) this.guardarProgreso();
    }
  }

  // ---------- minimapa ----------

  // Repinta la capa de niebla (fondo + 2704 fillRect + blur) a un canvas offscreen
  // cacheado, y solo cuando el propio mapa de niebla ha cambiado de verdad. El resto
  // de pintarMini() (islas, viewport, punto de cámara) es barato y sí se hace cada vez.
  private pintarFogCache(W: number, H: number) {
    if (!this.miniFogCanvas || this.miniFogCanvas.width !== W || this.miniFogCanvas.height !== H) {
      this.miniFogCanvas = document.createElement('canvas');
      this.miniFogCanvas.width = W;
      this.miniFogCanvas.height = H;
    }
    const ctx = this.miniFogCanvas.getContext('2d');
    if (!ctx) return;
    const cw = W / N,
      ch = H / N;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#04101a';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    if ('filter' in ctx) ctx.filter = 'blur(5px)';
    ctx.fillStyle = 'rgba(4,110,140,0.55)';
    for (let j = 0; j < N; j++)
      for (let i = 0; i < N; i++) {
        if (this.fog[j * N + i]) ctx.fillRect(i * cw - 1, j * ch - 1, cw + 2, ch + 2);
      }
    ctx.restore();
    this.miniFogDirty = false;
  }

  private pintarMini() {
    const cv = this.miniCanvas;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = cv.width,
      H = cv.height;
    if (this.miniFogDirty || !this.miniFogCanvas) this.pintarFogCache(W, H);
    ctx.clearRect(0, 0, W, H);
    if (this.miniFogCanvas) ctx.drawImage(this.miniFogCanvas, 0, 0);
    const px = (x: number) => ((x - MAPA.x0) / (MAPA.x1 - MAPA.x0)) * W;
    const pz = (z: number) => ((z - MAPA.z0) / (MAPA.z1 - MAPA.z0)) * H;
    ctx.textAlign = 'center';
    ctx.font = '600 15px Montserrat, sans-serif';
    this.islas.forEach((isla) => {
      if (!isla.visto) return;
      const x = px(isla.cat.posX),
        y = pz(isla.cat.posY);
      const r = (isla.R / (MAPA.x1 - MAPA.x0)) * W * 1.15;
      const c = '#' + (COL[isla.cat.slug] ?? 0x04adbf).toString(16).padStart(6, '0');
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(255,255,255,.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(226,245,250,.92)';
      ctx.fillText(isla.cat.nombre, x, y - r - 7);
    });
    const cx = px(this.cam.tx),
      cy = pz(this.cam.tz);
    const vw = ((this.cam.dist * 0.9) / (MAPA.x1 - MAPA.x0)) * W;
    ctx.strokeStyle = 'rgba(226,245,250,.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - vw / 2, cy - vw * 0.34, vw, vw * 0.68);
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#d9cb04';
    ctx.fill();
  }

  // ---------- bucle ----------

  private bucle = () => {
    if (!this.vivo || !this.scene) return;
    this.raf = requestAnimationFrame(this.bucle);
    const t = this.reloj.getElapsedTime();

    const l = 0.08;
    this.cam.tx += (this.camObj.tx - this.cam.tx) * l;
    this.cam.tz += (this.camObj.tz - this.cam.tz) * l;
    this.cam.dist += (this.camObj.dist - this.cam.dist) * l;
    const cd = Math.cos(this.pitch),
      sd = Math.sin(this.pitch);
    this.camera.position.set(
      this.cam.tx + Math.sin(this.yaw) * this.cam.dist * cd,
      this.cam.dist * sd,
      this.cam.tz + Math.cos(this.yaw) * this.cam.dist * cd,
    );
    this.camera.lookAt(this.cam.tx, 0, this.cam.tz);

    const pos = this.marGeo.attributes.position,
      b = this.marBase;
    for (let i = 0; i < pos.count; i++) {
      const x = b[i * 3],
        z = b[i * 3 + 2];
      pos.array[i * 3 + 1] =
        Math.sin(x * 0.035 + t * 0.9) * 1.5 +
        Math.sin(z * 0.052 - t * 1.15) * 1.1 +
        Math.sin((x + z) * 0.017 + t * 0.5) * 1.6;
    }
    pos.needsUpdate = true;
    this.tick++;
    // Sin recomputeVertexNormals(): el material del mar usa flatShading, que three.js
    // resuelve en el fragment shader a partir de derivadas de pantalla (dFdx/dFdy) y
    // nunca lee el atributo de normales de la CPU. Recalcularlas aquí no cambiaba nada
    // en pantalla y era, con diferencia, el gasto más caro del bucle de animación.

    this.nubes.children.forEach((g) => {
      g.position.x += (g.userData.vel as number) * 0.06;
      if (g.position.x > 380) g.position.x = -380;
    });

    this.islas.forEach((isla) => {
      if (isla.disipando != null) {
        isla.disipando += 0.012;
        const k = Math.min(1, isla.disipando);
        isla.nieblaMat.opacity = 0.94 * (1 - k);
        isla.niebla.scale.setScalar(1 + k * 0.9);
        isla.niebla.rotation.y += 0.004;
        if (k >= 1) {
          isla.niebla.visible = false;
          isla.disipando = null;
        }
      } else if (isla.niebla.visible) {
        isla.niebla.rotation.y += 0.0012;
      }
      if (isla.faroLuz) isla.faroLuz.rotation.y += 0.02;
    });

    this.conex.children.forEach((c, i) => {
      ((c as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity =
        0.55 + Math.sin(t * 2.2 + i) * 0.3;
    });
    if (this.marca) {
      this.marca.rotation.z += 0.02;
      this.marca.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
    }

    if (this.pedirHover) {
      this.pedirHover = false;
      this.hover();
    }
    // Revelar niebla y repintar el minimapa no necesitan precisión de cada frame.
    if (this.tick % 5 === 0) this.revelar(false);
    if (this.tick % 6 === 0) this.pintarMini();

    this.renderer.render(this.scene, this.camera);
  };

  private hover() {
    const o = this.rayo();
    const cv = this.canvas;
    const item = o?.userData.item as VidaItem | undefined;
    const portal = o?.userData.portal;
    if (cv) cv.style.cursor = o ? 'pointer' : 'grab';
    const slug = item ? item.slug : portal ? '__portal' : null;
    if (slug === this.hoverSlug) return;
    this.hoverSlug = slug;
    if (item && !item.slug.startsWith('__')) {
      this.cb.onHover({
        titulo: item.titulo,
        resumen: item.resumen,
        categoria: this.catMap[item.categoria]?.nombre || '',
      });
    } else if (portal) {
      const c = this.catMap['lecturas'];
      this.cb.onHover({
        titulo: c?.nombre || 'Lecturas',
        resumen: c?.descripcion || '',
        categoria: 'Isla portal',
      });
    } else {
      this.cb.onHover(null);
    }
  }
}
