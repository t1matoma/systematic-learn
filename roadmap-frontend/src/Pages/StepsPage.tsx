import { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Service/api";
import { SStep } from "../Service/types";

const StepsPage: FC = () => {
  const { roadmapId } = useParams<{ roadmapId: string }>();
  const [steps, setSteps] = useState<SStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [roadmapTitle, setRoadmapTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (roadmapId) {
      loadData();
    }
  }, [roadmapId]);

  const loadData = async () => {
    try {
      // Загружаем шаги
      const stepsResponse = await api.steps.getSteps(Number(roadmapId));
      setSteps(stepsResponse.data);
      
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (stepId: number) => {
    navigate(`/steps/${stepId}/tasks`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Хлебные крошки и заголовок */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <button 
              onClick={() => navigate("/roadmaps")}
              className="hover:text-blue-600 transition-colors"
            >
              Roadmaps
            </button>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900">{roadmapTitle}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Этапы обучения</h1>
              <p className="text-gray-600 mt-2">
                Пройдите все этапы для завершения курса "{roadmapTitle}"
              </p>
            </div>
            
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Назад</span>
            </button>
          </div>
        </div>

        <div className="mb-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Общий прогресс</h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
              {Math.round(steps.reduce((acc, step) => acc + ( 0), 0) / steps.length)}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ 
                width: `${steps.length > 0 ? Math.round(steps.reduce((acc, step) => acc + (0), 0) / steps.length) : 0}%` 
              }}
            />
          </div>
        </div>

        {/* Сетка шагов */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step: any, index) => (
            <div 
              key={step.id} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover-lift cursor-pointer group transition-all duration-300"
              onClick={() => handleStepClick(step.id)}
            >
              <div className="p-6">
                {/* Номер и статус */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      step.is_completed 
                        ? 'bg-gradient-to-br from-green-100 to-emerald-50' 
                        : 'bg-gradient-to-br from-blue-100 to-purple-50'
                    }`}>
                      <span className={`font-bold ${
                        step.is_completed ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        step.is_completed 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {step.is_completed ? 'Завершено' : 'В процессе'}
                      </span>
                    </div>
                  </div>
                  
                  {step.is_completed && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 mb-6 line-clamp-2">
                </p>

                {/* Прогресс и статистика */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Прогресс этапа</span>
                      <span>{step.progress || 0}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          step.is_completed 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                            : 'bg-gradient-to-r from-blue-400 to-purple-400'
                        }`}
                        style={{ width: `${step.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{step.estimated_time || "2ч"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{step.tasks_count || 0} задач</span>
                      </div>
                    </div>
                    
                    <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      Начать →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Если шагов нет */}
        {steps.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚧</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Этапы не найдены</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Для этого roadmap еще не созданы этапы обучения
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepsPage;