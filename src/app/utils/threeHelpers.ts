import * as THREE from "three";

const getCSSColor = (cssVariable: string): number => {
  const color = getComputedStyle(document.documentElement) 
    .getPropertyValue(cssVariable)
    .trim();
  
  // from hex string to hex num for Three.js
  return parseInt(color.replace('#', '0x'));
};


export const createMaterials = () => [
  new THREE.MeshBasicMaterial({ 
    color: getCSSColor('--color-primary'), 
    transparent: true, 
    opacity: 0.2,
    // wireframe: true 
  }),
  new THREE.MeshBasicMaterial({ 
    color: getCSSColor('--color-font-tertiary'), 
    transparent: true, 
    opacity: 0.2 
  }),
  new THREE.MeshBasicMaterial({ 
    color: getCSSColor('--color-hover'), 
    transparent: true, 
    opacity: 0.2,
    // wireframe: true 
  }),
  new THREE.MeshBasicMaterial({ 
    color: getCSSColor('--color-accent'), 
    transparent: true, 
    opacity: 0.2 
  })
];



export const createGeometry = () => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.5, 0.8);
  shape.lineTo(1, 0);
  shape.lineTo(0, 0);
  
  const extrudeSettings = {      
    steps: 1,
    depth: 0.1,  
    bevelEnabled: false
  };
  
  return new THREE.ExtrudeGeometry(shape, extrudeSettings); 
};

export const createFloatingGeometries = (scene: THREE.Scene) => {
  const materials = createMaterials();
  const geometries = [];

  for (let i = 0; i < 12; i++) {
    const geometry = createGeometry();
    const materialIndex = Math.floor(Math.random() * materials.length);
    const mesh = new THREE.Mesh(geometry, materials[materialIndex]);

    // Random init position
    mesh.position.x = (Math.random() - 0.5) * 20;
    mesh.position.y = (Math.random() - 0.5) * 15;
    mesh.position.z = (Math.random() - 0.5) * 15;

    // Random init rotation
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;

    // Rotation speed - own properties
    mesh.userData = {
      rotationSpeedX: (Math.random() - 0.5) * 0.02,
      rotationSpeedY: (Math.random() - 0.5) * 0.02,
      rotationSpeedZ: (Math.random() - 0.5) * 0.01,
      originalPosition: mesh.position.clone(),
      clicked: false, 
      originalMaterial: mesh.material
    };

    scene.add(mesh);
    geometries.push(mesh);
  }

  return geometries
};
