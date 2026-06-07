import type { Table } from "../data/Table.ts";
import TableComponent from "./TableComponent";

interface CanvasProps {
  width: number;
  height: number;
  tables: Table[];
  onMoveTable: (id: number, x: number, y: number) => void;
  onSelectTable: (id: number) => void;
  isAdmin?: boolean;
  selectedTableId?: number | null;
}

const Canvas = ({ width, height, tables, onMoveTable, onSelectTable, isAdmin = false, selectedTableId }: CanvasProps) => {
  
  const getTableDims = (type: string) => {
    if (type === 'snooker') return { w: 190, h: 100, s: 50 };
    if (type === 'air-hockey') return { w: 140, h: 70, s: 40 };
    return { w: 120, h: 60, s: 30 };
  };

  const checkIsInvalid = (targetTable: Table) => {
    const targetDims = getTableDims(targetTable.type);
    
    const targetArea = {
      x1: targetTable.position.x - targetDims.s,
      y1: targetTable.position.y - targetDims.s,
      x2: targetTable.position.x + targetDims.w + targetDims.s,
      y2: targetTable.position.y + targetDims.h + targetDims.s,
    };

    return tables.some(otherTable => {
      if (targetTable.id === otherTable.id) return false;

      const otherDims = getTableDims(otherTable.type);
      
      const otherBody = {
        x1: otherTable.position.x,
        y1: otherTable.position.y,
        x2: otherTable.position.x + otherDims.w,
        y2: otherTable.position.y + otherDims.h,
      };

      return (
        targetArea.x1 < otherBody.x2 &&
        targetArea.x2 > otherBody.x1 &&
        targetArea.y1 < otherBody.y2 &&
        targetArea.y2 > otherBody.y1
      );
    });
  };

  return (
    <div 
      className="border bg-chart-4 mb-4 rounded relative overflow-hidden" 
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={() => onSelectTable(-1)}
    >
      {tables.map((table) => (
        <TableComponent 
          key={table.id} 
          table={table} 
          onMove={onMoveTable}
          onClick={() => onSelectTable(table.id)} 
          bounds={{ width, height }}
          isInvalid={checkIsInvalid(table)}
          isAdmin={isAdmin}
          isSelected={table.id === selectedTableId}
          />
        ))}
    </div>
  );
};

export default Canvas;