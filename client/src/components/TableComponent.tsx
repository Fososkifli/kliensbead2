import React, { useRef } from 'react';
import type { Table } from "../data/Table.ts";

const SNOOKER_SIZE = { width: 190, height: 100 };
const AIR_HOCKEY_SIZE = { width: 140, height: 70 };
const FOOSBALL_SIZE = { width: 120, height: 60 };

const SNOOKER_SPACE = 50;
const AIR_HOCKEY_SPACE = 40;
const FOOSBALL_SPACE = 30;

interface TableCompProps {
  table: Table;
  onMove: (id: number, x: number, y: number) => void;
  onClick?: () => void;
  bounds: { width: number; height: number };
  isInvalid: boolean;
  isSelected: boolean;
  isAdmin: boolean;
}

const TableComponent = ({ table, onMove, onClick, bounds, isInvalid, isSelected, isAdmin }: TableCompProps) => {
  const clickStartTime = useRef<number>(0);

  const getSpecs = () => {
    switch (table.type) {
      case 'snooker': return { ...SNOOKER_SIZE, space: SNOOKER_SPACE };
      case 'air-hockey': return { ...AIR_HOCKEY_SIZE, space: AIR_HOCKEY_SPACE };
      default: return { ...FOOSBALL_SIZE, space: FOOSBALL_SPACE };
    }
  };

  const { width, height, space } = getSpecs();

  const handleMouseDown = (e: React.MouseEvent) => {
    clickStartTime.current = Date.now();
    if (!isAdmin || table.isLocked) return;

    const startX = e.clientX - table.position.x;
    const startY = e.clientY - table.position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newX = moveEvent.clientX - startX;
      let newY = moveEvent.clientY - startY;

      newX = Math.max(space, Math.min(newX, bounds.width - width - space));
      newY = Math.max(space, Math.min(newY, bounds.height - height - space));

      onMove(table.id, newX, newY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleInternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const duration = Date.now() - clickStartTime.current;
    
    if (duration < 200 && onClick) {
      onClick();
    }
  };
  
  const opacityValue = table.status / 5;

  const isCompetition = (table.category as string).toLowerCase() === 'competition';
  const isKids = (table.category as string).toLowerCase() === 'kids';

  return (
    <div
      onMouseDown={handleMouseDown}
      onClick={handleInternalClick}
      className={`absolute select-none flex items-center justify-center text-foreground text-[10px] font-bold rounded shadow-md transition-all duration-200
        ${table.isLocked ? 'cursor-not-allowed border-dashed' : 'cursor-move'}
        ${isCompetition ? 'border-8' : 'border-4'} 
        border-[black]/20 
        ${isSelected 
          ? 'border-blue-500 ring-4 ring-blue-500/30 scale-[1.03] z-50 shadow-xl' 
          : isInvalid 
            ? 'animate-pulse z-10' 
            : 'z-0'
        }`}
      style={{
        left: `${table.position.x}px`,
        top: `${table.position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: table.color,
        opacity: opacityValue,
        borderColor: isSelected ? undefined : 'rgba(0,0,0,0.25)', 
        backgroundImage: isKids 
          ? 'radial-gradient(circle, rgba(255,255,255,0.3) 10%, transparent 20%)' 
          : 'none',
        backgroundSize: isKids ? '20px 20px' : 'auto',
      }}
    >
      <span className="drop-shadow-sm px-1 rounded bg-background/10">
        {table.name}
      </span>
    </div>
  );
};

export default TableComponent;