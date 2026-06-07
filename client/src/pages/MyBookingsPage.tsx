import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { useGetMyBookingsQuery, type Booking } from '../store/bookingsApi';

export default function MyBookingsPage() {
  const user = useSelector(selectUser);
  const { data: bookings = [], isLoading } = useGetMyBookingsQuery(undefined, { skip: !user });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  if (!user) return <div className="p-8 text-center">Jelentkezz be a foglalások megtekintéséhez!</div>;
  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 flex gap-8">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">Foglalásaim</h2>
        <div className="flex flex-col gap-2">
          {bookings.map(b => (
            <div 
              key={b.id} 
              onClick={() => setSelectedBooking(b)}
              className={`p-4 border rounded cursor-pointer ${selectedBooking?.id === b.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
            >
              <div className="font-semibold">{b.tableName}</div>
              <div className="text-sm text-muted-foreground">{b.date} {b.startTime} - {b.endTime}</div>
              <div className="text-sm mt-1">
                Állapot: 
                <span className={`ml-1 font-medium ${b.status === 'accepted' ? 'text-green-600' : b.status === 'declined' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {b.status === 'pending' ? 'Függőben' : b.status === 'accepted' ? 'Elfogadva' : 'Elutasítva'}
                </span>
              </div>
            </div>
          ))}
          {bookings.length === 0 && <div className="text-muted-foreground">Nincsenek foglalásaid.</div>}
        </div>
      </div>
      
      <div className="w-1/2">
        {selectedBooking && (
          <div className="p-6 border rounded bg-card sticky top-24">
            <h3 className="text-xl font-bold mb-4">Foglalás Részletei</h3>
            <div className="space-y-2">
              <p><strong>Asztal:</strong> {selectedBooking.tableName}</p>
              <p><strong>Időpont:</strong> {selectedBooking.date} {selectedBooking.startTime} - {selectedBooking.endTime}</p>
              <p><strong>Állapot:</strong> {selectedBooking.status === 'pending' ? 'Függőben' : selectedBooking.status === 'accepted' ? 'Elfogadva' : 'Elutasítva'}</p>
              <hr className="my-4" />
              <p><strong>Név:</strong> {selectedBooking.name}</p>
              <p><strong>Email:</strong> {selectedBooking.email}</p>
              <p><strong>Telefon:</strong> {selectedBooking.phone}</p>
              <p><strong>Létszám:</strong> {selectedBooking.headcount} fő</p>
              {selectedBooking.notes && <p><strong>Megjegyzés:</strong> {selectedBooking.notes}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
