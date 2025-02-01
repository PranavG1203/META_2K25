import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeDScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(ambientLight, pointLight);

    // Load 3D Text
    const loader = new GLTFLoader();
    loader.load("/MetaText.glb", (gltf) => {
      const textMesh = gltf.scene;
      textMesh.position.set(0, 0, 0);
      textMesh.scale.set(1, 1, 1);
      scene.add(textMesh);
    });

    // Create a circular texture
    const createCircleTexture = () => {
      const size = 16;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.fillStyle = 'white';
      context.fill();
      return new THREE.CanvasTexture(canvas);
    };

    const circleTexture = createCircleTexture();

    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 8000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 100;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 0.2, 
      map: circleTexture, 
      transparent: true 
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Starfield Animation
      const positions = stars.geometry.attributes.position.array;
      for (let i = 0; i < starCount * 3; i += 3) {
        positions[i + 2] += 0.2; // Move along the z-axis
        if (positions[i + 2] > 5) {
          positions[i + 2] = -60; // Reset position when it goes out of view
        }
      }
      stars.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>;
};

export default ThreeDScene;