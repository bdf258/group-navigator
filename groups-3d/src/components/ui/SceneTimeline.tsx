import { Text } from '@react-three/drei';
import type { GeneratedData } from '../../types';
import { useStore } from '../../store';

interface SceneTimelineProps {
  data: GeneratedData;
}

const SceneTimeline = ({ data }: SceneTimelineProps) => {
  const { dimensions, setFilterDate, filters } = useStore();
  const { startDate, groups } = data;
  
  const totalDays = 30;
  const totalHeight = groups.length * dimensions.groupHeight;
  const topY = 4; 
  const bottomY = -(totalHeight + 5);

  const handleDateClick = (dateStr: string, e: any) => {
      e.stopPropagation();
      setFilterDate(dateStr);
  };

  return (
    <group>
      {Array.from({ length: totalDays }).map((_, i) => {
        const date = startDate.add(i, 'day');
        const dateStr = date.format('YYYY-MM-DD');
        const x = i * dimensions.dayWidth;
        const isWeekStart = i % 7 === 0;
        
        const isSelected = filters.date === dateStr;
        const isDimmed = filters.date && !isSelected;
        const opacity = isDimmed ? 0.3 : 1;
        const color = isSelected ? '#3b82f6' : (isWeekStart ? "#ffffff" : "#94a3b8");

        return (
          <group 
            key={i} 
            position={[x, 0, 0]}
            onClick={(e) => handleDateClick(dateStr, e)}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            {/* Top Date */}
            <Text
              position={[0, topY, 0]}
              fontSize={isWeekStart ? 0.8 : 0.5}
              color={color}
              fillOpacity={opacity}
              anchorX="center"
              anchorY="bottom"
            >
              {date.format('MMM DD')}
            </Text>
            
            {/* Top Tick */}
            <mesh position={[0, topY - 0.5, 0]}>
               <boxGeometry args={[0.1, 0.5, 0.1]} />
               <meshBasicMaterial color={color} transparent opacity={opacity} />
            </mesh>

            {/* Bottom Date */}
            <Text
              position={[0, bottomY, 0]}
              fontSize={isWeekStart ? 0.8 : 0.5}
              color={color}
              fillOpacity={opacity}
              anchorX="center"
              anchorY="top"
            >
              {date.format('MMM DD')}
            </Text>

            {/* Bottom Tick */}
            <mesh position={[0, bottomY + 0.5, 0]}>
               <boxGeometry args={[0.1, 0.5, 0.1]} />
               <meshBasicMaterial color={color} transparent opacity={opacity} />
            </mesh>

            {/* Vertical Guide Line */}
            {isWeekStart && (
                <mesh position={[0, -totalHeight/2, -5]}>
                    <planeGeometry args={[0.05, totalHeight + 10]} />
                    <meshBasicMaterial color="#1e293b" />
                </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

export default SceneTimeline;