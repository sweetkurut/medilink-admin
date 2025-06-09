import { Dialog } from '@headlessui/react';
import { X, Video, UserRound } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Appointment } from '../../stores/appointmentStore';

interface ConsultationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: Appointment;
}

const ConsultationDetailModal = ({ isOpen, onClose, consultation }: ConsultationDetailModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4 shadow-xl animate-slide-in">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-medium">
              Детали консультации
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-4 pb-2 border-b border-gray-200">Информация о пациенте</h3>
                
                <div className="flex items-center mb-4">
                  <img
                    src={consultation.patient.profileImage || "https://via.placeholder.com/40"}
                    alt={consultation.patient.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{consultation.patient.name}</p>
                    <p className="text-sm text-gray-500">{consultation.patient.email}</p>
                    <p className="text-sm text-gray-500">{consultation.patient.phone}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Дата и время</p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(`${consultation.date}T00:00:00`), 'dd MMMM yyyy', { locale: ru })} в {consultation.time}
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Тип консультации</p>
                  <p className="flex items-center text-sm text-gray-900">
                    {consultation.type === 'online' ? (
                      <>
                        <Video className="w-4 h-4 mr-1 text-blue-500" />
                        <span>Онлайн консультация</span>
                      </>
                    ) : (
                      <>
                        <UserRound className="w-4 h-4 mr-1 text-green-500" />
                        <span>Приём в кабинете</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-4 pb-2 border-b border-gray-200">Детали консультации</h3>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Причина обращения</p>
                  <p className="text-sm text-gray-900">{consultation.reason}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Оценка ИИ</p>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <p className="text-sm">{consultation.aiContext}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-4 pb-2 border-b border-gray-200">Записи врача</h3>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <p className="whitespace-pre-wrap text-sm">{consultation.notes || 'Записи для этой консультации не предоставлены.'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ConsultationDetailModal;