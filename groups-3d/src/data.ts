import dayjs from 'dayjs';
import type { GeneratedData, FileAction } from './types';

export const generateData = (): GeneratedData => {
  const people = Array.from({ length: 8 }, (_, i) => ({
    id: `p-${i}`,
    name: ['Abbey', 'Beth', 'Chris', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank'][i],
    color: `hsl(${i * 45}, 70%, 50%)`,
    zIndex: -i 
  }));

  const groups = Array.from({ length: 20 }, (_, i) => ({
    id: `g-${i}`,
    name: `Group ${i + 1} - ${['Alpha', 'Beta', 'Gamma', 'Delta'][i % 4]}`,
    yIndex: -i 
  }));

  const startDate = dayjs().startOf('month');
  
  const files = Array.from({ length: 100 }, (_, i) => {
    const randomGroup = groups[Math.floor(Math.random() * groups.length)];
    const randomPerson = people[Math.floor(Math.random() * people.length)];
    const randomDay = Math.floor(Math.random() * 30);
    const actions: FileAction[] = ['paid', 'pending', 'rejected'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    return {
      id: `f-${i}`,
      name: `Invoice #${1000 + i}`,
      groupId: randomGroup.id,
      personId: randomPerson.id,
      date: startDate.add(randomDay, 'day').toISOString(),
      action,
      color: action === 'paid' ? '#22c55e' : action === 'pending' ? '#eab308' : '#ef4444'
    };
  });

  return { people, groups, files, startDate };
};