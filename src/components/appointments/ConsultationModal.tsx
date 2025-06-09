import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Appointment } from '../../stores/appointmentStore';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onComplete: (appointmentId: string, notes: string) => void;
}

const ConsultationModal = ({ isOpen, onClose, appointment, onComplete }: ConsultationModalProps) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(appointment.id, notes);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 p-6 shadow-xl animate-slide-in">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">
              Завершить консультацию
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Информация о пациенте</h3>
            <div className="flex items-center mb-3">
              <img
                src={appointment.patient.profileImage || "https://via.placeholder.com/40"}
                alt={appointment.patient.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">{appointment.patient.name}</p>
                <p className="text-sm text-gray-500">{appointment.patient.email}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Оценка ИИ</h3>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm">{appointment.aiContext}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="notes" className="form-label">
                Записи консультации
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-input min-h-[120px]"
                placeholder="Введите ваш диагноз, план лечения и любые инструкции для последующего наблюдения..."
                required
              ></textarea>
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
                className="btn btn-success"
              >
                Отметить как завершённое
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default ConsultationModal;