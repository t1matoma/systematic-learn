import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Service/api";
import { SRoadmap } from "../Service/types";

const MyRoadmapsList: FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<SRoadmap[]>([]);

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    try {
      const response = await api.roadmaps.getRoadmaps();
      setRoadmaps(response.data);
    } catch (error) {
      console.error("Error loading roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoadmapClick = (id: number) => {
    navigate(`/roadmaps/${id}/steps`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Мои Roadmaps</h1>
            <p className="text-gray-600 mt-2">Управляйте своими учебными маршрутами</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600">Всего Roadmaps</p>
              <p className="text-2xl font-bold text-gray-900">{roadmaps.length}</p>
            </div>

            <button
              onClick={() => navigate("/create-roadmap")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover-lift flex items-center space-x-2"
            >
              <span>+</span>
              <span>Создать новый</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap: any) => (
            <div
              key={roadmap.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover-lift cursor-pointer transition-all duration-200"
              onClick={() => handleRoadmapClick(roadmap.id)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{roadmap.title}</h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                    {roadmap.percentage}%
                  </span>
                </div>

                <p className="text-gray-600 mb-6 line-clamp-2">
                  {roadmap.description || "Описание roadmap..."}
                </p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Прогресс</span>
                    <span>{roadmap.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${roadmap.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Последнее обновление</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Подробнее →
                </button>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">Активный</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {roadmaps.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Пока нет Roadmaps</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Создайте свой первый учебный маршрут, чтобы начать эффективное обучение
            </p>
            <button
              onClick={() => navigate("/create-roadmap")}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Создать первый Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRoadmapsList;