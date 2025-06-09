import { useEffect, useState } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useScheduleStore, TimeSlot } from '../stores/scheduleStore';
import ScheduleModal from '../components/schedule/ScheduleModal';
import BulkScheduleModal from '../components/schedule/BulkScheduleModal';
import { Plus } from 'lucide-react';

const locales = {
  'ru': {
    ...ru,
    options: {
      ...ru.options,
      weekStartsOn: 1, 
    },
  },
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const SchedulePage = () => {
  const { availableSlots, fetchAvailableSlots, isLoading, updateTimeSlot, addTimeSlot, deleteTimeSlot, setAvailabilityForDateRange } = useScheduleStore();
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<{ start: Date, end: Date } | null>(null);

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  useEffect(() => {
    const mappedEvents = availableSlots.map((slot) => {
      const startDate = new Date(`${slot.date}T${slot.startTime}:00`);
      const endDate = new Date(`${slot.date}T${slot.endTime}:00`);
      
      return {
        id: slot.id,
        title: slot.available ? 'Доступно' : 'Недоступно',
        start: startDate,
        end: endDate,
        status: slot.available ? 'available' : 'unavailable',
        resource: slot,
      };
    });
    
    setEvents(mappedEvents);
  }, [availableSlots]);

  const handleSelectSlot = ({ start, end }: { start: Date, end: Date }) => {
    setSelectedDate(start);
    setSelectedTime({ start, end });
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedSlot(event.resource);
    setIsModalOpen(true);
  };

  const handleAddTimeSlot = (date: string, startTime: string, endTime: string) => {
    addTimeSlot(date, startTime, endTime)
      .then(() => setIsModalOpen(false));
  };

  const handleUpdateTimeSlot = (slotId: string, available: boolean) => {
    updateTimeSlot(slotId, available)
      .then(() => setIsModalOpen(false));
  };

  const handleDeleteTimeSlot = (slotId: string) => {
    deleteTimeSlot(slotId)
      .then(() => setIsModalOpen(false));
  };

  const handleBulkSchedule = (startDate: Date, endDate: Date, timeSlots: Array<{ start: string, end: string }>, weekdaysOnly: boolean) => {
    setAvailabilityForDateRange(startDate, endDate, timeSlots, weekdaysOnly)
      .then(() => setIsBulkModalOpen(false));
  };

  const EventComponent = ({ event }: any) => {
    const isAvailable = event.status === 'available';
    
    return (
      <div
        className={`px-2 py-1 rounded text-xs font-medium overflow-hidden ${
          isAvailable ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
        }`}
      >
        {isAvailable ? 'Доступно' : 'Недоступно'}
      </div>
    );
  };

  const messages = {
    allDay: 'Весь день',
    previous: 'Назад',
    next: 'Вперёд',
    today: 'Сегодня',
    month: 'Месяц',
    week: 'Неделя',
    day: 'День',
    agenda: 'Повестка',
    date: 'Дата',
    time: 'Время',
    event: 'Событие',
    noEventsInRange: 'Нет событий в этом диапазоне.',
    showMore: (total: number) => `+ ещё ${total}`,
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Управление расписанием</h1>
          <p className="text-gray-600">Определите, когда вы доступны для приёма пациентов</p>
        </div>
        <div className="mt-4 sm:mt-0 space-x-2">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-1 inline" />
            Массовое расписание
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-[calc(100vh-220px)]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            views={['month', 'week', 'day']}
            defaultView={Views.WEEK}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            components={{
              event: EventComponent
            }}
            messages={messages}
            culture="ru"
          />
        </div>
      )}
      
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlot(null);
          setSelectedDate(null);
          setSelectedTime(null);
        }}
        selectedSlot={selectedSlot}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onAddTimeSlot={handleAddTimeSlot}
        onUpdateTimeSlot={handleUpdateTimeSlot}
        onDeleteTimeSlot={handleDeleteTimeSlot}
      />
      
      <BulkScheduleModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSave={handleBulkSchedule}
      />
    </div>
  );
};

export default SchedulePage;