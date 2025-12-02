import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store';

const Rig = () => {
  const { scrollX, scrollY, scrollZ, viewMode } = useStore();

  useFrame((state) => {
    if (viewMode === 'fly') return; 

    const targetX = scrollX;
    const targetY = scrollY;
    const targetZ = scrollZ;

    // Directly set camera position for a rigid feel
    state.camera.position.set(targetX, targetY, targetZ);
    
    // Look straight ahead at the plane Z=0
    state.camera.lookAt(targetX, targetY, 0);
  });

  return null;
};

export default Rig;