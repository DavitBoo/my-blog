// TimelineThreeScene.tsx
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import styles from "./sobre-mi.module.css";

const TimelineThreeScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lineRef = useRef<THREE.Line | null>(null);
  const particlesRef = useRef<THREE.Points[]>([]);
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Línea principal del timeline
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 100; i++) {
      const y = (i / 100) * 20 - 10;
      const x = Math.sin(i * 0.1) * 2;
      const z = Math.cos(i * 0.1) * 0.5;
      points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x04adbf,
      linewidth: 4,
      transparent: true,
      opacity: 1,
    });

    const line = new THREE.Line(geometry, material);
    scene.add(line);
    lineRef.current = line;

    createParticles(scene);

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("scroll", onScroll);

    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const createParticles = (scene: THREE.Scene) => {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x04bfbf,
      size: 0.03,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current.push(particles);
  };

  const onWindowResize = () => {
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    if (!camera || !renderer) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const onScroll = () => {
    console.log("holaaa");
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = scrollTop / docHeight;
    scrollProgressRef.current = scrollProgress;

    const camera = cameraRef.current;
    const line = lineRef.current;
    if (!camera || !line) return;

    camera.position.y = -scrollProgress * 15 + 5;
    camera.position.x = Math.sin(scrollProgress * Math.PI * 2) * 2;
    camera.position.z = 5 + Math.cos(scrollProgress * Math.PI) * 2;

    line.rotation.z = scrollProgress * Math.PI * 2;
    line.rotation.x = scrollProgress * Math.PI;

    particlesRef.current.forEach((particle, index) => {
      particle.rotation.y = scrollProgress * Math.PI * 2 + index;
      particle.position.y = Math.sin(scrollProgress * Math.PI * 4) * 2;
    });

    updateSections(scrollTop);
  };

 const updateSections = (scrollTop: number) => {
  const sections = document.querySelectorAll<HTMLElement>('[data-section]');
  const dots = document.querySelectorAll<HTMLElement>('[data-dot]');  
  const windowHeight = window.innerHeight;

sections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const inView = scrollTop >= sectionTop - windowHeight * 0.7 && scrollTop < sectionTop + sectionHeight * 0.3;


    if (inView) {
      section.classList.add(styles.active);
      dots[index]?.classList.add(styles.active);
    } else {
      section.classList.remove(styles.active);
      dots[index]?.classList.remove(styles.active);
    }
  });
};

  const animate = () => {
    requestAnimationFrame(animate);

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const line = lineRef.current;

    if (!renderer || !scene || !camera || !line) return;

    particlesRef.current.forEach((particle) => {
      particle.rotation.x += 0.001;
      particle.rotation.y += 0.002;
    });

    const lineMaterial = line.material as THREE.LineBasicMaterial;
    const time = Date.now() * 0.001;
    lineMaterial.opacity = 0.7 + Math.sin(time * 2) * 0.3;

    // Color transition
    const phase = (Math.sin(scrollProgressRef.current * Math.PI * 2) + 1) / 2;
    const r1 = 0.02,
      g1 = 0.68,
      b1 = 0.75;
    const r2 = 0.02,
      g2 = 0.53,
      b2 = 0.65;
    const r3 = 0.85,
      g3 = 0.8,
      b3 = 0.02;

    let r, g, b;
    if (phase < 0.5) {
      const t = phase * 2;
      r = r1 + (r2 - r1) * t;
      g = g1 + (g2 - g1) * t;
      b = b1 + (b2 - b1) * t;
    } else {
      const t = (phase - 0.5) * 2;
      r = r2 + (r3 - r2) * t;
      g = g2 + (g3 - g2) * t;
      b = b2 + (b3 - b2) * t;
    }

    lineMaterial.color.setRGB(r, g, b);
    renderer.render(scene, camera);
  };

  useEffect(() => {
    // Smooth scroll for dots
    const dots = document.querySelectorAll<HTMLElement>(".scrollDot");
    const sections = document.querySelectorAll<HTMLElement>(".timelineSection");

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        const section = sections[index];
        if (section) {
          window.scrollTo({
            top: section.offsetTop,
            behavior: "smooth",
          });
        }
      });
    });

    return () => {
      dots.forEach((dot) => {
        dot.replaceWith(dot.cloneNode(true));
      });
    };
  }, []);

  return (
    <canvas
      id="three-canvas"
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
};

export default TimelineThreeScene;
