import { useState } from 'react';
import dayjs from 'dayjs';
import { useStore } from '../../store';
import type { GeneratedData, FileNode, Group, Person } from '../../types';

interface FilePillProps {
  file: FileNode;
  position: [number, number, number];
  isFlyMode: boolean;
  opacity: number;
}

const FilePill = ({ file, position, isFlyMode, opacity }: FilePillProps) => {
  const [hovered, setHovered] = useState(false);
  const { selectFile } = useStore();

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectFile(file);
  };

  const radius = 0.25;
  const length = 1.0; 

  return (
    <group position={position} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      
      {/* 1. Main Body */}
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, length, 32]} />
        <meshStandardMaterial color={file.color} transparent opacity={opacity} />
      </mesh>

      {/* 2. Caps */}
       <mesh position={[-length / 2, 0, 0]}>
          <sphereGeometry args={[radius, 32, 16]} />
          <meshStandardMaterial color={file.color} transparent opacity={opacity} />
       </mesh>

       <mesh position={[length / 2, 0, 0]}>
          <sphereGeometry args={[radius, 32, 16]} />
          <meshStandardMaterial color={file.color} transparent opacity={opacity} />
       </mesh>

      {/* Hover Effect */}
      {hovered && (
        <group>
           <mesh rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry args={[radius * 1.1, radius * 1.1, length, 32]} />
              <meshBasicMaterial color="white" transparent opacity={0.2} side={1} /> 
           </mesh>
           <mesh position={[-length / 2, 0, 0]}>
              <sphereGeometry args={[radius * 1.1, 32, 16]} />
              <meshBasicMaterial color="white" transparent opacity={0.2} side={1} /> 
           </mesh>
           <mesh position={[length / 2, 0, 0]}>
              <sphereGeometry args={[radius * 1.1, 32, 16]} />
              <meshBasicMaterial color="white" transparent opacity={0.2} side={1} /> 
           </mesh>
        </group>
      )}
    </group>
  );
};

interface FilesProps {
  data: GeneratedData;
}

const Files = ({ data }: FilesProps) => {
  const { viewMode, dimensions, selectedFile, selectedPersonId, selectedGroupId } = useStore();
  const { files, groups, people, startDate } = data;

  return (
    <group>
      {files.map((file: FileNode) => {
        const dayDiff = dayjs(file.date).diff(startDate, 'day');
        const x = dayDiff * dimensions.dayWidth;

        const groupIndex = groups.findIndex((g: Group) => g.id === file.groupId);
        const y = groupIndex * -dimensions.groupHeight;

        const personIndex = people.findIndex((p: Person) => p.id === file.personId);
        const z = personIndex * -dimensions.personDepth;
        
        // Opacity Logic
        let opacity = 1;
        
        if (selectedFile) {
          opacity = selectedFile.id === file.id ? 1 : 0.3;
        } else if (selectedPersonId) {
          opacity = file.personId === selectedPersonId ? 1 : 0.3;
        } else if (selectedGroupId) {
          opacity = file.groupId === selectedGroupId ? 1 : 0.3;
        }

        if (viewMode === 'fly') opacity = 0.5;

        return (
          <FilePill 
            key={file.id} 
            file={file} 
            position={[x, y, z]} 
            isFlyMode={viewMode === 'fly'}
            opacity={opacity}
          />
        );
      })}
    </group>
  );
};

export default Files;