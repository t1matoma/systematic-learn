import { FC } from "react";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";

const Header: FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Roadmap Pro
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => navigate("/roadmaps")}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Мои Roadmaps
            </button>
            <button
              onClick={() => navigate("/create-roadmap")}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 hover-lift"
            >
              + Создать
            </button>

            <ProfileButton />
          </nav>

          <div className="flex items-center space-x-3 md:hidden">
            <ProfileButton />
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;