import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  profileImage?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  doctor: Doctor | null;
  token: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  updateDoctorProfile: (data: Partial<Doctor>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  doctor: null,
  token: localStorage.getItem('token'),
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      

      const mockResponse = email === 'doctor@example.com' && password === 'password123'
        ? { 
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQxMjM0NTYiLCJuYW1lIjoiRHIuIEpvaG4gRG9lIiwiZW1haWwiOiJkb2N0b3JAZXhhbXBsZS5jb20iLCJzcGVjaWFsdHkiOiJDYXJkaW9sb2d5IiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            doctor: {
              id: 'd123456',
              name: 'Др. Иван Петров',
              email: 'doctor@example.com',
              specialty: 'Кардиология',
              profileImage: 'https://randomuser.me/api/portraits/men/75.jpg'
            }
          }
        : null;
      
      if (!mockResponse) {
        throw new Error('Неверные учётные данные');
      }
      
      const { token, doctor } = mockResponse;
      
      localStorage.setItem('token', token);
      
      set({
        isAuthenticated: true,
        doctor,
        token,
        isLoading: false,
      });
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось войти в систему', 
        isLoading: false 
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      isAuthenticated: false,
      doctor: null,
      token: null,
    });
  },

  checkAuth: () => {
    const { token } = get();
    
    if (!token) {
      set({ isAuthenticated: false, doctor: null, isLoading: false });
      return;
    }
    
    try {
 
      const decoded: any = jwtDecode(token);
      
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        get().logout();
        return;
      }
      
      set({
        isAuthenticated: true,
        doctor: {
          id: decoded.id,
          name: 'Др. Иван Петров',
          email: decoded.email,
          specialty: 'Кардиология',
          profileImage: decoded.profileImage,
        },
        isLoading: false,
      });
      
    } catch (error) {
      console.error('Ошибка декодирования токена:', error);
      get().logout();
    }
  },

  updateDoctorProfile: async (data: Partial<Doctor>) => {
    try {
      set({ isLoading: true, error: null });
      

      const { doctor } = get();
      if (!doctor) throw new Error('Не авторизован');
      
      const updatedDoctor = { ...doctor, ...data };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        doctor: updatedDoctor,
        isLoading: false,
      });
      
      return updatedDoctor;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось обновить профиль', 
        isLoading: false 
      });
    }
  },
}));