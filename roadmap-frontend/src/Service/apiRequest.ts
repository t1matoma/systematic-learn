// Roadmaps
export const ROADMAPS = "roadmaps/";

// Steps
export const STEPS = (roadmapId: number) => `roadmaps/${roadmapId}/steps/`;

// Tasks
export const TASKS = (stepId: number) => `steps/${stepId}/tasks/`;
export const TASK_TOGGLE = (taskId: number) => `tasks/${taskId}/toggle/`;

// Tests
export const GENERATE_TEST = (taskId: number) => `tasks/${taskId}/generate_test/`;
export const CHECK_ANSWERS = (taskId: number) => `tasks/${taskId}/check_answers/`;