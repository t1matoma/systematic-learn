import { FC } from "react";
import { useNavigate } from "react-router-dom";

const MainPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Управляйте обучением
              </span>
              <br />
              <span className="text-gray-900">с современным подходом</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Создавайте, отслеживайте и оптимизируйте свои учебные маршруты с помощью
              искусственного интеллекта и передовых инструментов аналитики.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/roadmaps")}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover-lift"
              >
                Начать работу →
              </button>
              <button
                onClick={() => navigate("/create-roadmap")}
                className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                Создать Roadmap
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Почему выбирают нас
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover-lift">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Аналитика прогресса</h3>
            <p className="text-gray-600">
              Детальная статистика и визуализация вашего прогресса в реальном времени
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover-lift">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-50 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Ассистент</h3>
            <p className="text-gray-600">
              Интеллектуальные рекомендации и автоматическая генерация материалов
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover-lift">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Высокая скорость</h3>
            <p className="text-gray-600">
              Мгновенная работа всех инструментов и быстрая генерация контента
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;