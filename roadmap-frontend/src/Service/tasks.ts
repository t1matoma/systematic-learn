import { client } from "./axios";
import { TASKS, TASK_TOGGLE } from "./apiRequest";
import { STask } from "./types";

class Tasks {
  getTasks(stepId: number) {
    return client.get<STask[]>(TASKS(stepId));
  }
  
  createTasks(stepId: number) {
    return client.post<STask[]>(TASKS(stepId));
  }
  
  toggleTask(taskId: number) {
    return client.patch<STask>(TASK_TOGGLE(taskId));
  }
}

export default Tasks;