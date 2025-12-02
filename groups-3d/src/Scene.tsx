import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useStore } from './store';
import Rig from './components/ui/Rig';
import Files from './components/ui/Files';
import PeopleLayers from './components/ui/PeopleLayers.tsx'; 
import type { GeneratedData } from './types';

interface SceneProps {
  data: GeneratedData;
}

const Scene = ({ data }: SceneProps) => {
  const viewMode = useStore((state) => state.viewMode);

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Environment preset="city" />

      {/* Logic */}
      <Rig />
      {viewMode === 'fly' && <OrbitControls />}

      {/* Content */}
      <PeopleLayers data={data} /> {/* <--- Add this */}
      <Files data={data} />
      
      {/* Helper Grid - Pushed lower to not interfere with text */}
      <gridHelper 
        args={[200, 100, 0x555555, 0x222222]} 
        position={[50, -50, -20]} 
        rotation={[0, 0, 0]}
      />
    </Canvas>
  );
};

export default Scene;