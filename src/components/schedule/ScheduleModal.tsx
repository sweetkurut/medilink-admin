import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TimeSlot } from '../../stores/scheduleStore';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot: TimeSlot | null;
  selectedDate: Date | null;
  selectedTime: { start: Date, end: Date } | null;
  onAddTimeSlot: (date: string, startTime: string, endTime: string) => void;
  onUpdateTimeSlot: (slotId: string, available: boolean) => void;
  onDeleteTimeSlot: (slotId: string) => void;
}

const ScheduleModal = ({
  isOpen,
  onClose,
  selectedSlot,
  selectedDate,
  selectedTime,
  onAddTimeSlot,
  onUpdateTimeSlot,
  onDeleteTimeSlot
}: ScheduleModalProps) => {
  const [isAvailable, setIsAvailable] = useState(true);
  
  useEffect(() => {
    if (selectedSlot) {
      setIsAvailable(selectedSlot.available);
    } else {
      setIsAvailable(true);
    }
  }, [selectedSlot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSlot) {
      // Update existing slot
      onUpdateTimeSlot(selectedSlot.id, isAvailable);
    } else if (selectedDate && selectedTime) {
      // Add new slot
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const startTimeStr = format(selectedTime.start, 'HH:mm');
      const endTimeStr = format(selectedTime.end, 'HH:mm');
      onAddTimeSlot(dateStr, startTimeStr, endTimeStr);
    }
  };

  const handleDelete = () => {
    if (selectedSlot && window.confirm('Вы уверены, что хотите удалить этот временной слот?')) {
      onDeleteTimeSlot(selectedSlot.id);
    }
  };
  
  const getTitle = () => {
    if (selectedSlot) {
      return 'Редактировать временной слот';
    }
    return 'Добавить новый временной слот';
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6 shadow-xl animate-slide-in">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">
              {getTitle()}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {selectedSlot ? (
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Дата:</span> {format(new Date(selectedSlot.date), 'dd MMMM yyyy', { locale: ru })}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Время:</span> {selectedSlot.startTime} - {selectedSlot.endTime}
                </p>
              </div>
            ) : selectedDate && selectedTime ? (
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Дата:</span> {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Время:</span> {format(selectedTime.start, 'HH:mm')} - {format(selectedTime.end, 'HH:mm')}
                </p>
              </div>
            ) : null}

            <div className="form-control">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                  Доступно для записи
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {selectedSlot && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-error"
                >
                  Удалить
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default ScheduleModal;