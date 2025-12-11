import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Service/api";

const CreateRoadmapPage: FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Введите название темы");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Создаем roadmap с минимальными параметрами
      await api.roadmaps.createRoadmap({
  title: title.trim()
});
      
      // Перенаправляем на список roadmap
      navigate("/roadmaps");
      
    } catch (err) {
      console.error("Ошибка при создании roadmap:", err);
      setError("Не удалось создать roadmap. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Заголовок и навигация */}
        <div className="mb-8 text-center">
          <button 
            onClick={handleCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Назад</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Новый Roadmap
          </h1>
          <p className="text-gray-600">
            Создайте учебный маршрут по интересующей теме
          </p>
        </div>

        {/* Простая форма */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Единственное поле - название темы */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Название темы *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError(""); // Сбрасываем ошибку при вводе
                }}
                className={`w-full px-4 py-3 rounded-xl border ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Например: 'Изучение React', 'Основы Python'"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Введите тему, по которой хотите создать учебный план
              </p>
            </div>

            {/* Кнопки */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-white text-gray-800 font-medium rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Создание...</span>
                  </span>
                ) : (
                  "Создать Roadmap"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Примеры тем */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Примеры популярных тем:
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTitle("Изучение React с нуля")}
              className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-sm text-gray-700">React с нуля</span>
            </button>
            <button
              type="button"
              onClick={() => setTitle("Основы Python для начинающих")}
              className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-sm text-gray-700">Python для начинающих</span>
            </button>
            <button
              type="button"
              onClick={() => setTitle("Веб-разработка 2024")}
              className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-sm text-gray-700">Веб-разработка</span>
            </button>
            <button
              type="button"
              onClick={() => setTitle("Машинное обучение и AI")}
              className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-sm text-gray-700">Машинное обучение</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoadmapPage;