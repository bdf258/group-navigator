import { useStore } from '../../store';
import type { GeneratedData } from '../../types';
import { Text } from '@react-three/drei';

interface PeopleLayersProps {
  data: GeneratedData;
}

const PeopleLayers = ({ data }: PeopleLayersProps) => {
  const { dimensions } = useStore();
  const { people, groups } = data;

  const totalGridHeight = groups.length * dimensions.groupHeight;

  return (
    <group>
      {people.map((person, index) => {
        const z = index * -dimensions.personDepth;
        const yCenter = -(totalGridHeight / 2);
        const x = -5; // Moved further left

        return (
          <group key={person.id} position={[x, 0, z]}>
            {/* Visual Guide Pillar */}
            <mesh position={[0, yCenter, 0]}>
              <boxGeometry args={[0.5, totalGridHeight, 0.2]} />
              <meshStandardMaterial 
                color={person.color} 
                transparent 
                opacity={0.05} 
                depthWrite={false}
              />
            </mesh>

            {/* Avatar */}
            <mesh position={[0, 2, 0]}>
              <circleGeometry args={[1.5, 32]} />
              <meshBasicMaterial color={person.color} />
              <mesh position={[0, 0, 0.01]}>
                 <circleGeometry args={[1.3, 32]} />
                 <meshBasicMaterial color="#1e293b" /> 
              </mesh>
              <Text
                position={[0, 0, 0.02]}
                fontSize={1}
                color={person.color}
                anchorX="center"
                anchorY="middle"
              >
                {person.name.substring(0, 2).toUpperCase()}
              </Text>
            </mesh>
            
            <Text
              position={[0, -2, 0]} 
              rotation={[0, 0, -Math.PI / 2]} 
              fontSize={1.5} // Bigger font
              color={person.color}
              anchorX="right"
              anchorY="middle"
              fillOpacity={0.8}
            >
              {person.name.toUpperCase()}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

export default PeopleLayers;