import { useMemo, useRef, useEffect } from 'react';
import type { UIEvent, WheelEvent } from 'react';
import { generateData } from './data';
import { useStore } from './store';
import Scene from './Scene';
import { Box, Layers, MousePointer2, X, Map, LayoutGrid } from 'lucide-react';
import dayjs from 'dayjs';

// Shadcn Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const App = () => {
  const data = useMemo(() => generateData(), []);
  
  const { 
    setScrollX, setScrollZ, 
    scrollX, scrollY, scrollZ,
    viewMode, setViewMode, 
    dimensions, pixelsPerUnit,
    selectedFile, selectFile 
  } = useStore();

  const timelineRef = useRef<HTMLDivElement>(null);

  const totalDays = 30;
  const timelineWidth = totalDays * dimensions.dayWidth * pixelsPerUnit;

  // --- Synchronization ---
  useEffect(() => {
    if (timelineRef.current) {
      const targetLeft = scrollX * pixelsPerUnit;
      if (Math.abs(timelineRef.current.scrollLeft - targetLeft) > 1) {
        timelineRef.current.scrollLeft = targetLeft;
      }
    }
  }, [scrollX, pixelsPerUnit]);

  // --- Handlers ---
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
    if (selectedFile) selectFile(null);
  };

  const handleTimelineWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* TOP HEADER */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 z-20 shadow-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-md">
            <Box className="text-white h-4 w-4" />
          </div>
          <h1 className="font-bold text-sm tracking-tight text-slate-100">
            Dimension<span className="text-blue-500">View</span>
          </h1>
        </div>

        <div className="flex gap-2">
           <Button 
            variant={viewMode === 'top' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode(viewMode === 'top' ? 'grid' : 'top')}
            className="gap-2 border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <Map size={14} /> Time x People
          </Button>
          
          <Button 
            variant={viewMode === 'side' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode(viewMode === 'side' ? 'grid' : 'side')}
            className="gap-2 border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <LayoutGrid size={14} /> People x Groups
          </Button>

           <Separator orientation="vertical" className="h-6 bg-slate-700 mx-2" />

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

      {/* MAIN LAYOUT: Removed Left Sidebar */}
      <div className="flex-1 grid grid-cols-[1fr_300px] grid-rows-[1fr_60px] overflow-hidden relative">
        
        {/* 1. CENTER (Canvas) */}
        <div 
          className="row-start-1 row-end-2 col-start-1 relative bg-slate-950"
          onWheel={handleWheel}
        >
          <div className="absolute inset-0">
             <Scene data={data} />
          </div>
        </div>

        {/* 2. RIGHT PANEL (Details) */}
        <div className="row-start-1 row-end-3 col-start-2 border-l border-slate-800 bg-slate-900 z-20 flex flex-col">
          {selectedFile ? (
            <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
               <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                  <span className="font-semibold text-sm">File Details</span>
                  <Button variant="ghost" size="icon-sm" onClick={() => selectFile(null)}>
                    <X size={16} />
                  </Button>
               </div>
               
               <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                 <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedFile.name}</h2>
                    <Badge 
                      className="capitalize"
                      style={{ 
                        backgroundColor: selectedFile.color, 
                        color: selectedFile.action === 'pending' ? 'black' : 'white' 
                      }}
                    >
                      {selectedFile.action}
                    </Badge>
                 </div>

                 <Card className="bg-slate-950 border-slate-800">
                    <CardHeader className="pb-2">
                       <CardTitle className="text-sm text-slate-400">Owner</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="text-lg font-medium text-white">
                         {data.people.find(p => p.id === selectedFile.personId)?.name}
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="bg-slate-950 border-slate-800">
                    <CardHeader className="pb-2">
                       <CardTitle className="text-sm text-slate-400">Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="text-lg font-medium text-white">
                         {dayjs(selectedFile.date).format('dddd, MMMM D, YYYY')}
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="bg-slate-950 border-slate-800">
                    <CardHeader className="pb-2">
                       <CardTitle className="text-sm text-slate-400">Group</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="text-lg font-medium text-white">
                         {data.groups.find(g => g.id === selectedFile.groupId)?.name}
                       </div>
                    </CardContent>
                 </Card>
               </div>
            </div>
          ) : (
             <div className="flex flex-col h-full items-center justify-center text-slate-500 p-8 text-center">
                <div className="bg-slate-800/50 p-4 rounded-full mb-4">
                  <MousePointer2 size={24} className="opacity-50" />
                </div>
                <p className="text-sm">Select a file, person, or group to view details.</p>
             </div>
          )}
        </div>

        {/* 3. BOTTOM BAR (Time) */}
        <div 
          ref={timelineRef}
          className="row-start-2 col-start-1 border-t border-slate-800 bg-slate-900/95 overflow-x-scroll overflow-y-hidden relative z-10 flex items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          onScroll={handleScrollX}
          onWheel={handleTimelineWheel} 
        >
          <div style={{ width: `${timelineWidth}px`, height: '1px' }} className="relative">
             {Array.from({ length: totalDays }).map((_, i) => {
               const dayDate = data.startDate.add(i, 'day');
               const isSelectedDay = selectedFile && dayjs(selectedFile.date).isSame(dayDate, 'day');
               
               return (
                 <div 
                   key={i} 
                   className={`absolute top-0 h-full pl-1 pt-1 font-mono transition-all duration-300 ${
                      isSelectedDay 
                        ? 'border-l-2 border-white bg-slate-800 text-white font-bold z-10' 
                        : 'border-l border-slate-700/50 text-[10px] text-slate-500'
                   }`}
                   style={{ 
                     left: `${i * dimensions.dayWidth * pixelsPerUnit}px`,
                     width: `${dimensions.dayWidth * pixelsPerUnit}px` 
                   }}
                 >
                   {dayDate.format('MMM DD')}
                 </div>
               );
             })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;