import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useStore } from '../../store';
import { getNodeColor } from '@/lib/utils';
import type { GeneratedData, FileNode, Group, Person, NodeShape } from '../../types';

interface NodeGeometryProps {
  shape: NodeShape;
  color: string;
  opacity: number;
}

const NodeGeometry = ({ shape }: NodeGeometryProps) => {
  // Base size scalar
  const s = 1.2; 

  switch (shape) {
    case 'box': return <boxGeometry args={[s, s, s]} />;
    case 'sphere': return <sphereGeometry args={[s/1.5, 32, 32]} />;
    case 'cone': return <coneGeometry args={[s/1.5, s, 32]} />;
    case 'cylinder': return <cylinderGeometry args={[s/1.5, s/1.5, s, 32]} />;
    case 'torus': return <torusGeometry args={[s/2, s/6, 16, 32]} />;
    case 'dodecahedron': return <dodecahedronGeometry args={[s/1.5]} />;
    case 'octahedron': return <octahedronGeometry args={[s/1.5]} />;
    case 'icosahedron': return <icosahedronGeometry args={[s/1.5]} />;
    default: return <boxGeometry args={[s, s, s]} />;
  }
};

interface FileNode3DProps {
  file: FileNode;
  person: Person;
  position: [number, number, number];
  opacity: number;
}

const FileNode3D = ({ file, person, position, opacity }: FileNode3DProps) => {
  const [hovered, setHovered] = useState(false);
  const { selectFile } = useStore();
  const color = useMemo(() => getNodeColor(file.action, file.priority), [file.action, file.priority]);

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

  return (
    <group 
      position={position} 
      onClick={handleClick} 
      onPointerOver={handlePointerOver} 
      onPointerOut={handlePointerOut}
      scale={hovered ? 1.2 : 1}
    >
      <mesh>
        <NodeGeometry shape={person.shape} color={color} opacity={opacity} />
        <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={opacity} 
            roughness={0.3}
        />
      </mesh>
    </group>
  );
};

interface FilesProps {
  data: GeneratedData;
}

const Files = ({ data }: FilesProps) => {
  const { dimensions, selectedFile, filters } = useStore();
  const { files, groups, people, startDate } = data;

  const priorityOrder: Record<string, number> = { 
    p1: 0, p2: 1, p3: 2, p4: 3, p5: 4, p6: 5, p7: 6, p8: 7, p9: 8 
  };

  return (
    <group>
      {files.map((file: FileNode) => {
        // X: Time
        const fileDate = dayjs(file.date);
        const dayDiff = fileDate.diff(startDate, 'day', true);
        const x = dayDiff * dimensions.dayWidth;

        // Y: Group + Staircase
        const groupIndex = groups.findIndex((g: Group) => g.id === file.groupId);
        const baseGroupY = groupIndex * -dimensions.groupHeight;
        
        // Z: Priority
        const pIndex = priorityOrder[file.priority];
        const z = pIndex * -dimensions.priorityDepth; 

        // Staircase offset
        // const staircaseOffset = pIndex * 1.5; 
        const y = baseGroupY;

        const person = people.find(p => p.id === file.personId) || people[0];
        
        // Opacity / Filter Logic
        let opacity = 1;
        
        if (selectedFile) {
          // Focus on specific file
          opacity = selectedFile.id === file.id ? 1 : 0.1;
        } else {
          // Check filters (Intersection/AND logic)
          const matchGroup = !filters.groupId || filters.groupId === file.groupId;
          const matchPriority = !filters.priority || filters.priority === file.priority;
          const matchDate = !filters.date || dayjs(file.date).isSame(dayjs(filters.date), 'day');

          if (!matchGroup || !matchPriority || !matchDate) {
            opacity = 0.1;
          }
        }

        return (
          <FileNode3D 
            key={file.id} 
            file={file} 
            person={person}
            position={[x, y, z]} 
            opacity={opacity}
          />
        );
      })}
    </group>
  );
};

export default Files;