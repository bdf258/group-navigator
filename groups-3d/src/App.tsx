import { useMemo } from 'react';
import type { UIEvent, WheelEvent } from 'react';
import { generateData } from './data';
import { useStore } from './store';
import Scene from './Scene';
import { Box, Layers, MousePointer2 } from 'lucide-react';

// Shadcn Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const App = () => {
  const data = useMemo(() => generateData(), []);
  
  const { 
    setScrollX, setScrollY, setScrollZ, scrollZ,
    viewMode, setViewMode, 
    dimensions, pixelsPerUnit 
  } = useStore();

  // "Fake" Dimensions for scrollbars
  const totalDays = 30;
  const timelineWidth = totalDays * dimensions.dayWidth * pixelsPerUnit;
  
  const totalGroups = data.groups.length;
  const sidebarHeight = totalGroups * dimensions.groupHeight * pixelsPerUnit;

  // Handlers
  const handleScrollY = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const y3d = -(target.scrollTop / pixelsPerUnit); 
    setScrollY(y3d);
  };

  const handleScrollX = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const x3d = target.scrollLeft / pixelsPerUnit;
    setScrollX(x3d);
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (viewMode === 'fly') return;
    
    const sensitivity = 0.05;
    const newZ = scrollZ + (e.deltaY * sensitivity);
    setScrollZ(newZ);
  };

  // NEW: Handle wheel specifically for the timeline
  const handleTimelineWheel = (e: WheelEvent<HTMLDivElement>) => {
    // If the user uses a trackpad with horizontal scrolling (deltaX), let native behavior work.
    // If the user uses a mouse wheel (deltaY), force horizontal scroll.
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* TOP HEADER */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 z-20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-md">
            <Box className="text-white h-4 w-4" />
          </div>
          <h1 className="font-bold text-sm tracking-tight text-slate-100">
            Dimension<span className="text-blue-500">View</span>
          </h1>
          <Badge variant="secondary" className="ml-2 text-xs bg-slate-800 text-slate-400 hover:bg-slate-700">
            Beta
          </Badge>
        </div>

        <div className="flex gap-2">
           <Button 
            variant={viewMode === 'fly' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'fly' : 'grid')}
            className={`gap-2 ${viewMode === 'grid' ? 'border-slate-700 hover:bg-slate-800 hover:text-white' : ''}`}
          >
            {viewMode === 'grid' ? <MousePointer2 size={14} /> : <Layers size={14} />}
            {viewMode === 'grid' ? 'Enter Fly Mode' : 'Exit Fly Mode'}
          </Button>
        </div>
      </header>

      {/* MAIN GRID LAYOUT */}
      <div className="flex-1 grid grid-cols-[250px_1fr] grid-rows-[1fr_60px] overflow-hidden relative">
        
        {/* 1. LEFT SIDEBAR (Groups) */}
        <div 
          // Added standard "hide scrollbar" classes for all browsers
          className="row-start-1 col-start-1 border-r border-slate-800 bg-slate-900/95 overflow-y-scroll relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          onScroll={handleScrollY}
        >
          {/* Overlay Content */}
          <div className="absolute top-0 left-0 w-full pointer-events-none">
             {data.groups.map((g) => (
                <div 
                  key={g.id} 
                  className="flex flex-col justify-center px-4 border-b border-slate-800/50"
                  style={{ height: `${dimensions.groupHeight * pixelsPerUnit}px` }}
                >
                  <span className="text-sm font-medium text-slate-300 truncate">{g.name}</span>
                  <span className="text-[10px] text-slate-500">ID: {g.id.toUpperCase()}</span>
                </div>
             ))}
          </div>
          {/* Spacer */}
          <div style={{ height: `${sidebarHeight}px`, width: '1px' }} />
        </div>

        {/* 2. CENTER (Canvas) */}
        <div 
          className="row-start-1 row-end-2 col-start-2 relative bg-slate-950"
          onWheel={handleWheel}
        >
          <div className="absolute inset-0">
             <Scene data={data} />
          </div>
          
          {/* Instructions Card */}
          <div className="absolute top-4 right-4 pointer-events-none opacity-60">
             <div className="text-xs text-right space-y-1">
                <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-900/50 mr-1">Vertical: Groups</Badge>
                <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-900/50 mr-1">Horizontal: Time</Badge>
                <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-900/50">Wheel: Depth</Badge>
             </div>
          </div>
        </div>

        {/* 3. BOTTOM BAR (Time) */}
        <div 
          // UPDATED: Added tailwind arbitrary values to hide scrollbars and added onWheel
          className="row-start-2 col-start-2 border-t border-slate-800 bg-slate-900/95 overflow-x-scroll overflow-y-hidden relative z-10 flex items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          onScroll={handleScrollX}
          onWheel={handleTimelineWheel} 
        >
          {/* Spacer */}
          <div style={{ width: `${timelineWidth}px`, height: '1px' }} className="relative">
             {Array.from({ length: totalDays }).map((_, i) => (
               <div 
                 key={i} 
                 className="absolute top-0 h-full border-l border-slate-700/50 text-[10px] text-slate-500 pl-1 pt-1 font-mono"
                 style={{ left: `${i * dimensions.dayWidth * pixelsPerUnit}px` }}
               >
                 {data.startDate.add(i, 'day').format('MMM DD')}
               </div>
             ))}
          </div>
        </div>

        {/* 4. CORNER (Empty) */}
        <div className="row-start-2 col-start-1 bg-slate-900 border-t border-r border-slate-800 z-10 flex flex-col items-center justify-center">
           <span className="text-[10px] text-slate-600 font-mono">X / Y / Z</span>
           <Separator className="w-8 my-1 bg-slate-800" />
        </div>

      </div>
    </div>
  );
};

export default App;