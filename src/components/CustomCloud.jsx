import React, { useMemo, useRef } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export const CustomCloud = (props) => {
  const { scene } = useGLTF('./Model/cloud/scene.gltf');
  // Clone the scene so we can reuse the model multiple times independently
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const innerGroup = useRef();

  // Randomize the animation parameters so every cloud behaves organically
  const timeOffset = useMemo(() => Math.random() * 10, []);
  const bobSpeed = useMemo(() => 0.5 + Math.random() * 0.5, []);
  const bobHeight = useMemo(() => 0.2 + Math.random() * 0.3, []);
  const rotSpeed = useMemo(() => (Math.random() - 0.5) * 0.2, []);

  useFrame((state) => {
    if (innerGroup.current) {
      const t = state.clock.elapsedTime + timeOffset;
      // Gentle hover up and down
      innerGroup.current.position.y = Math.sin(t * bobSpeed) * bobHeight;
      // Slow subtle rotation over time
      innerGroup.current.rotation.y = t * rotSpeed;
      innerGroup.current.rotation.z = Math.sin(t * rotSpeed * 0.5) * 0.1;
    }
  });

  return (
    <group {...props}>
      {/* Inner group handles the continuous animation without overriding the prop position */}
      <group ref={innerGroup}>
        <Center>
          <primitive object={clonedScene} scale={0.01} />
        </Center>
      </group>
    </group>
  );
};

useGLTF.preload('./Model/cloud/scene.gltf');
