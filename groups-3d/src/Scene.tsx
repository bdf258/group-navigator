import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, OrthographicCamera } from '@react-three/drei';
import { useStore } from './store';
import Rig from './components/ui/Rig';
import Files from './components/ui/Files';
import PriorityLayers from './components/ui/PriorityLayers';
import GroupLayers from './components/ui/GroupLayers';
import SceneTimeline from './components/ui/SceneTimeline';
import type { GeneratedData } from './types';

interface SceneProps {
  data: GeneratedData;
  enableZoom: boolean;
}

const Scene = ({ data, enableZoom }: SceneProps) => {
  const { clearFilters } = useStore();

  const handleBackgroundClick = () => {
    clearFilters();
  };

  return (
    <Canvas onPointerMissed={handleBackgroundClick}>
      {/* Orthographic Camera Setup */}
      <OrthographicCamera makeDefault position={[0, 0, 100]} zoom={20} near={-2000} far={2000} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 50]} intensity={1} />
      <Environment preset="city" />

      {/* Controls & Navigation */}
      <OrbitControls makeDefault enableZoom={enableZoom} />
      <Rig />

      {/* Content */}
      <SceneTimeline data={data} />
      <GroupLayers data={data} />
      <PriorityLayers data={data} />
      <Files data={data} />
    
    </Canvas>
  );
};

export default Scene;