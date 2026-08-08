import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (token && stored) {
      setUser(JSON.parse(stored));
      authAPI.getProfile()
        .then((res) => { setUser(res.data); localStorage.setItem('user', JSON.stringify(res.data)); })
        .catch(() => { localStorage.clear(); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
      return res.data;
    } catch (err) { toast.error(err.message); throw err; }
  };

  const register = async (data) => {
    try {
      const res = await authAPI.register(data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      toast.success('Account created!');
      return res.data;
    } catch (err) { toast.error(err.message); throw err; }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    toast.success('Logged out');
  };

  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);