import { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Service/api";
import { STask } from "../Service/types";

const TasksPage: FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const [tasks, setTasks] = useState<STask[]>([]);
  const [loading, setLoading] = useState(true);
  const [stepTitle, setStepTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (stepId) {
      loadData();
    }
  }, [stepId]);

  const loadData = async () => {
    try {
      const tasksResponse = await api.tasks.getTasks(Number(stepId));
      setTasks(tasksResponse.data);
      
      // Предположим, что у нас есть API для получения информации о шаге
      // const stepResponse = await api.steps.getStep(Number(stepId));
      // setStepTitle(stepResponse.data.title);
      setStepTitle("Шаг обучения"); // Временный заголовок
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: number, currentStatus: boolean | null) => {
    try {
      await api.tasks.toggleTask(taskId);
      loadData(); // Перезагружаем задачи
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // Добавляем функцию создания задач
const handleCreateTasks = async () => {
  if (!stepId) return;
  try {
    setLoading(true);
    await api.tasks.createTasks(Number(stepId));
    await loadData(); // обновляем список после создания
  } catch (error) {
    console.error("Ошибка при создании задач:", error);
  } finally {
    setLoading(false);
  }
};


  const handleCreateTest = (taskId: number) => {
    navigate(`/tasks/${taskId}/test`);
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.is_done).length;
    return Math.round((completed / tasks.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/30">
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
            <button 
              onClick={() => navigate(-1)}
              className="hover:text-blue-600 transition-colors"
            >
              Этапы
            </button>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900">Задачи</span>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{stepTitle}</h1>
              <p className="text-gray-600 mt-2">
                Выполните задачи для завершения этапа
              </p>
            </div>
            
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Назад к этапам</span>
            </button>
          </div>
        </div>

        {/* Статистика прогресса */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего задач</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{tasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Выполнено</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {tasks.filter(task => task.is_done).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Прогресс</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{calculateProgress()}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-4">
  <button
    onClick={handleCreateTasks}
    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
  >
    Создать задачи
  </button>
</div>


        {/* Список задач */}
        <div className="space-y-4">
          {tasks.map((task: any, index) => (
            <div 
              key={task.id} 
              className={`bg-white rounded-2xl border ${
                task.is_done 
                  ? 'border-green-100 bg-gradient-to-r from-white to-green-50/30' 
                  : 'border-gray-100'
              } shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        task.is_done 
                          ? 'bg-gradient-to-br from-green-100 to-emerald-50' 
                          : 'bg-gradient-to-br from-blue-100 to-purple-50'
                      }`}>
                        <span className={`font-bold ${
                          task.is_done ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          task.is_done ? 'text-gray-700 line-through' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        {task.is_done && (
                          <span className="text-sm text-green-600 font-medium">
                            ✓ Выполнено
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 pl-11">
                      {task.body || "Описание задачи..."}
                    </p>
                    
                    <div className="flex items-center space-x-4 pl-11">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">{task.estimated_time || "30 мин"}</span>
                      </div>
                      
                      {task.difficulty && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.difficulty === 'hard' 
                            ? 'bg-red-50 text-red-700' 
                            : task.difficulty === 'medium'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-green-50 text-green-700'
                        }`}>
                          {task.difficulty === 'hard' ? 'Сложная' : 
                           task.difficulty === 'medium' ? 'Средняя' : 'Легкая'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3 ml-4">
                    <button 
                      onClick={() => handleToggleTask(task.id, task.is_done)}
                      className={`px-4 py-2 font-medium rounded-xl transition-all duration-200 ${
                        task.is_done
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                      }`}
                    >
                      {task.is_done ? '✓ Выполнено' : 'Выполнить'}
                    </button>
                    
                    <button 
                      onClick={() => handleCreateTest(task.id)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Пройти тест</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Если задач нет */}
        {tasks.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Задачи не найдены</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Для этого этапа еще не созданы задачи
            </p>
            <button 
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Вернуться к этапам
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;