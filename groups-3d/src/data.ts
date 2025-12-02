import dayjs from 'dayjs';
import type { GeneratedData, FileAction, Priority, NodeShape } from './types';

export const generateData = (): GeneratedData => {
  const shapes: NodeShape[] = ['sphere'];
  
  const people = Array.from({ length: 8 }, (_, i) => ({
    id: `p-${i}`,
    name: ['Abbey', 'Beth', 'Chris', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank'][i],
    shape: shapes[i % shapes.length]
  }));

  const groups = Array.from({ length: 20 }, (_, i) => ({
    id: `g-${i}`,
    name: `Group ${i + 1} - ${['Alpha', 'Beta', 'Gamma', 'Delta'][i % 4]}`,
    yIndex: -i 
  }));

  const startDate = dayjs().startOf('month');
  
  const priorities: Priority[] = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'];

  const files = Array.from({ length: 200 }, (_, i) => {
    const randomGroup = groups[Math.floor(Math.random() * groups.length)];
    const randomPerson = people[Math.floor(Math.random() * people.length)];
    const randomDay = Math.floor(Math.random() * 30);
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);

    const actions: FileAction[] = ['paid', 'pending', 'rejected'];
    
    // Weight it slightly towards higher priorities for visual density
    const priorityIndex = Math.floor(Math.pow(Math.random(), 2) * priorities.length);
    const priority = priorities[Math.min(priorityIndex, priorities.length - 1)];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    return {
      id: `f-${i}`,
      name: `Invoice #${1000 + i}`,
      groupId: randomGroup.id,
      personId: randomPerson.id,
      date: startDate.add(randomDay, 'day').hour(randomHour).minute(randomMinute).toISOString(),
      action,
      priority
    };
  });

  return { people, groups, files, startDate };
};