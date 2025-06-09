import { create } from 'zustand';
import { addDays, format, startOfDay, setHours, setMinutes } from 'date-fns';

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface ScheduleState {
  availableSlots: TimeSlot[];
  isLoading: boolean;
  error: string | null;
  fetchAvailableSlots: () => Promise<void>;
  updateTimeSlot: (slotId: string, available: boolean) => Promise<void>;
  addTimeSlot: (date: string, startTime: string, endTime: string) => Promise<void>;
  deleteTimeSlot: (slotId: string) => Promise<void>;
  setAvailabilityForDateRange: (startDate: Date, endDate: Date, slots: Array<{ start: string, end: string }>, weekdaysOnly: boolean) => Promise<void>;
}

const formatTime = (hour: number, minute: number = 0): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

const generateMockTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = startOfDay(new Date());
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    for (let hour = 9; hour < 12; hour++) {
      const startTime1 = formatTime(hour, 0);
      const endTime1 = formatTime(hour, 30);
      const startTime2 = formatTime(hour, 30);
      const endTime2 = formatTime(hour + 1, 0);
      
      slots.push({
        id: `${dateStr}-${startTime1}`,
        date: dateStr,
        startTime: startTime1,
        endTime: endTime1,
        available: Math.random() > 0.3 
      });
      
      slots.push({
        id: `${dateStr}-${startTime2}`,
        date: dateStr,
        startTime: startTime2,
        endTime: endTime2,
        available: Math.random() > 0.3
      });
    }
    
    for (let hour = 14; hour < 17; hour++) {
      const startTime1 = formatTime(hour, 0);
      const endTime1 = formatTime(hour, 30);
      const startTime2 = formatTime(hour, 30);
      const endTime2 = formatTime(hour + 1, 0);
      
      slots.push({
        id: `${dateStr}-${startTime1}`,
        date: dateStr,
        startTime: startTime1,
        endTime: endTime1,
        available: Math.random() > 0.3
      });
      
      slots.push({
        id: `${dateStr}-${startTime2}`,
        date: dateStr,
        startTime: startTime2,
        endTime: endTime2,
        available: Math.random() > 0.3
      });
    }
  }
  
  return slots;
};

export const useScheduleStore = create<ScheduleState>((set) => ({
  availableSlots: [],
  isLoading: false,
  error: null,

  fetchAvailableSlots: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch from your backend
      const mockSlots = generateMockTimeSlots();
      set({ availableSlots: mockSlots, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch schedule', 
        isLoading: false 
      });
    }
  },

  updateTimeSlot: async (slotId: string, available: boolean) => {
    try {
      set({ isLoading: true, error: null });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        availableSlots: state.availableSlots.map(slot => 
          slot.id === slotId ? { ...slot, available } : slot
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update time slot', 
        isLoading: false 
      });
    }
  },

  addTimeSlot: async (date: string, startTime: string, endTime: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newSlot: TimeSlot = {
        id: `${date}-${startTime}`,
        date,
        startTime,
        endTime,
        available: true
      };
      
      set(state => ({
        availableSlots: [...state.availableSlots, newSlot],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add time slot', 
        isLoading: false 
      });
    }
  },

  deleteTimeSlot: async (slotId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        availableSlots: state.availableSlots.filter(slot => slot.id !== slotId),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete time slot', 
        isLoading: false 
      });
    }
  },

  setAvailabilityForDateRange: async (startDate: Date, endDate: Date, slots: Array<{ start: string, end: string }>, weekdaysOnly: boolean) => {
    try {
      set({ isLoading: true, error: null });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSlots: TimeSlot[] = [];
      let currentDate = startDate;
      
      while (currentDate <= endDate) {
        // Skip weekends if weekdaysOnly is true
        const dayOfWeek = currentDate.getDay();
        if (weekdaysOnly && (dayOfWeek === 0 || dayOfWeek === 6)) {
          currentDate = addDays(currentDate, 1);
          continue;
        }
        
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        
        slots.forEach(({ start, end }) => {
          const id = `${dateStr}-${start}`;
          newSlots.push({
            id,
            date: dateStr,
            startTime: start,
            endTime: end,
            available: true
          });
        });
        
        currentDate = addDays(currentDate, 1);
      }
      
      set(state => {
        const existingSlots = state.availableSlots.filter(slot => {
          const slotDate = new Date(slot.date);
          return slotDate < startDate || slotDate > endDate;
        });
        
        return {
          availableSlots: [...existingSlots, ...newSlots],
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to set availability for date range', 
        isLoading: false 
      });
    }
  }
}));