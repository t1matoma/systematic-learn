import './style.css';
import { Routes, Route } from "react-router-dom";
import Header from "./Components/navbar/index";
import Footer from "./Components/footer/index";
import MainPage from "./Pages/MainPage";
import MyRoadmapsList from "./Pages/MyRoadmapsList";
import CreateRoadmapPage from "./Pages/CreateRoadmapPage"; 
import StepsPage from "./Pages/StepsPage";
import TasksPage from "./Pages/TasksPage";
import TestPage from "./Pages/TestPage";

function App() {
  return (
    <div className="app min-h-screen flex flex-col bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/roadmaps" element={<MyRoadmapsList />} />
          <Route path="/create-roadmap" element={<CreateRoadmapPage />} /> 
          <Route path="/roadmaps/:roadmapId/steps" element={<StepsPage />} />
          <Route path="/steps/:stepId/tasks" element={<TasksPage />} />
          <Route path="/tasks/:taskId/test" element={<TestPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;