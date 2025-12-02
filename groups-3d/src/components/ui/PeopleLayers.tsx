import { useStore } from '../../store';
import type { GeneratedData } from '../../types';
import { Text } from '@react-three/drei';

interface PeopleLayersProps {
  data: GeneratedData;
}

const PeopleLayers = ({ data }: PeopleLayersProps) => {
  const { dimensions } = useStore();
  const { people, groups } = data;

  // Calculate the total height of the grid to size the pillar
  const totalGridHeight = groups.length * dimensions.groupHeight;

  return (
    <group>
      {people.map((person, index) => {
        // Calculate Positions
        
        // Z: Depth based on person index
        const z = index * -dimensions.personDepth;
        
        // Y: Center of the vertical pillar
        // The grid goes from 0 down to -totalHeight. Center is -totalHeight / 2.
        const yCenter = -(totalGridHeight / 2);
        
        // X: Positioned to the left of the timeline (Day 0)
        const x = -4; 

        return (
          <group key={person.id} position={[x, 0, z]}>
            
            {/* 1. The Glass Pillar (Visual Guide for the Layer) */}
            <mesh position={[0, yCenter, 0]}>
              <boxGeometry args={[0.5, totalGridHeight, 0.1]} />
              <meshStandardMaterial 
                color={person.color} 
                transparent 
                opacity={0.1} 
                roughness={0.1}
              />
            </mesh>

            {/* 2. The Avatar (Placeholder Circle) */}
            {/* Positioned slightly above the first group (Y=0) */}
            <mesh position={[0, 1.5, 0]}>
              <circleGeometry args={[0.8, 32]} />
              <meshBasicMaterial color={person.color} />
              
              {/* Inner ring for "Avatar" look */}
              <mesh position={[0, 0, 0.01]}>
                 <circleGeometry args={[0.7, 32]} />
                 <meshBasicMaterial color="#1e293b" /> 
              </mesh>
               {/* Initials */}
              <Text
                position={[0, 0, 0.02]}
                fontSize={0.6}
                color={person.color}
                anchorX="center"
                anchorY="middle"
              >
                {person.name.substring(0, 2).toUpperCase()}
              </Text>
            </mesh>

            {/* 3. The Vertical Name */}
            <Text
              position={[0, -2, 0]} // Start slightly below the top
              rotation={[0, 0, -Math.PI / 2]} // Rotate 90 degrees clockwise
              fontSize={1}
              color={person.color}
              anchorX="right" // Anchor so it flows down from the position
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