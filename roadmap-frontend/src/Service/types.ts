export type DefaultRequestParams = {
  page?: number;
  limit?: number;
  [key: string]: any;
};

export type SRoadmap = {
  id: number;
  title: string;
  percentage: number;
};

export type SStep = {
  id: number;
  title: string;
  roadmap_id: number;
};

export type STask = {
  id: number;
  title: string;
  body: string;
  is_done: boolean | null;
  step_id: number;
};

export type Question = {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
};

export type UserAnswers = {
  answers: Record<string, string>;
};

export type TestResult = {
  task_id: number;
  total_questions: number;
  correct: number;
  passed: boolean;
  details: Array<{
    question_id: string;
    is_correct: boolean;
  }>;
};

export type ValidationError = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

export type HTTPValidationError = {
  detail: ValidationError[];
};

export type CreateRoadmapParams = {
  title: string;
};

export type GetStepsParams = {
  roadmap_id: number;
};

export type GetTasksParams = {
  step_id: number;
};

export type CreateTaskParams = {
  step_id: number;
  title: string;
  body?: string;
};

export type ToggleTaskParams = {
  task_id: number;
};

export type GenerateTestParams = {
  task_id: number;
};

export type CheckAnswersParams = {
  task_id: number;
  answers: UserAnswers;
};