import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Search, Video, UserRound } from "lucide-react";
import { useAppointmentStore, Appointment } from "../stores/appointmentStore";
import ConsultationDetailModal from "../components/history/ConsultationDetailModal";

const ConsultationHistoryPage = () => {
    const { pastAppointments, fetchPastAppointments, isLoading } = useAppointmentStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedConsultation, setSelectedConsultation] = useState<Appointment | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState("all");

    useEffect(() => {
        fetchPastAppointments();
    }, [fetchPastAppointments]);

    const handleViewDetails = (consultation: Appointment) => {
        setSelectedConsultation(consultation);
        setIsDetailModalOpen(true);
    };

    const filteredConsultations = pastAppointments.filter((consultation) => {
        const matchesSearch = consultation.patient.name.toLowerCase().includes(searchTerm.toLowerCase());

        if (dateFilter === "all") return matchesSearch;

        const consultationDate = new Date(consultation.date);
        const now = new Date();

        if (dateFilter === "week") {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return matchesSearch && consultationDate >= oneWeekAgo;
        }

        if (dateFilter === "month") {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);
            return matchesSearch && consultationDate >= oneMonthAgo;
        }

        if (dateFilter === "year") {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            return matchesSearch && consultationDate >= oneYearAgo;
        }

        return false;
    });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">История консультаций</h1>
                <p className="text-gray-600">Просматривайте прошлые консультации пациентов и записи лечения</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 flex items-center pr-5 pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Поиск пациентов..."
                                className="pl-10 w-full form-input"
                            />
                        </div>

                        <div>
                            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="form-input">
                                <option value="all">За всё время</option>
                                <option value="week">За неделю</option>
                                <option value="month">За месяц</option>
                                <option value="year">За год</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredConsultations.length === 0 ? (
                    <div className="text-center p-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Консультации не найдены</h3>
                        <p className="text-gray-600">
                            {searchTerm
                                ? "Попробуйте изменить параметры поиска для поиска прошлых консультаций."
                                : "У вас нет прошлых консультаций в выбранном периоде."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Пациент</th>
                                    <th>Дата и время</th>
                                    <th>Тип</th>
                                    <th>Причина</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredConsultations.map((consultation) => (
                                    <tr key={consultation.id} className="hover:bg-gray-50">
                                        <td className="flex items-center">
                                            <img
                                                src={consultation.patient.profileImage || "https://via.placeholder.com/40"}
                                                alt={consultation.patient.name}
                                                className="w-8 h-8 rounded-full mr-3"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900">{consultation.patient.name}</div>
                                                <div className="text-sm text-gray-500">{consultation.patient.email}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-medium text-gray-900">
                                                {format(new Date(`${consultation.date}T00:00:00`), "dd MMM yyyy", { locale: ru })}
                                            </div>
                                            <div className="text-sm text-gray-500">{consultation.time}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center">
                                                {consultation.type === "online" ? (
                                                    <>
                                                        <Video className="w-4 h-4 mr-1 text-blue-500" />
                                                        <span>Онлайн</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserRound className="w-4 h-4 mr-1 text-green-500" />
                                                        <span>В кабинете</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="max-w-xs truncate">{consultation.reason}</div>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleViewDetails(consultation)}
                                                className="btn btn-secondary text-xs py-1"
                                            >
                                                Подробности
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedConsultation && (
                <ConsultationDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    consultation={selectedConsultation}
                />
            )}
        </div>
    );
};

export default ConsultationHistoryPage;
