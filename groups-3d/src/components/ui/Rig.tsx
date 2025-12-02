import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store';
import { Vector3, PerspectiveCamera } from 'three';

const Rig = () => {
  const { scrollX, scrollY, scrollZ, viewMode } = useStore();

  useFrame((state) => {
    // Explicitly cast to PerspectiveCamera to satisfy TypeScript
    const camera = state.camera as PerspectiveCamera;

    if (viewMode === 'fly') {
      camera.fov = 45;
      camera.updateProjectionMatrix();
      return; 
    }

    let targetPos = new Vector3(scrollX, scrollY, scrollZ);
    let targetLookAt = new Vector3(scrollX, scrollY, 0); 
    let targetFov = 45;

    if (viewMode === 'grid') {
      // Standard View
      targetPos.set(scrollX, scrollY, scrollZ);
      targetLookAt.set(scrollX, scrollY, 0);
      targetFov = 45;
    } 
    else if (viewMode === 'top') {
      // Time x People (Top Down)
      const distance = 100;
      targetPos.set(scrollX, distance, -20); 
      targetLookAt.set(scrollX, 0, -20); 
      
      camera.up.set(0, 0, -1);
      
      targetFov = 10; 
    } 
    else if (viewMode === 'side') {
      // People x Groups (Side View)
      const distance = 100;
      targetPos.set(-distance, scrollY, -20);
      targetLookAt.set(0, scrollY, -20);

      camera.up.set(0, 1, 0);
      
      targetFov = 10;
    }

    if (viewMode === 'grid') {
       camera.up.set(0, 1, 0);
    }

    // Apply
    camera.position.lerp(targetPos, 0.1);
    camera.lookAt(targetLookAt);
    
    // Smooth FOV transition
    camera.fov += (targetFov - camera.fov) * 0.1;
    camera.updateProjectionMatrix();
  });

  return null;
};

export default Rig;