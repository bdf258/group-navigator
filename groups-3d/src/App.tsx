import { useMemo, useState } from 'react';
import type { WheelEvent, PointerEvent } from 'react';
import { generateData } from './data';
import { useStore } from './store';
import Scene from './Scene';
import { Box, X, Map, LayoutGrid, Monitor, ChevronDown, ChevronUp, Info, Filter } from 'lucide-react';
import dayjs from 'dayjs';
import { getNodeColor, PRIORITY_LABELS } from '@/lib/utils';
import type { Priority } from './types';

// Shadcn Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Legend = ({ people }: { people: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-2 left-4 z-50 w-64 bg-slate-900/90 border border-slate-700 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden flex flex-col transition-all duration-300">
      <div 
        className="p-3 bg-slate-800 flex justify-between items-center cursor-pointer hover:bg-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
           <Info size={16} className="text-blue-400"/>
           <span className="font-semibold text-sm text-white">Legend</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </div>
      
      {isOpen && (
        <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar">
          
          {/* Priorities */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Priorities</h4>
            <div className="space-y-1">
               <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor('paid', 'p1') }}></div>
                    <span className="capitalize text-slate-200">Critical (P1) - Bright</span>
               </div>
               <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor('paid', 'p2') }}></div>
                    <span className="capitalize text-slate-200">Others (P2-P9) - Dark</span>
               </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Shapes */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">People (Shapes)</h4>
            <div className="grid grid-cols-2 gap-2">
              {people.map(p => (
                <div key={p.id} className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">[{p.shape.substring(0,3)}]</span>
                  <span className="truncate text-slate-200">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

const App = () => {
  const data = useMemo(() => generateData(), []);
  
  const { 
    setScrollX, setScrollY,
    scrollY,
    viewMode, setViewMode, 
    dimensions,
    selectedFile, selectFile,
    filters, setFilterGroup, setFilterPriority, setFilterDate, clearFilters
  } = useStore();

  const [isHoveringLeft, setIsHoveringLeft] = useState(false);

  // --- Handlers ---
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const threshold = window.innerWidth / 3;
    const inLeftZone = e.clientX < threshold;
    if (inLeftZone !== isHoveringLeft) {
      setIsHoveringLeft(inLeftZone);
    }
  };

  const handleCanvasWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (isHoveringLeft) {
      const sensitivity = 0.02;
      setScrollY(scrollY - e.deltaY * sensitivity); 
    }
  };

  // Generate date list for dropdown and bottom panel
  const dates = Array.from({ length: 30 }).map((_, i) => data.startDate.add(i, 'day'));

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* TOP HEADER */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900 z-20 shadow-md shrink-0 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-2 bg-blue-600 rounded-md">
            <Box className="text-white h-4 w-4" />
          </div>
          <h1 className="font-bold text-sm tracking-tight text-slate-100 hidden md:block">
            Dimension<span className="text-blue-500">View</span>
          </h1>
        </div>

        {/* FILTERS BAR */}
        <div className="flex items-center gap-2 flex-1 justify-center max-w-4xl">
           <div className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-lg border border-slate-700/50">
              <Filter size={14} className="text-slate-400 ml-2" />
              
              {/* Group Filter */}
              <select 
                className="bg-slate-900 border-none text-xs h-8 rounded px-2 text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                value={filters.groupId || ''}
                onChange={(e) => setFilterGroup(e.target.value || null)}
              >
                <option value="">All Groups</option>
                {data.groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>

              {/* Priority Filter */}
              <select 
                className="bg-slate-900 border-none text-xs h-8 rounded px-2 text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                value={filters.priority || ''}
                onChange={(e) => setFilterPriority(e.target.value as Priority || null)}
              >
                <option value="">All Priorities</option>
                {(Object.keys(PRIORITY_LABELS) as Priority[]).map(p => (
                    <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                ))}
              </select>

              {/* Date Filter */}
              <select 
                className="bg-slate-900 border-none text-xs h-8 rounded px-2 text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                value={filters.date || ''}
                onChange={(e) => setFilterDate(e.target.value || null)}
              >
                <option value="">All Dates</option>
                {dates.map(d => (
                    <option key={d.toISOString()} value={d.format('YYYY-MM-DD')}>
                        {d.format('MMM DD, YYYY')}
                    </option>
                ))}
              </select>

              {(filters.groupId || filters.priority || filters.date) && (
                  <Button variant="ghost" size="icon-sm" onClick={clearFilters} className="h-8 w-8 text-slate-400 hover:text-white">
                      <X size={14} />
                  </Button>
              )}
           </div>
        </div>

        <div className="flex gap-2 shrink-0">
           <Button 
            variant={viewMode === 'front' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('front')}
            className="gap-2 border-slate-700 hover:bg-slate-800 hover:text-white hidden sm:flex"
          >
            <Monitor size={14} /> <span className="hidden lg:inline">Front</span>
          </Button>

           <Button 
            variant={viewMode === 'top' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('top')}
            className="gap-2 border-slate-700 hover:bg-slate-800 hover:text-white hidden sm:flex"
          >
            <Map size={14} /> <span className="hidden lg:inline">Top</span>
          </Button>
          
          <Button 
            variant={viewMode === 'side' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('side')}
            className="gap-2 border-slate-700 hover:bg-slate-800 hover:text-white hidden sm:flex"
          >
            <LayoutGrid size={14} /> <span className="hidden lg:inline">Side</span>
          </Button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* LEFT COLUMN: Canvas + Bottom Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* 1. CENTER (Canvas) */}
          <div
            className="flex-1 relative bg-slate-950"
            onPointerMove={handlePointerMove}
            onWheelCapture={handleCanvasWheel}
          >
            <div className="absolute inset-0">
               <Scene data={data} enableZoom={!isHoveringLeft} />
            </div>

            {/* Key / Legend Overlay */}
            <Legend people={data.people} />
          </div>

          {/* 3. BOTTOM PANEL (Date Navigator) */}
          <div className="h-[120px] border-t border-slate-800 bg-slate-900 z-10 flex flex-col shrink-0">
              <div className="px-4 py-2 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/50">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Timeline Navigator</span>
                  <span className="text-xs text-slate-600">{dates[0].format('MMM D')} - {dates[dates.length-1].format('MMM D')}</span>
              </div>

              <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-4 gap-2 hide-scrollbar">
                  {dates.map((date, i) => {
                      const dateStr = date.format('YYYY-MM-DD');
                      const isActive = filters.date === dateStr;

                      return (
                          <button
                              key={i}
                              onClick={() => {
                                  setFilterDate(dateStr);
                                  setScrollX(i * dimensions.dayWidth);
                              }}
                              className={`
                                  flex flex-col items-center justify-center h-12 min-w-[4rem] rounded-md border transition-all duration-200
                                  ${isActive
                                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                                  }
                              `}
                          >
                              <span className="text-xs font-bold uppercase">{date.format('MMM')}</span>
                              <span className="text-xs font-bold">{date.format('DD')}</span>
                          </button>
                      );
                  })}
              </div>
          </div>

        </div>

        {/* 2. RIGHT PANEL (Details) */}
        <div className="w-[300px] border-l border-slate-800 bg-slate-900 z-20 flex flex-col shadow-xl shrink-0">
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
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        className="capitalize"
                        style={{ backgroundColor: getNodeColor(selectedFile.action, selectedFile.priority), color: 'white' }}
                      >
                        {selectedFile.action}
                      </Badge>
                      <Badge variant="outline" className="capitalize text-slate-300 border-slate-600">
                        {PRIORITY_LABELS[selectedFile.priority]}
                      </Badge>
                    </div>
                 </div>

                 <Card className="bg-slate-950 border-slate-800">
                    <CardHeader className="pb-2">
                       <CardTitle className="text-sm text-slate-400">Date & Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="text-lg font-medium text-white">
                         {dayjs(selectedFile.date).format('MMM D, YYYY')}
                       </div>
                       <div className="text-sm text-slate-400">
                         {dayjs(selectedFile.date).format('HH:mm a')}
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="bg-slate-950 border-slate-800">
                    <CardHeader className="pb-2">
                       <CardTitle className="text-sm text-slate-400">Owner</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="flex items-center gap-2">
                         <div className="text-lg font-medium text-white">
                           {data.people.find(p => p.id === selectedFile.personId)?.name}
                         </div>
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
                  <Monitor size={24} className="opacity-50" />
                </div>
                <p className="text-sm">Select a file node to view details.</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default App;