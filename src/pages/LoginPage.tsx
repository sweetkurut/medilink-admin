import { useState, FormEvent } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ActivitySquare } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the path they were trying to access or default to appointments
  const from = location.state?.from?.pathname || '/appointments';
  
  // If already authenticated, redirect
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary-100 rounded-full mb-4">
            <ActivitySquare className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">MediLink</h1>
          <p className="text-gray-600 mt-2">Вход в портал врача</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="email" className="form-label">Электронная почта</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@example.com"
              className="form-input"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Демо: doctor@example.com</p>
          </div>
          
          <div className="form-control">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Демо: password123</p>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-white rounded-full"></span>
                Вход...
              </span>
            ) : 'Войти'}
          </button>
        </form>
        
        <div className="mt-6 text-sm text-center text-gray-600">
          <p>Для демонстрации используйте указанные выше данные.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;