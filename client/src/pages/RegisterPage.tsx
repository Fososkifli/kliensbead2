import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../store/authApi';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registerApi] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerApi({ name, email, password }).unwrap();
      navigate('/login');
    } catch (err: unknown) {
      setError((err as { data?: { message?: string } })?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <form onSubmit={handleSubmit} className="p-8 border rounded shadow-sm w-96 flex flex-col gap-4 bg-card">
        <h2 className="text-2xl font-bold text-center">Regisztráció</h2>
        {error && <div className="text-destructive text-sm">{error}</div>}
        <div>
          <label className="block mb-1 text-sm font-medium">Név</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Jelszó</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="bg-primary text-primary-foreground py-2 rounded font-semibold mt-2">
          Regisztráció
        </button>
        <div className="text-center text-sm mt-2">
          Van már fiókod? <Link to="/login" className="underline text-primary">Lépj be!</Link>
        </div>
      </form>
    </div>
  );
}
