import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { useAddTableMutation } from '../store/tablesApi';
import { toast } from 'react-toastify';
import type { Table } from '../data/Table';

export default function AddTablePage() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [addTableApi] = useAddTableMutation();

  const [formData, setFormData] = useState<Omit<Table, 'id'>>({
    name: '',
    type: 'snooker',
    category: 'normal',
    color: 'red',
    status: 10,
    position: { x: 100, y: 100 },
    isLocked: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'x' || name === 'y') {
      setFormData(prev => ({
        ...prev,
        position: { ...prev.position, [name]: parseInt(value) }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseInt(value) : value)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTableApi(formData).unwrap();
      toast.success("Asztal sikeresen hozzáadva!");
      navigate('/');
    } catch (err: unknown) {
      console.error(err);
      toast.error((err as { data?: { message?: string } })?.data?.message || "Hiba az asztal hozzáadásakor");
    }
  };

  if (user?.role !== 'admin') return <div className="p-8 text-center">Nincs jogosultságod!</div>;

  return (
    <div className="max-w-md mx-auto p-8 border rounded mt-8 bg-card shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Asztal hozzáadása</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Név</label>
          <input required name="name" type="text" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Típus</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="snooker">Biliárd</option>
            <option value="foosball">Csocsó</option>
            <option value="air-hockey">Léghoki</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kategória</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="competition">Verseny</option>
            <option value="normal">Normál</option>
            <option value="kids">Gyerek</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Szín</label>
          <select name="color" value={formData.color} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="red">Piros</option>
            <option value="green">Zöld</option>
            <option value="blue">Kék</option>
            <option value="yellow">Sárga</option>
            <option value="purple">Lila</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Állapot (1-10)</label>
          <input required name="status" type="number" min="1" max="10" value={formData.status} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Pozíció X</label>
            <input required name="x" type="number" value={formData.position.x} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Pozíció Y</label>
            <input required name="y" type="number" value={formData.position.y} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input name="isLocked" type="checkbox" checked={formData.isLocked} onChange={handleChange} className="w-4 h-4" />
          <label className="text-sm font-medium">Zárolva (nem mozgatható)</label>
        </div>
        <button type="submit" className="bg-primary text-primary-foreground py-2 rounded font-semibold mt-4">
          Hozzáadás
        </button>
      </form>
    </div>
  );
}
