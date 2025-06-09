import { useEffect, useRef } from "react";
import * as THREE from "three";

import { createFloatingGeometries } from "../utils/threeHelpers";

export const useThreeScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const geometriesRef = useRef<THREE.Mesh[]>([]);
  const raycasterRef = useRef(new THREE.Raycaster()); // ! revisar

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    const geometries = createFloatingGeometries(scene);
    geometriesRef.current = geometries;
    camera.position.z = 8;

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleClick = (event: MouseEvent) => {
      if (!cameraRef.current) return;
      // Calcular posición del mouse normalizada
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      console.log(mouse.x, mouse.y); 
      // Configurar raycaster
      raycasterRef.current.setFromCamera(mouse, cameraRef.current);

      // Detectar intersecciones
      const intersects = raycasterRef.current.intersectObjects(geometriesRef.current);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;

        // Cambiar opacidad a 100% si no estaba clickeado
        if (!clickedMesh.userData.clicked) {
          clickedMesh.userData.clicked = true;

          // Crear nuevo material con opacidad completa
          const originalMaterial = clickedMesh.userData.originalMaterial;
          if (originalMaterial instanceof THREE.MeshBasicMaterial) {
            const newMaterial = originalMaterial.clone();
            newMaterial.opacity = 1.0;
            clickedMesh.material = newMaterial;
          }
        } else {
          // Si ya estaba clickeado, volver al estado original
          clickedMesh.userData.clicked = false;
          clickedMesh.material = clickedMesh.userData.originalMaterial;
        }
      }
    };

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

      // animate geometries
      geometriesRef.current.forEach((mesh, index) => {
        mesh.rotation.x += mesh.userData.rotationSpeedX;
        mesh.rotation.y += mesh.userData.rotationSpeedY;
        mesh.rotation.z += mesh.userData.rotationSpeedZ;

        const time = Date.now() * 0.001;
        mesh.position.y = mesh.userData.originalPosition.y + Math.sin(time + index) * 0.5;
      });

      // move camera
      cameraRef.current.position.x += (mouseRef.current.x * 2 - cameraRef.current.position.x) * 0.02;
      cameraRef.current.position.y += (mouseRef.current.y * 2 - cameraRef.current.position.y) * 0.02;
      cameraRef.current.lookAt(0, 0, 0);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      geometriesRef.current.forEach((mesh) => {
        if (mesh.geometry) mesh.geometry.dispose(); 
        if (mesh.material && "dispose" in mesh.material) {
          mesh.material.dispose();
        }
      });
    };
  }, []);

  return { canvasRef };
};
