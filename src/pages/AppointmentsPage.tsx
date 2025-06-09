import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Video, UserRound, Check, AlertCircle, Calendar } from 'lucide-react';
import { useAppointmentStore, Appointment, ConsultationType } from '../stores/appointmentStore';
import ConsultationModal from '../components/appointments/ConsultationModal';
import toast from 'react-hot-toast';

const AppointmentsPage = () => {
  const { upcomingAppointments, fetchUpcomingAppointments, isLoading, markAsConsulted, cancelAppointment } = useAppointmentStore();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<ConsultationType | 'all'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingAppointments();
  }, [fetchUpcomingAppointments]);

  const handleStartCall = (appointmentId: string) => {
    navigate(`/video-consultation/${appointmentId}`);
  };

  const handleCompleteConsultation = (appointmentId: string, notes: string) => {
    markAsConsulted(appointmentId, notes)
      .then(() => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
        toast.success('Консультация отмечена как завершённая');
      });
  };

  const handleCancel = (appointmentId: string) => {
    if (window.confirm('Вы уверены, что хотите отменить этот приём?')) {
      cancelAppointment(appointmentId)
        .then(() => {
          toast.success('Приём успешно отменён');
        });
    }
  };

  const filteredAppointments = filter === 'all' 
    ? upcomingAppointments 
    : upcomingAppointments.filter(a => a.type === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Предстоящие приёмы</h1>
        <p className="text-gray-600">Управляйте и просматривайте запланированные консультации пациентов</p>
      </div>

      <div className="flex mb-6 border-b border-gray-200">
        <button 
          className={`px-4 py-2 font-medium text-sm mr-2 ${
            filter === 'all' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm mr-2 ${
            filter === 'online' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setFilter('online')}
        >
          Онлайн
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${
            filter === 'offline' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setFilter('offline')}
        >
          В кабинете
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Приёмы не найдены</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'У вас нет запланированных приёмов.' 
              : `У вас нет запланированных ${filter === 'online' ? 'онлайн' : 'очных'} приёмов.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="card animate-fade-in">
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img 
                      src={appointment.patient.profileImage || "https://via.placeholder.com/40"} 
                      alt={appointment.patient.name} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{appointment.patient.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        {appointment.type === 'online' ? (
                          <>
                            <Video className="w-3 h-3 mr-1" />
                            <span>Онлайн консультация</span>
                          </>
                        ) : (
                          <>
                            <UserRound className="w-3 h-3 mr-1" />
                            <span>Приём в кабинете</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">
                      {format(new Date(`${appointment.date}T00:00:00`), 'dd MMM yyyy', { locale: ru })}
                    </div>
                    <div className="text-gray-500">{appointment.time}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Причина обращения</h4>
                <p className="text-sm text-gray-600 mb-4">{appointment.reason}</p>
                
                <h4 className="text-sm font-medium text-gray-900 mb-2">Оценка ИИ</h4>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md mb-4">
                  <p className="text-xs text-gray-800">{appointment.aiContext}</p>
                </div>
                
                <div className="flex space-x-2">
                  {appointment.type === 'online' && (
                    <button
                      onClick={() => handleStartCall(appointment.id)}
                      className="flex-1 btn btn-primary text-sm py-2"
                    >
                      <Video className="w-4 h-4 mr-1 inline" />
                      Начать звонок
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 btn btn-success text-sm py-2"
                  >
                    <Check className="w-4 h-4 mr-1 inline" />
                    Завершить
                  </button>
                  
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="btn btn-secondary text-sm py-2"
                  >
                    <AlertCircle className="w-4 h-4 mr-1 inline" />
                    Отменить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAppointment && (
        <ConsultationModal
          appointment={selectedAppointment}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAppointment(null);
          }}
          onComplete={handleCompleteConsultation}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;