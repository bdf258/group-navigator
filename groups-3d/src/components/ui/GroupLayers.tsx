import { useStore } from '../../store';
import type { GeneratedData } from '../../types';
import { Text } from '@react-three/drei';

interface GroupLayersProps {
  data: GeneratedData;
}

const GroupLayers = ({ data }: GroupLayersProps) => {
  const { dimensions, selectGroup, selectedGroupId, selectedFile } = useStore();
  const { groups } = data;

  const handleGroupClick = (groupId: string, e: any) => {
    e.stopPropagation();
    selectGroup(groupId);
  };

  return (
    <group>
      {groups.map((group) => {
        // Position
        // Y: Based on group index
        const y = group.yIndex * dimensions.groupHeight;
        // X: To the left of the timeline (start date is X=0)
        const x = -3; 
        // Z: "On the plane in front of Abbey" (Abbey is at Z=0, so we place this at Z=0 or slightly in front)
        const z = 0.5;

        // Visual State
        const isSelected = selectedGroupId === group.id;
        const isFileOwner = selectedFile?.groupId === group.id;
        const isActive = isSelected || isFileOwner;

        // Opacity/Color Logic
        const color = isActive ? 'white' : '#94a3b8'; // slate-400
        const opacity = (selectedGroupId && !isActive) ? 0.3 : 1;

        return (
          <group 
            key={group.id} 
            position={[x, y, z]}
            onClick={(e) => handleGroupClick(group.id, e)}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
             <Text
                fontSize={0.6}
                color={color}
                anchorX="right"
                anchorY="middle"
                fillOpacity={opacity}
              >
                {group.name}
              </Text>

              {/* Highlight Line if active */}
              {isActive && (
                <mesh position={[1.5, -0.05, 0]}>
                   <boxGeometry args={[3, 0.05, 0.05]} />
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