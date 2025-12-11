import { client } from "./axios";
import { STEPS } from "./apiRequest";
import { SStep } from "./types";

class Steps {
  getSteps(roadmapId: number) {
    return client.get<SStep[]>(STEPS(roadmapId));
  }
}

export default Steps;