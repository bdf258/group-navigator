import { useStore } from '../../store';
import type { GeneratedData } from '../../types';
import { Text } from '@react-three/drei';

interface GroupLayersProps {
  data: GeneratedData;
}

const GroupLayers = ({ data }: GroupLayersProps) => {
  const { dimensions, setFilterGroup, filters } = useStore();
  const { groups } = data;

  const handleGroupClick = (groupId: string, e: any) => {
    e.stopPropagation();
    setFilterGroup(groupId);
  };

  return (
    <group>
      {groups.map((group) => {
        const y = group.yIndex * dimensions.groupHeight;
        const x = -3; 
        const z = 0.5;

        // Visual State
        const isSelected = filters.groupId === group.id;
        // If filters are active, dim non-selected groups
        const isDimmed = filters.groupId && !isSelected;

        const color = isSelected ? '#3b82f6' : '#94a3b8';
        const opacity = isDimmed ? 0.3 : 1;

        return (
          <group 
            key={group.id} 
            position={[x, y, z]}
            onClick={(e) => handleGroupClick(group.id, e)}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
             <Text
                fontSize={1.2}
                color={color}
                anchorX="right"
                anchorY="middle"
                fillOpacity={opacity}
              >
                {group.name}
              </Text>

              {isSelected && (
                <mesh position={[1.5, -0.05, 0]}>
                   <boxGeometry args={[3, 0.1, 0.05]} />
                   <meshBasicMaterial color="#3b82f6" />
                </mesh>
              )}
          </group>
        );
      })}
    </group>
  );
};

export default GroupLayers;