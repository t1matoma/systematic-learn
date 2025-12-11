import { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Service/api";
import { Question, TestResult } from "../Service/types";

// Дополнительные типы для API ответов
interface ApiQuizQuestion {
  id: number;
  question: string;
  options: string[];
  right_answer: string;
  explanation?: string;
}

interface GenerateTestApiResponse {
  message: string;
  quiz: ApiQuizQuestion[];
  task_id: number;
}

const TestPage: FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (taskId) {
      generateTest();
      setTaskTitle("Тестирование знаний");
    }
  }, [taskId]);

  const generateTest = async () => {
    setLoading(true);
    try {
      const response = await api.tests.generateTest(Number(taskId));
      const responseData = response.data as any;
      
      if (responseData.quiz && Array.isArray(responseData.quiz)) {
        const formattedQuestions: Question[] = responseData.quiz.map((q: ApiQuizQuestion) => ({
          id: q.id.toString(),
          question: q.question,
          options: q.options || [],
          correct_answer: q.right_answer,
          explanation: q.explanation
        }));
        
        setQuestions(formattedQuestions);
      } else {
        console.error("Unexpected response format:", responseData);
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error generating test:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitTest = async () => {
    if (!Array.isArray(questions) || questions.length === 0) {
      alert("Вопросы не загружены!");
      return;
    }
    
    if (Object.keys(answers).length !== questions.length) {
      alert("Пожалуйста, ответьте на все вопросы!");
      return;
    }

    setSubmitting(true);
    try {
      const userAnswers: Record<string, string> = {};
      
      Object.keys(answers).forEach(questionId => {
        const answerText = answers[questionId];
        const match = answerText.match(/^([A-D])\)/);
        if (match) {
          userAnswers[questionId] = match[1];
        } else {
          userAnswers[questionId] = answerText;
        }
      });
      
      const response = await api.tests.checkAnswers(Number(taskId), { 
        answers: userAnswers 
      });
      setResult(response.data as TestResult);
    } catch (error) {
      console.error("Error checking answers:", error);
      alert("Ошибка при проверке ответов");
    } finally {
      setSubmitting(false);
    }
  };

  const restartTest = () => {
    setAnswers({});
    setResult(null);
    generateTest();
  };

  if (loading && !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900">Генерация теста</h2>
          <p className="text-gray-600 mt-2">Искусственный интеллект создает вопросы...</p>
        </div>
      </div>
    );
  }

  if (!loading && (!Array.isArray(questions) || questions.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                Задачи
              </button>
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-900">Тест</span>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{taskTitle}</h1>
                <p className="text-gray-600 mt-2">
                  Проверьте свои знания по пройденному материалу
                </p>
              </div>
              
              <button 
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Назад к задачам</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Вопросы не найдены</h3>
            <p className="text-gray-600 mb-6">Не удалось загрузить вопросы для теста</p>
            <button 
              onClick={generateTest}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-md transition-all duration-200"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Навигация */}
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
              Задачи
            </button>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900">Тест</span>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{taskTitle}</h1>
              <p className="text-gray-600 mt-2">
                Проверьте свои знания по пройденному материалу
              </p>
            </div>
            
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Назад к задачам</span>
            </button>
          </div>
        </div>

        {/* Прогресс бар теста */}
        {!result && Array.isArray(questions) && questions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Прогресс теста</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Ответов: {Object.keys(answers).length} из {questions.length}
                </p>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-sm font-medium rounded-xl">
                Вопрос {Math.min(Object.keys(answers).length + 1, questions.length)} из {questions.length}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {result ? (
          <div className="animate-fadeIn">
            {/* Результаты теста */}
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-8 border border-emerald-100 shadow-lg text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-green-50 flex items-center justify-center">
                {result.passed ? (
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {result.passed ? "Поздравляем! 🎉" : "Попробуйте еще раз"}
              </h2>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {result.passed 
                  ? "Вы успешно прошли тест и подтвердили свои знания по теме."
                  : "К сожалению, вы не набрали достаточное количество баллов. Рекомендуем повторить материал."
                }
              </p>

              {/* Статистика */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {result.correct}/{result.total_questions}
                  </div>
                  <p className="text-gray-600">Правильных ответов</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {Math.round((result.correct / result.total_questions) * 100)}%
                  </div>
                  <p className="text-gray-600">Процент успеха</p>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={restartTest}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover-lift"
                >
                  Пройти тест заново
                </button>
                
                <button 
                  onClick={() => navigate(-1)}
                  className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  Вернуться к задачам
                </button>
              </div>
            </div>

            {/* Рекомендации */}
            {!result.passed && (
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Рекомендации
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">Внимательно изучите материал задачи еще раз</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">Сделайте заметки по ключевым моментам</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">Пройдите тест еще раз после повторения материала</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          Array.isArray(questions) && questions.length > 0 && (
            <>
              {/* Список вопросов */}
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div 
                    key={question?.id || index} 
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-50 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {question?.question || `Вопрос ${index + 1}`}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pl-14">
                        {Array.isArray(question?.options) ? (
                          question.options.map((option: string, idx: number) => (
                            <label 
                              key={idx} 
                              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                answers[question.id] === option
                                  ? 'border-blue-300 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={answers[question.id] === option}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                className="hidden"
                              />
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-4 ${
                                answers[question.id] === option
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {answers[question.id] === option && (
                                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className="text-gray-800 flex-1">{option}</span>
                              
                              {/* Индикатор выбора */}
                              {answers[question.id] === option && (
                                <span className="text-blue-600 font-medium text-sm ml-2">
                                  Выбрано
                                </span>
                              )}
                            </label>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">Нет вариантов ответа</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Кнопка завершения */}
              <div className="sticky bottom-6 mt-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-xl">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div>
                    <p className="text-gray-900 font-medium">
                      {Object.keys(answers).length === questions.length
                        ? "Все вопросы отвечены ✓"
                        : `Осталось ответить на ${questions.length - Object.keys(answers).length} вопросов`
                      }
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Проверьте свои ответы перед завершением
                    </p>
                  </div>
                  
                  <button 
                    onClick={submitTest}
                    disabled={Object.keys(answers).length !== questions.length || submitting}
                    className={`mt-4 sm:mt-0 px-8 py-3 font-semibold rounded-xl transition-all duration-200 hover-lift ${
                      Object.keys(answers).length !== questions.length || submitting
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Проверка...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <span>Завершить тест</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default TestPage;