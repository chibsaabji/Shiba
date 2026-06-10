import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export const Shiba = React.forwardRef(({ controlsEnabled, baseScale, ...props }, ref) => {
  const localGroup = useRef();
  const { scene } = useGLTF('./Model/scene.gltf');

  // Drag state
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (!controlsEnabled) return;
      isDragging.current = true;
      prevMouse.current.x = e.clientX || (e.touches && e.touches[0].clientX);
      prevMouse.current.y = e.clientY || (e.touches && e.touches[0].clientY);
    };

    const handlePointerMove = (e) => {
      if (!isDragging.current || !controlsEnabled) return;
      const cx = e.clientX || (e.touches && e.touches[0].clientX);
      const cy = e.clientY || (e.touches && e.touches[0].clientY);

      const dx = cx - prevMouse.current.x;
      const dy = cy - prevMouse.current.y;

      velocity.current.y = dx * 0.006;
      velocity.current.x = dy * 0.006;

      if (localGroup.current) {
        // Only allow horizontal rotation as per requirements
        localGroup.current.rotation.y += velocity.current.y;
      }

      prevMouse.current.x = cx;
      prevMouse.current.y = cy;
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [controlsEnabled]);

  useFrame(() => {
    if (localGroup.current && !isDragging.current && controlsEnabled) {
      // Apply momentum damping
      velocity.current.y *= 0.94;
      
      if (Math.abs(velocity.current.y) > 0.0001) {
        localGroup.current.rotation.y += velocity.current.y;
      }
    }
  });

  useGSAP(() => {
    if (!localGroup.current) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      const shiba = localGroup.current;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1,
        }
      });

      // Hero -> Menu Transition
      tl.to(shiba.position, { x: 2.6, y: 0.2, duration: 1, ease: "none" }, 0);
      tl.to(shiba.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 1, ease: "none" }, 0);
      if (baseScale) {
        tl.to(shiba.scale, { x: baseScale, y: baseScale, z: baseScale, duration: 1, ease: "none" }, 0);
      }

      // Menu -> Dogs Transition
      tl.to(shiba.position, { x: -3, y: 0.2, duration: 1, ease: "none" }, 1);
      tl.to(shiba.rotation, { y: Math.PI / 4, duration: 1, ease: "none" }, 1);

      // Dogs -> Footer Transition
      tl.to(shiba.position, { x: 0, y: -1.5, z: 1, duration: 1, ease: "none" }, 2);
      tl.to(shiba.rotation, { y: 0, x: -Math.PI / 8, duration: 1, ease: "none" }, 2);
    });

    mm.add("(max-width: 1024px)", () => {
      const shiba = localGroup.current;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1,
        }
      });

      // Hero -> Menu Transition (Straight down)
      tl.to(shiba.position, { x: 0, y: 1.2, duration: 1, ease: "none" }, 0);
      tl.to(shiba.rotation, { x: 0, y: -Math.PI / 4, z: 0, duration: 1, ease: "none" }, 0);
      if (baseScale) {
        tl.to(shiba.scale, { x: baseScale, y: baseScale, z: baseScale, duration: 1, ease: "none" }, 0);
      }

      // Menu -> Dogs Transition (Straight down)
      tl.to(shiba.position, { x: 0, y: 1.2, duration: 1, ease: "none" }, 1);
      tl.to(shiba.rotation, { y: Math.PI / 4, duration: 1, ease: "none" }, 1);

      // Dogs -> Footer Transition
      tl.to(shiba.position, { x: 0, y: -1.5, z: 1, duration: 1, ease: "none" }, 2);
      tl.to(shiba.rotation, { y: 0, x: -Math.PI / 8, duration: 1, ease: "none" }, 2);
    });

  });

  return (
    <group 
      ref={(node) => {
        localGroup.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }} 
      {...props}
    >
      <primitive object={scene} />
    </group>
  );
});

useGLTF.preload('./Model/scene.gltf');
