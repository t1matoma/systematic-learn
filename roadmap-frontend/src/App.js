import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Plus, ArrowLeft, BookOpen, Target, Award } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

function App() {
  const [view, setView] = useState('roadmaps'); // roadmaps, steps, tasks, test, results
  const [roadmaps, setRoadmaps] = useState([]);
  const [steps, setSteps] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentTest, setCurrentTest] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newRoadmapTitle, setNewRoadmapTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const response = await fetch(`${API_BASE}/roadmaps`);
      const data = await response.json();
      setRoadmaps(data);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    }
  };

  const createRoadmap = async () => {
    if (!newRoadmapTitle.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/roadmaps?message=${encodeURIComponent(newRoadmapTitle)}`, {
        method: 'POST',
      });
      await response.json();
      await fetchRoadmaps();
      setNewRoadmapTitle('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating roadmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const openRoadmap = async (roadmap) => {
    setSelectedRoadmap(roadmap);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/roadmaps/${roadmap.id}/steps`);
      const data = await response.json();
      setSteps(data);
      setView('steps');
    } catch (error) {
      console.error('Error fetching steps:', error);
    } finally {
      setLoading(false);
    }
  };

  const openStep = async (step) => {
    setSelectedStep(step);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/steps/${step.id}/tasks`);
      const data = await response.json();
      setTasks(data);
      setView('tasks');
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTasksForStep = async (stepId) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/steps/${stepId}/tasks`, {
        method: 'POST',
      });
      const response = await fetch(`${API_BASE}/steps/${stepId}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error creating tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTest = async (task) => {
    setSelectedTask(task);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/tasks/${task.id}/generate_test`, {
        method: 'POST',
      });
      const data = await response.json();
      setCurrentTest(data.quiz);
      setUserAnswers({});
      setView('test');
    } catch (error) {
      console.error('Error generating test:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      await fetch(`${API_BASE}/tasks/${taskId}/toggle`, {
        method: 'PATCH',
      });
      // Refresh tasks and roadmaps
      const response = await fetch(`${API_BASE}/steps/${selectedStep.id}/tasks`);
      const data = await response.json();
      setTasks(data);
      await fetchRoadmaps();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/tasks/${selectedTask.id}/check_answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: userAnswers }),
      });
      const result = await response.json();
      
      // Save results and show results screen
      setTestResults(result);
      setView('results');
      
      // Refresh roadmaps to update percentage
      await fetchRoadmaps();
    } catch (error) {
      console.error('Error submitting test:', error);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (view === 'results') {
      setView('roadmaps');
      setTestResults(null);
      setCurrentTest(null);
      setSelectedTask(null);
      setSelectedStep(null);
      setSelectedRoadmap(null);
    } else if (view === 'test') {
      setView('tasks');
      setCurrentTest(null);
    } else if (view === 'tasks') {
      setView('steps');
      setTasks([]);
      setSelectedStep(null);
    } else if (view === 'steps') {
      setView('roadmaps');
      setSteps([]);
      setSelectedRoadmap(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {view !== 'roadmaps' && (
                <button
                  onClick={goBack}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
              )}
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {view === 'roadmaps' && 'My Roadmaps'}
                {view === 'steps' && selectedRoadmap?.title}
                {view === 'tasks' && selectedStep?.title}
                {view === 'test' && 'Knowledge Check'}
                {view === 'results' && 'Test Results'}
              </h1>
            </div>
            {view === 'roadmaps' && selectedRoadmap && (
              <div className="text-2xl font-bold text-indigo-600">
                {selectedRoadmap.percentage}%
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {/* Roadmaps View */}
        {view === 'roadmaps' && !loading && (
          <div className="space-y-4">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                onClick={() => openRoadmap(roadmap)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 border-2 border-transparent hover:border-indigo-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Target className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{roadmap.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">Click to view steps</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">{roadmap.percentage}%</div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${roadmap.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {showAddForm ? (
              <div className="bg-white rounded-xl shadow-md p-6 border-2 border-indigo-300">
                <input
                  type="text"
                  value={newRoadmapTitle}
                  onChange={(e) => setNewRoadmapTitle(e.target.value)}
                  placeholder="e.g., Learn Python for Data Science"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && createRoadmap()}
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={createRoadmap}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewRoadmapTitle('');
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium text-lg"
              >
                <Plus className="w-6 h-6" />
                Add Roadmap
              </button>
            )}
          </div>
        )}

        {/* Steps View */}
        {view === 'steps' && !loading && (
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => openStep(step)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 border-2 border-transparent hover:border-purple-300"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center font-bold text-purple-600 text-xl">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Click to view tasks</p>
                  </div>
                  <BookOpen className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tasks View */}
        {view === 'tasks' && !loading && (
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No tasks created yet</p>
                <button
                  onClick={() => createTasksForStep(selectedStep.id)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Tasks
                </button>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-xl shadow-md p-6 border-2 border-transparent hover:border-green-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {task.is_done ? (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                        <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                          {task.body}
                        </div>
                        <div className="mt-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            task.is_done 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {task.is_done ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!task.is_done && (
                        <button
                          onClick={() => generateTest(task)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
                        >
                          <Award className="w-5 h-5" />
                          Take Test
                        </button>
                      )}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Quick Toggle
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Test View */}
        {view === 'test' && !loading && currentTest && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Test: {selectedTask?.title}</h2>
              <p className="text-gray-600">Answer all questions. You need 70% correct answers to pass.</p>
            </div>
            
            <div className="space-y-6">
              {currentTest.map((question) => (
                <div key={question.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-indigo-300 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {question.id}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, idx) => {
                      // Extract letter from option (e.g., "A) Text" -> "A")
                      const optionLetter = option.trim().charAt(0);
                      return (
                        <label
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={optionLetter}
                            checked={userAnswers[question.id] === optionLetter}
                            onChange={(e) =>
                              setUserAnswers({ ...userAnswers, [question.id]: e.target.value })
                            }
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={submitTest}
              disabled={Object.keys(userAnswers).length !== currentTest.length}
              className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              Submit Answers
            </button>
          </div>
        )}

        {/* Test Results View */}
        {view === 'results' && !loading && testResults && (
          <div className="max-w-4xl mx-auto">
            {/* Results Summary */}
            <div className={`rounded-xl shadow-lg p-8 mb-6 ${
              testResults.passed 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              <div className="text-center text-white">
                <div className="text-6xl font-bold mb-4">
                  {testResults.passed ? '🎉' : '😔'}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {testResults.passed ? 'Congratulations!' : 'Not Quite There'}
                </h2>
                <p className="text-xl mb-4">
                  You scored {testResults.correct} out of {testResults.total_questions}
                </p>
                <div className="text-4xl font-bold">
                  {Math.round((testResults.correct / testResults.total_questions) * 100)}%
                </div>
                <p className="mt-2 text-lg opacity-90">
                  {testResults.passed 
                    ? 'Great job! You passed the test!' 
                    : 'You need at least 70% to pass. Keep studying!'}
                </p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Review Your Answers</h3>
              
              {testResults.details.map((detail, index) => (
                <div
                  key={detail.question_id}
                  className={`bg-white rounded-xl shadow-md p-6 border-2 ${
                    detail.is_correct 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      detail.is_correct ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {detail.is_correct ? '✓' : '✗'}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Question {detail.question_id}: {detail.question}
                      </h4>
                      
                      <div className="space-y-2">
                        <div className={`p-3 rounded-lg ${
                          detail.user_answer === detail.right_answer 
                            ? 'bg-green-100 border-2 border-green-500' 
                            : 'bg-red-100 border-2 border-red-500'
                        }`}>
                          <span className="font-medium text-gray-700">Your answer: </span>
                          <span className="font-semibold">{detail.user_answer || 'Not answered'}</span>
                        </div>
                        
                        {!detail.is_correct && (
                          <div className="p-3 rounded-lg bg-green-100 border-2 border-green-500">
                            <span className="font-medium text-gray-700">Correct answer: </span>
                            <span className="font-semibold text-green-700">{detail.right_answer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  setView('roadmaps');
                  setTestResults(null);
                  setCurrentTest(null);
                  setSelectedTask(null);
                  setSelectedStep(null);
                  setSelectedRoadmap(null);
                }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium text-lg"
              >
                Back to Roadmaps
              </button>
              
              {!testResults.passed && (
                <button
                  onClick={() => {
                    setView('tasks');
                    setTestResults(null);
                    setCurrentTest(null);
                  }}
                  className="flex-1 bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl font-medium text-lg"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;