import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, OrthographicCamera } from '@react-three/drei';
import { useStore } from './store';
import Rig from './components/ui/Rig';
import Files from './components/ui/Files';
import PeopleLayers from './components/ui/PeopleLayers'; 
import GroupLayers from './components/ui/GroupLayers';
import type { GeneratedData } from './types';

interface SceneProps {
  data: GeneratedData;
  enableZoom: boolean;
}

const Scene = ({ data, enableZoom }: SceneProps) => {
  const { selectFile, selectPerson, selectGroup } = useStore();

  const handleBackgroundClick = () => {
    selectFile(null);
    selectPerson(null);
    selectGroup(null);
  };

  return (
    <Canvas onPointerMissed={handleBackgroundClick}>
      {/* Orthographic Camera Setup */}
      <OrthographicCamera makeDefault position={[0, 0, 100]} zoom={20} near={-200} far={2000} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Environment preset="city" />

      {/* Controls & Navigation */}
      <OrbitControls makeDefault enableZoom={enableZoom} />
      <Rig />

      {/* Content */}
      <GroupLayers data={data} />
      <PeopleLayers data={data} />
      <Files data={data} />
    
    </Canvas>
  );
};

export default Scene;