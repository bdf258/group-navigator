import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../../store';
import { Vector3 } from 'three';
import { useEffect, useRef, useState } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { OrthographicCamera } from 'three';

const Rig = () => {
  const { scrollX, scrollY, viewMode } = useStore();
  const controls = useThree((state) => state.controls) as unknown as OrbitControlsImpl;
  const camera = useThree((state) => state.camera) as OrthographicCamera;
  
  // Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionStart = useRef(0);
  
  // Start/End Values for interpolation
  const startPos = useRef(new Vector3());
  const startTarget = useRef(new Vector3());
  const startZoom = useRef(20);

  const endPosOffset = useRef(new Vector3());    
  const endTargetOffset = useRef(new Vector3()); 
  const endZoom = useRef(20);

  useEffect(() => {
    if (!controls) return;
    
    // Orthographic Distance (doesn't affect scale, just direction/clipping)
    const dist = 200;
    
    // Determine target config based on ViewMode
    if (viewMode === 'front') { 
      // Groups x Time (Standard)
      endPosOffset.current.set(70, 0, dist);
      endTargetOffset.current.set(70, 0, 0);
      endZoom.current = 9; 

    } else if (viewMode === 'top') { 
      // Time x People (Top Down)
      // Looking down Y axis, Z is up on screen
      endPosOffset.current.set(50, dist, 20);
      endTargetOffset.current.set(50, 0, 20);
      endZoom.current = 7; // Slightly zoomed out
    } else if (viewMode === 'side') { 
      // People x Groups (Side)
      // Looking from Left (-X)
      endPosOffset.current.set(-dist, 0, -20);
      endTargetOffset.current.set(0, 0, -20);
      endZoom.current = 10; 
    }

    // Capture start state
    startPos.current.copy(camera.position);
    startTarget.current.copy(controls.target);
    startZoom.current = camera.zoom;
    
    // Trigger Transition
    transitionStart.current = Date.now();
    setIsTransitioning(true);

  }, [viewMode, controls, camera]);

  useFrame(() => {
    if (!controls) return;
// --- 1. Sync ScrollX (Time) ---
    // If timeline scrolls, move camera X
    const currentTargetX = controls.target.x;
    
    // FIX: Add endTargetOffset.current.x to the desired position
    // This tells the sync: "The correct place is scrollX PLUS my manual offset"
    const desiredTargetX = scrollX + endTargetOffset.current.x;
    
    const deltaX = desiredTargetX - currentTargetX;
    
    if (Math.abs(deltaX) > 0.0001) {
       controls.target.x = desiredTargetX;
       camera.position.x += deltaX;
       
       startPos.current.x += deltaX;
       startTarget.current.x += deltaX;
    }

    // --- 2. Sync ScrollY (Vertical Pan) ---
    let targetY = 0;
    let targetZ = 0;
    
    if (viewMode === 'top') {
      targetZ = scrollY;
      
      const currentTargetZ = controls.target.z;
      // FIX: Add offset here too if you plan to offset Z in top view
      const desiredTargetZ = targetZ + endTargetOffset.current.z;
      
      const deltaZ = desiredTargetZ - currentTargetZ;
      if (Math.abs(deltaZ) > 0.0001) {
        controls.target.z = desiredTargetZ;
        camera.position.z += deltaZ;
        startPos.current.z += deltaZ;
        startTarget.current.z += deltaZ;
      }
    } else {
      // Front/Side View
      targetY = scrollY;
      
      const currentTargetY = controls.target.y;
      
      // FIX: Add endTargetOffset.current.y so vertical offset is respected
      const desiredTargetY = targetY + endTargetOffset.current.y;

      const deltaY = desiredTargetY - currentTargetY;
      if (Math.abs(deltaY) > 0.0001) {
        controls.target.y = desiredTargetY;
        camera.position.y += deltaY;
        startPos.current.y += deltaY;
        startTarget.current.y += deltaY;
      }
    }
    // --- 3. View Mode Transition ---
    if (isTransitioning) {
      const now = Date.now();
      const duration = 1000;
      const t = Math.min((now - transitionStart.current) / duration, 1);
      
      const ease = 1 - (1 - t) * (1 - t);

      // Interpolate Position
      const targetPos = new Vector3(
          scrollX + endPosOffset.current.x,
          targetY + endPosOffset.current.y,
          targetZ + endPosOffset.current.z
      );
      
      // Interpolate LookAt
      const targetLookAt = new Vector3(
          scrollX + endTargetOffset.current.x,
          targetY + endTargetOffset.current.y,
          targetZ + endTargetOffset.current.z
      );
      
      camera.position.lerpVectors(startPos.current, targetPos, ease);
      controls.target.lerpVectors(startTarget.current, targetLookAt, ease);
      
      // Interpolate Zoom (Orthographic)
      camera.zoom = startZoom.current + (endZoom.current - startZoom.current) * ease;
      camera.updateProjectionMatrix();
      
      controls.update();

      if (t >= 1) {
        setIsTransitioning(false);
      }
    }
  });

  return null;
};

export default Rig;