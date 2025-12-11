import { client } from "./axios";
import { GENERATE_TEST, CHECK_ANSWERS } from "./apiRequest";
import { Question, TestResult, UserAnswers } from "./types";

class Tests {
  generateTest(taskId: number) {
    return client.post<Question[]>(GENERATE_TEST(taskId));
  }
  
  checkAnswers(taskId: number, answers: UserAnswers) {
    return client.post<TestResult>(CHECK_ANSWERS(taskId), answers);
  }
}

export default Tests;