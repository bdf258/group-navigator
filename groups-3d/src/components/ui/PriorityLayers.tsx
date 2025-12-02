import { useStore } from '../../store';
import type { GeneratedData, Priority } from '../../types';
import { Text } from '@react-three/drei';
import { PRIORITY_LABELS, getNodeColor } from '@/lib/utils';

interface PriorityLayersProps {
  data: GeneratedData;
}

const PriorityLayers = ({ data }: PriorityLayersProps) => {
  const { dimensions, setFilterPriority, filters } = useStore();
  const { groups } = data;

  const totalHeight = groups.length * dimensions.groupHeight;
  
  const priorities = Object.keys(PRIORITY_LABELS) as Priority[];

  const handleClick = (p: Priority, e: any) => {
    e.stopPropagation();
    setFilterPriority(p);
  };

  return (
    <group>
      {priorities.map((pVal, index) => {
        const z = index * -dimensions.priorityDepth;
        const staircaseOffset = index * 1.5;
        const yTop = 8 + staircaseOffset; 
        const x = -4;

        const isSelected = filters.priority === pVal;
        const isDimmed = filters.priority && !isSelected;
        const opacity = isDimmed ? 0.2 : 1;
        
        // Use P1 color for label if P1, else a neutral or dark red?
        // Let's use the Paid/Green palette color for the label for consistency
        const color = getNodeColor('paid', pVal);

        return (
          <group 
            key={pVal} 
            position={[0, 0, z]} 
            onClick={(e) => handleClick(pVal, e)}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            {/* 1. Header Sphere */}
            <mesh position={[x, yTop, 0]}>
              <sphereGeometry args={[1.5, 32, 32]} />
              <meshStandardMaterial color={color} transparent opacity={opacity} />
            </mesh>

            {/* 2. Label */}
            <Text
              position={[x + 2.5, yTop, 0]}
              fontSize={1.5}
              color={color}
              anchorX="left"
              anchorY="middle"
              fillOpacity={opacity}
            >
              {PRIORITY_LABELS[pVal]}
            </Text>

            {/* 3. Lane Guide */}
            <mesh position={[dimensions.dayWidth * 15, -(totalHeight/2) + staircaseOffset, -1]} rotation={[-Math.PI/2, 0, 0]}>
               <planeGeometry args={[dimensions.dayWidth * 35, totalHeight + 10]} />
               <meshBasicMaterial color={color} transparent opacity={0.03} />
            </mesh>
            
            {/* Selected Indicator */}
            {isSelected && (
                <mesh position={[x, yTop - 2, 0]}>
                   <boxGeometry args={[4, 0.2, 0.1]} />
                   <meshBasicMaterial color="white" />
                </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

export default PriorityLayers;