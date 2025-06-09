import { create } from 'zustand';
import { format } from 'date-fns';
import api from '../services/api';

export type ConsultationType = 'online' | 'offline';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  doctorId: string;
  date: string;
  time: string;
  type: ConsultationType;
  reason: string;
  aiContext: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface AppointmentState {
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  fetchUpcomingAppointments: () => Promise<void>;
  fetchPastAppointments: () => Promise<void>;
  markAsConsulted: (appointmentId: string, notes: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
}

const mockAppointments: Appointment[] = [
  {
    id: 'appt1',
    patientId: 'p1',
    patient: {
      id: 'p1',
      name: 'Анна Смирнова',
      email: 'anna@example.com',
      phone: '8-999-123-4567',
      profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    doctorId: 'd123456',
    date: '2025-05-20',
    time: '09:00',
    type: 'online',
    reason: 'Повторяющиеся головные боли и головокружение',
    aiContext: 'Пациент сообщает о сильных головных болях, возникающих 3-4 раза в неделю, сопровождающихся головокружением и светобоязнью. ИИ предполагает возможную мигрень, рекомендует неврологическое обследование.',
    status: 'scheduled'
  },
  {
    id: 'appt2',
    patientId: 'p2',
    patient: {
      id: 'p2',
      name: 'Роберт Иванов',
      email: 'robert@example.com',
      phone: '8-999-987-6543',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    doctorId: 'd123456',
    date: '2025-05-20',
    time: '10:30',
    type: 'offline',
    reason: 'Контрольный осмотр после анализов крови',
    aiContext: 'Пациент обращается за интерпретацией недавних анализов крови, показывающих повышенный уровень холестерина. ИИ отмечает семейную историю сердечных заболеваний у пациента.',
    status: 'scheduled'
  },
  {
    id: 'appt3',
    patientId: 'p3',
    patient: {
      id: 'p3',
      name: 'Мария Петрова',
      email: 'maria@example.com',
      phone: '8-999-555-1212',
      profileImage: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    doctorId: 'd123456',
    date: '2025-05-21',
    time: '14:00',
    type: 'online',
    reason: 'Кожная сыпь и зуд',
    aiContext: 'Пациент описывает красную зудящую сыпь на руках и туловище, появившуюся после начала приёма нового лекарства. ИИ предполагает возможную аллергическую реакцию, рекомендует обследование.',
    status: 'scheduled'
  },
  {
    id: 'appt4',
    patientId: 'p4',
    patient: {
      id: 'p4',
      name: 'Дмитрий Волков',
      email: 'dmitry@example.com',
      phone: '8-999-789-0123',
      profileImage: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    doctorId: 'd123456',
    date: '2025-04-15',
    time: '11:15',
    type: 'offline',
    reason: 'Постоянный кашель и боль в груди',
    aiContext: 'Пациент сообщает о продуктивном кашле в течение 3 недель с жёлтой мокротой и периодической болью в груди. Недавняя лихорадка (38°C). ИИ предполагает возможный бронхит или пневмонию.',
    status: 'completed',
    notes: 'Диагностирован острый бронхит. Назначен амоксициллин 500мг 3 раза в день в течение 10 дней и рекомендовано увеличить потребление жидкости и отдых. Контрольный осмотр через 2 недели при сохранении симптомов.'
  },
  {
    id: 'appt5',
    patientId: 'p5',
    patient: {
      id: 'p5',
      name: 'Сара Коваленко',
      email: 'sara@example.com',
      phone: '8-999-321-6789',
      profileImage: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    doctorId: 'd123456',
    date: '2025-04-10',
    time: '15:30',
    type: 'online',
    reason: 'Тревожность и проблемы со сном',
    aiContext: 'Пациент сообщает об усилении тревожности и трудностях с засыпанием в течение последнего месяца. Совпадает со сменой работы. Нет предыдущей истории психических расстройств. ИИ предполагает оценку тревожного расстройства.',
    status: 'completed',
    notes: 'Пациент с генерализованным тревожным расстройством, вызванным недавними изменениями в жизни. Рекомендована КПТ и практики гигиены сна. Назначен анксиолитик в низкой дозе для краткосрочного использования. Запланирован контрольный осмотр через 3 недели.'
  },
];

const mockPastAppointments = mockAppointments.filter(a => a.status === 'completed');
const mockUpcomingAppointments = mockAppointments.filter(a => a.status === 'scheduled');

export const useAppointmentStore = create<AppointmentState>((set) => ({
  upcomingAppointments: [],
  pastAppointments: [],
  isLoading: false,
  error: null,

  fetchUpcomingAppointments: async () => {
    try {
      set({ isLoading: true, error: null });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ 
        upcomingAppointments: mockUpcomingAppointments, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось загрузить приёмы', 
        isLoading: false 
      });
    }
  },

  fetchPastAppointments: async () => {
    try {
      set({ isLoading: true, error: null });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ 
        pastAppointments: mockPastAppointments, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось загрузить историю консультаций', 
        isLoading: false 
      });
    }
  },

  markAsConsulted: async (appointmentId: string, notes: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        upcomingAppointments: state.upcomingAppointments.filter(a => a.id !== appointmentId),
        pastAppointments: [
          ...state.pastAppointments,
          {
            ...state.upcomingAppointments.find(a => a.id === appointmentId)!,
            status: 'completed',
            notes
          }
        ],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось отметить приём как завершённый', 
        isLoading: false 
      });
    }
  },

  cancelAppointment: async (appointmentId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        upcomingAppointments: state.upcomingAppointments.filter(a => a.id !== appointmentId),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось отменить приём', 
        isLoading: false 
      });
    }
  }
}));