import { useState, useEffect } from "react";
import type { Table } from "../data/Table";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authSlice";
import { useCreateBookingMutation, useGetAllBookingsQuery } from "../store/bookingsApi";
import { toast } from 'react-toastify';

interface InspectorProps {
  selectedTable?: Table;
  onUpdateTable: (updatedTable: Table) => void;
  onDeleteTable: (id: number) => void;
}

const TIMESLOTS = [
// ... existing code ...
  { startTime: '20:00', endTime: '22:00' }
];

const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
};

export default function Inspector({ selectedTable, onUpdateTable, onDeleteTable }: InspectorProps) {
  const user = useSelector(selectUser);
  const [formData, setFormData] = useState<Table | null>(null);
  
  const [createBookingApi] = useCreateBookingMutation();
  const { data: allBookings = [] } = useGetAllBookingsQuery(undefined, { skip: !user || user.role !== 'user' });

  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    name: '',
    email: '',
    phone: '',
    headcount: 2,
    notes: ''
  });
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setBookingData(prev => ({ ...prev, name: user.name, email: user.email }));
      }, 0);
    }
  }, [user]);

  useEffect(() => {
    // Only reset the form if the selected table's ID has actually changed.
    if (selectedTable?.id !== formData?.id) {
      if (selectedTable) {
        setTimeout(() => {
          setFormData({ ...selectedTable });
          setBookingData(prev => ({ ...prev, date: '', startTime: '', endTime: '' }));
          setBookedSlots([]);
          setBookingSuccess('');
          setBookingError('');
        }, 0);
      } else {
        setFormData(null);
      }
    }
  }, [selectedTable, formData?.id]);

  useEffect(() => {
    if (bookingData.date && selectedTable) {
      const slotsForDateTable = allBookings
        .filter((b) => b.tableId === selectedTable.id && b.date === bookingData.date && b.status !== 'declined')
        .map((b) => b.startTime);
      setTimeout(() => {
        setBookedSlots(slotsForDateTable);
      }, 0);
    }
  }, [bookingData.date, selectedTable, allBookings]);

  const handleSave = () => {
    if (formData) {
      onUpdateTable(formData);
    }
  };

  const handleBook = async () => {
    if (!selectedTable) return;
    try {
      await createBookingApi({
        tableId: selectedTable.id,
        ...bookingData
      }).unwrap();
      toast.success('Sikeres foglalás!');
      setBookingSuccess('Sikeres foglalás!');
      setBookingError('');
      setBookingData(prev => ({ ...prev, startTime: '', endTime: '' }));
    } catch (err: unknown) {
      const errMsg = (err as { data?: { message?: string } })?.data?.message || 'Hiba a foglalás során';
      toast.error(errMsg);
      setBookingError(errMsg);
      setBookingSuccess('');
    }
  };

  if (!selectedTable) return <div className="p-4 text-muted-foreground">Válassz egy asztalt a teremben!</div>;

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  return (
    <div className="h-full w-full p-4 rounded shadow-inner overflow-y-auto bg-card border">
      <h2 className="font-bold text-xl mb-4">Asztal adatai</h2>
      
      {isAdmin ? (
        <div className="space-y-4 mb-8">
          <div className="space-y-1.5">
            <Label>Név</Label>
            <Input value={formData?.name || ''} onChange={(e) => setFormData(prev => prev ? {...prev, name: e.target.value} : null)} />
          </div>
          <div className="space-y-1.5">
            <Label>Típus</Label>
            <Select value={formData?.type || ''} onValueChange={(val: string) => setFormData(prev => prev ? {...prev, type: val as "snooker" | "air-hockey" | "foosball"} : null)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="snooker">Biliárd</SelectItem>
                <SelectItem value="air-hockey">Léghoki</SelectItem>
                <SelectItem value="foosball">Csocsó</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Kategória</Label>
            <Select value={formData?.category || ''} onValueChange={(val: string) => setFormData(prev => prev ? {...prev, category: val as "competition" | "normal" | "kids"} : null)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="kids">Gyerek</SelectItem>
                <SelectItem value="normal">Normál</SelectItem>
                <SelectItem value="competition">Verseny</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Szín</Label>
            <Select value={formData?.color || ''} onValueChange={(val: string) => setFormData(prev => prev ? {...prev, color: val} : null)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="red">Piros</SelectItem>
                <SelectItem value="green">Zöld</SelectItem>
                <SelectItem value="blue">Kék</SelectItem>
                <SelectItem value="yellow">Sárga</SelectItem>
                <SelectItem value="purple">Lila</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Állapot</Label>
              <span className="font-bold text-sm">{formData?.status || 10} / 10</span>
            </div>
            <Slider 
              value={[formData?.status || 10]} 
              onValueChange={(val) => setFormData(prev => prev ? {...prev, status: val[0]} : null)} 
              min={1} 
              max={10} 
              step={1} 
            />
          </div>
          <div className="flex items-center gap-2 mt-4 mb-4">
            <Checkbox 
              checked={formData?.isLocked || false} 
              onCheckedChange={(val) => setFormData(prev => prev ? {...prev, isLocked: !!val} : null)} 
            />
            <Label>Zárolva (nem mozgatható)</Label>
          </div>
          
          <Button onClick={handleSave} className="w-full">Mentés</Button>
          <Button onClick={() => onDeleteTable(selectedTable.id)} variant="destructive" className="w-full mt-2">Törlés</Button>
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          <p><strong>Név:</strong> {selectedTable.name}</p>
          <p><strong>Típus:</strong> {capitalize(selectedTable.type)}</p>
          <p><strong>Kategória:</strong> {capitalize(selectedTable.category)}</p>
          <p><strong>Szín:</strong> {capitalize(selectedTable.color)}</p>
          <p><strong>Állapot:</strong> {selectedTable.status} / 10</p>
        </div>
      )}

      {isUser && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-bold text-lg">Foglalás</h3>
          {bookingSuccess && <div className="text-green-600 text-sm font-semibold">{bookingSuccess}</div>}
          {bookingError && <div className="text-red-600 text-sm font-semibold">{bookingError}</div>}
          
          <div className="space-y-1.5">
            <Label>Dátum</Label>
            <Input type="date" value={bookingData.date} onChange={e => setBookingData(prev => ({...prev, date: e.target.value}))} />
          </div>

          {bookingData.date && (
            <div className="space-y-1.5">
              <Label>Időpont</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {TIMESLOTS.map(slot => {
                  const isBooked = bookedSlots.includes(slot.startTime);
                  const isSelected = bookingData.startTime === slot.startTime;
                  return (
                    <button
                      key={slot.startTime}
                      disabled={isBooked}
                      onClick={() => setBookingData(prev => ({ ...prev, startTime: slot.startTime, endTime: slot.endTime }))}
                      className={`py-1 px-2 border rounded text-sm ${isBooked ? 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed' : isSelected ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {bookingData.startTime && (
            <>
              <div className="space-y-1.5">
                <Label>Név</Label>
                <Input value={bookingData.name} onChange={e => setBookingData(prev => ({...prev, name: e.target.value}))} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={bookingData.email} onChange={e => setBookingData(prev => ({...prev, email: e.target.value}))} />
              </div>
              <div className="space-y-1.5">
                <Label>Telefon</Label>
                <Input value={bookingData.phone} onChange={e => setBookingData(prev => ({...prev, phone: e.target.value}))} />
              </div>
              <div className="space-y-1.5">
                <Label>Létszám (fő)</Label>
                <Input type="number" min="1" value={bookingData.headcount} onChange={e => setBookingData(prev => ({...prev, headcount: parseInt(e.target.value)}))} />
              </div>
              <div className="space-y-1.5">
                <Label>Megjegyzés (opcionális)</Label>
                <Input value={bookingData.notes} onChange={e => setBookingData(prev => ({...prev, notes: e.target.value}))} />
              </div>
              <Button onClick={handleBook} className="w-full mt-4">Lefoglalom</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
