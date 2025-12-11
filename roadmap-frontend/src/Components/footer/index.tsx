import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Roadmap Pro
              </span>
            </div>
            <p className="text-gray-600 max-w-md">
              Современная платформа для управления учебными маршрутами. 
              Достигайте целей эффективнее с нашими инструментами.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Продукт</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Возможности</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Тарифы</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Документация</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Компания</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">О нас</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Блог</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Карьера</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Поддержка</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Помощь</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Контакты</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Статус</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Roadmap Pro. Все права защищены.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-blue-600 transition-colors">Политика конфиденциальности</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;