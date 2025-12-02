import { useState } from 'react';
import { Html } from '@react-three/drei';
import dayjs from 'dayjs';
import { useStore } from '../../store';
import type { GeneratedData, FileNode, Group, Person } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FileBoxProps {
  file: FileNode;
  position: [number, number, number];
  isFlyMode: boolean;
}

const FileBox = ({ file, position, isFlyMode }: FileBoxProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1.5, 0.5, 0.5]} />
      <meshStandardMaterial 
        color={file.color} 
        transparent={isFlyMode}
        opacity={isFlyMode ? 0.5 : 1}
      />
      
      {/* Shadcn UI Tooltip */}
      {hovered && !isFlyMode && (
        <Html position={[0, 1, 0]} center style={{ pointerEvents: 'none', width: '200px', zIndex: 50 }}>
          <Card className="bg-slate-950 border-slate-700 shadow-2xl">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-sm text-slate-100 flex justify-between items-center">
                {file.name}
                <Badge variant="outline" className="text-[10px] h-5 capitalize text-slate-300 border-slate-600">
                  {file.action}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-1">
              <p className="text-xs text-slate-400">
                {dayjs(file.date).format('MMM D, YYYY')}
              </p>
            </CardContent>
          </Card>
        </Html>
      )}
    </mesh>
  );
};

interface FilesProps {
  data: GeneratedData;
}

const Files = ({ data }: FilesProps) => {
  const { viewMode, dimensions } = useStore();
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

        return (
          <FileBox 
            key={file.id} 
            file={file} 
            position={[x, y, z]} 
            isFlyMode={viewMode === 'fly'}
          />
        );
      })}
    </group>
  );
};

export default Files;