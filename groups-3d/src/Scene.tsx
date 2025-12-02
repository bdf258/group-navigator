import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useStore } from './store';
import Rig from './components/ui/Rig';
import Files from './components/ui/Files';
import PeopleLayers from './components/ui/PeopleLayers'; 
import GroupLayers from './components/ui/GroupLayers';
import type { GeneratedData } from './types';

interface SceneProps {
  data: GeneratedData;
}

const Scene = ({ data }: SceneProps) => {
  const { viewMode, selectFile, selectPerson, selectGroup } = useStore();

  const handleBackgroundClick = () => {
    selectFile(null);
    selectPerson(null);
    selectGroup(null);
  };

  return (
    <Canvas 
      camera={{ position: [0, 0, 10], fov: 45 }}
      onPointerMissed={handleBackgroundClick} 
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Environment preset="city" />

      {/* Logic */}
      <Rig />
      {viewMode === 'fly' && <OrbitControls />}

      {/* Content */}
      <GroupLayers data={data} />
      <PeopleLayers data={data} />
      <Files data={data} />
      
      {/* Helper Grid - Only visible in grid/fly mode */}
      {(viewMode === 'grid' || viewMode === 'fly') && (
        <gridHelper 
          args={[200, 100, 0x555555, 0x222222]} 
          position={[50, -50, -20]} 
          rotation={[0, 0, 0]}
        />
      )}
    </Canvas>
  );
};

export default Scene;