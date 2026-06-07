import { useState, useEffect } from "react";
import Canvas from "../components/Canvas";
import Inspector from "../components/Inspector";
import { type Table } from "../data/Table"; 
import Summary from "../components/Summary";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authSlice";
import { toast } from 'react-toastify';
import { 
  useGetTablesQuery, 
  useUpdateTableMutation, 
  useUpdateTablePositionMutation,
  useDeleteTableMutation 
} from "../store/tablesApi";

const DEFAULT_WIDTH = 780;
const DEFAULT_HEIGHT = 500;

export default function RoomPage() {
  const user = useSelector(selectUser);
  const [roomSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
  const [liveTables, setLiveTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  const { data: tablesData } = useGetTablesQuery();
  const [updateTableApi] = useUpdateTableMutation();
  const [updateTablePositionApi] = useUpdateTablePositionMutation();
  const [deleteTableApi] = useDeleteTableMutation();

  useEffect(() => {
    if (tablesData) {
      setTimeout(() => {
        setLiveTables(tablesData);
      }, 0);
    }
  }, [tablesData]);

  const handleMoveTable = (id: number, x: number, y: number) => {
    if (user?.role !== 'admin') return;
    
    setLiveTables((current) =>
      current.map((t) => (t.id === id ? { ...t, position: { x, y } } : t))
    );
    updateTablePositionApi({ id, x, y }).catch(console.error);
  };

  const handleSelectTable = (id: number) => {
    if (!user) return; // Visitor cannot click tables
    setSelectedTableId(currentId => currentId === id ? null : id);
  };

  const handleUpdateTable = async (updatedTable: Table) => {
    if (user?.role !== 'admin') return;
    try {
      await updateTableApi({
        id: updatedTable.id,
        data: {
          name: updatedTable.name,
          type: updatedTable.type,
          category: updatedTable.category,
          color: updatedTable.color,
          status: updatedTable.status,
          isLocked: updatedTable.isLocked
        }
      }).unwrap();
      toast.success("Asztal sikeresen módosítva!");
    } catch (e: unknown) {
      console.error(e);
      toast.error((e as { data?: { message?: string } })?.data?.message || "Hiba az asztal módosításakor");
    }
  };

  const handleDeleteTable = async (id: number) => {
    if (user?.role !== 'admin') return;
    try {
      await deleteTableApi(id).unwrap();
      toast.success("Asztal törölve!");
    } catch (e: unknown) {
      console.error(e);
      toast.error((e as { data?: { message?: string } })?.data?.message || "Hiba az asztal törlésekor");
    }
  };

  return (
    <main className="mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <div className="mx-auto flex h-full px-4 gap-6">
        <div id="leftMain">
          <div id="tables">
            <Canvas 
              width={roomSize.width} 
              height={roomSize.height} 
              tables={liveTables}
              onMoveTable={handleMoveTable}
              onSelectTable={handleSelectTable}
              isAdmin={user?.role === 'admin'}
              selectedTableId={selectedTableId}
            />
          </div>
          <div id="osszesito">
            <Summary 
              tables={liveTables}
            />
          </div>
        </div>
        <div id="rightMain" className="w-full h-full">
          {user && (
            <div id="inspector"> 
                <Inspector 
                  selectedTable={liveTables.find(t => t.id === selectedTableId)} 
                  onUpdateTable={handleUpdateTable}
                  onDeleteTable={handleDeleteTable}
                />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
