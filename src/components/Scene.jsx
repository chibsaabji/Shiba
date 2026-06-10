import React, { forwardRef, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Shiba } from './Shiba';
import { CustomCloud } from './CustomCloud';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const ResponsiveShiba = forwardRef((props, ref) => {
  const { viewport } = useThree();
  // Normal scale for the rest of the sections
  const baseScale = viewport.width < 5 ? 1.2 : 2;
  // Make shiba bigger in Hero
  const heroScale = baseScale * 1.5;
  // Start slightly higher in Hero
  return <Shiba ref={ref} position={[0, 0.2, 0]} scale={heroScale} baseScale={baseScale} {...props} />;
});

export const Scene = forwardRef(({ controlsEnabled }, ref) => {
  const cloudsRef = useRef();

  useGSAP(() => {
    if (!cloudsRef.current) return;

    // Dramatic scroll parallax: Clouds fly UP and PAST the camera (Out of screen)
    gsap.to(cloudsRef.current.position, {
      y: 6, // Float way up
      z: 10, // Fly completely past the camera
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    gsap.to(cloudsRef.current.rotation, {
      y: Math.PI / 4, // Deep rotation to reveal different sides of the clouds
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });
  });

  return (
    <Canvas
      aria-label="Interactive 3D Shiba Cafe environment"
      role="region"
      camera={{ position: [0, 1, 5], fov: 50 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />

      <React.Suspense fallback={null}>
        <Environment preset="city" />

        {/* Custom Cloud Models Animated Out of Screen */}
        <group ref={cloudsRef}>
          {/* 3 Normal Orientation */}
          <CustomCloud position={[-6, -3.6, -4]} scale={0.7} />
          <CustomCloud position={[5.2, -1.5, -6]} scale={0.7} />
          <CustomCloud position={[-5, 1.5, -7]} scale={0.7} />

          {/* 3 Flipped 180 degrees */}
          <CustomCloud position={[6, -3.5, -4]} rotation={[0, Math.PI, 0]} scale={0.7} />
          <CustomCloud position={[5.5, 1.5, -7]} rotation={[0, Math.PI, 0]} scale={0.7} />
          <CustomCloud position={[-5, -1.5, -6]} rotation={[0, Math.PI, 0]} scale={0.7} />
        </group>

        <ResponsiveShiba ref={ref} controlsEnabled={controlsEnabled} />
      </React.Suspense>
    </Canvas>
  );
});
