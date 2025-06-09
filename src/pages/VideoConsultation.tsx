import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Video, Mic, MicOff, VideoOff, Phone, MessageSquare } from 'lucide-react';
import { useAppointmentStore, Appointment } from '../stores/appointmentStore';
import toast from 'react-hot-toast';


const VideoConsultation = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { upcomingAppointments, fetchUpcomingAppointments, isLoading } = useAppointmentStore();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'doctor' | 'patient' }>>([]);
  const [messageText, setMessageText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingAppointments().then(() => {
      if (appointmentId && upcomingAppointments.length > 0) {
        const found = upcomingAppointments.find(a => a.id === appointmentId);
        setAppointment(found || null);
        
        if (!found) {
          toast.error('Приём не найден');
          navigate('/appointments');
        } else if (found.type !== 'online') {
          toast.error('Это не онлайн консультация');
          navigate('/appointments');
        }
      }
    });
  }, [appointmentId, fetchUpcomingAppointments, navigate, upcomingAppointments]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    setMessages([...messages, { text: messageText, sender: 'doctor' }]);
    setMessageText('');
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          text: "Спасибо за информацию, доктор. Теперь я понимаю, что мне нужно делать.", 
          sender: 'patient' 
        }
      ]);
    }, 3000);
  };

  const handleEndCall = () => {
    if (window.confirm('Вы уверены, что хотите завершить эту консультацию?')) {
      navigate('/appointments');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Приём не найден</h1>
          <p className="mb-4">Этот приём не существует или не является онлайн консультацией.</p>
          <button
            onClick={() => navigate('/appointments')}
            className="btn btn-primary"
          >
            Вернуться к приёмам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src={appointment.patient.profileImage || "https://via.placeholder.com/40"}
            alt={appointment.patient.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="text-white">
            <h3 className="font-medium">{appointment.patient.name}</h3>
            <p className="text-sm text-gray-400">Онлайн консультация</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/appointments')}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>
      
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 overflow-hidden">
              <img 
                src={appointment.patient.profileImage || "https://via.placeholder.com/400"}
                alt={appointment.patient.name}
                className="min-w-full min-h-full object-cover"
              />
              {!isVideoOn && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
                  <p className="text-white text-lg">Камера выключена</p>
                </div>
              )}
              <div className="absolute bottom-4 left-4 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                {appointment.patient.name}
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-xs">Ваша камера</span>
              </div>
              {!isVideoOn && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
                  <p className="text-white text-xs">Камера выключена</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 flex justify-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-3 rounded-full ${isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {isAudioOn ? (
                  <Mic className="w-6 h-6 text-white" />
                ) : (
                  <MicOff className="w-6 h-6 text-white" />
                )}
              </button>
              
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {isVideoOn ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <VideoOff className="w-6 h-6 text-white" />
                )}
              </button>
              
              <button
                onClick={handleEndCall}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700"
              >
                <Phone className="w-6 h-6 text-white" />
              </button>
              
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`p-3 rounded-full ${isChatOpen ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                <MessageSquare className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        {isChatOpen && (
          <div className="w-80 bg-white flex flex-col">
            <div className="p-3 border-b border-gray-200 font-medium">
              Чат
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-4">
                  <p>Пока нет сообщений</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg max-w-[80%] ${
                        msg.sender === 'doctor' 
                          ? 'bg-primary-100 text-gray-800 ml-auto'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
              <div className="flex">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Введите ваше сообщение..."
                  className="form-input flex-1 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="ml-2 btn btn-primary py-2 px-3 text-sm"
                >
                  Отправить
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoConsultation;