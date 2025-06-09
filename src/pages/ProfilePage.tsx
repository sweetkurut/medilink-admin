import { useState, FormEvent } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User, Mail, Stethoscope, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { doctor, updateDoctorProfile, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    email: doctor?.email || '',
    specialty: doctor?.specialty || '',
    profileImage: doctor?.profileImage || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateDoctorProfile(formData);
      toast.success('Профиль успешно обновлён');
    } catch (error) {
      toast.error('Не удалось обновить профиль');
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Профиль врача</h1>
        <p className="text-gray-600">Управляйте своей личной и профессиональной информацией</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex flex-col items-center text-center">
              <img 
                src={doctor?.profileImage || "https://randomuser.me/api/portraits/men/75.jpg"} 
                alt={doctor?.name} 
                className="w-32 h-32 rounded-full mb-4"
              />
              <h2 className="text-xl font-medium text-gray-900">{doctor?.name}</h2>
              <p className="text-gray-500 mb-2">{doctor?.specialty}</p>
              <p className="text-gray-600 mb-4">{doctor?.email}</p>
              
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm">
                <p>Активный аккаунт</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Редактировать профиль</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control md:col-span-2">
                  <label htmlFor="name" className="form-label">Полное имя</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      {/* <User className="w-5 h-5 text-gray-400" /> */}
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 form-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-control md:col-span-2">
                  <label htmlFor="email" className="form-label">Электронная почта</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      {/* <Mail className="w-5 h-5 text-gray-400" /> */}
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 form-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-control md:col-span-2">
                  <label htmlFor="specialty" className="form-label">Специальность</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      {/* <Stethoscope className="w-5 h-5 text-gray-400" /> */}
                    </div>
                    <input
                      id="specialty"
                      name="specialty"
                      type="text"
                      value={formData.specialty}
                      onChange={handleChange}
                      className="pl-10 form-input"
                    />
                  </div>
                </div>
                
                <div className="form-control md:col-span-2">
                  <label htmlFor="profileImage" className="form-label">URL фото профиля</label>
                  <input
                    id="profileImage"
                    name="profileImage"
                    type="text"
                    value={formData.profileImage}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center">
                      <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-white rounded-full"></span>
                      Сохранение...
                    </span>
                  ) : (
                    <span className="inline-flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить изменения
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;