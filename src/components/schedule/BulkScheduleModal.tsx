import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Plus, Trash2 } from 'lucide-react';

interface BulkScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (startDate: Date, endDate: Date, timeSlots: Array<{ start: string, end: string }>, weekdaysOnly: boolean) => void;
}

const BulkScheduleModal = ({ isOpen, onClose, onSave }: BulkScheduleModalProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeSlots, setTimeSlots] = useState<Array<{ start: string, end: string }>>([
    { start: '09:00', end: '09:30' },
  ]);
  const [weekdaysOnly, setWeekdaysOnly] = useState(true);

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: '09:00', end: '09:30' }]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    const newSlots = [...timeSlots];
    newSlots.splice(index, 1);
    setTimeSlots(newSlots);
  };

  const handleTimeChange = (index: number, field: 'start' | 'end', value: string) => {
    const newSlots = [...timeSlots];
    newSlots[index][field] = value;
    setTimeSlots(newSlots);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || timeSlots.length === 0) return;
    
    onSave(
      new Date(startDate),
      new Date(endDate),
      timeSlots,
      weekdaysOnly
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 p-6 shadow-xl animate-slide-in">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">
              Массовое расписание
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label htmlFor="startDate" className="form-label">Дата начала</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-control">
                <label htmlFor="endDate" className="form-label">Дата окончания</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="form-control mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="weekdaysOnly"
                  checked={weekdaysOnly}
                  onChange={(e) => setWeekdaysOnly(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="weekdaysOnly" className="ml-2 block text-sm text-gray-900">
                  Только рабочие дни (Пн-Пт)
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="form-label">Временные слоты</label>
              
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <select
                    value={slot.start}
                    onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                    className="form-input"
                    required
                  >
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      [0, 30].map((minute) => (
                        <option key={`${hour}:${minute}`} value={`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}>
                          {`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}
                        </option>
                      ))
                    )).flat()}
                  </select>
                  <span>до</span>
                  <select
                    value={slot.end}
                    onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                    className="form-input"
                    required
                  >
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      [0, 30].map((minute) => (
                        <option key={`${hour}:${minute}`} value={`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}>
                          {`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}
                        </option>
                      ))
                    )).flat()}
                  </select>
                  
                  {timeSlots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTimeSlot(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddTimeSlot}
                className="mt-2 flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить ещё один слот
              </button>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
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
                Сохранить расписание
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default BulkScheduleModal;