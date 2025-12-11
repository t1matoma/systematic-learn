import { client } from "./axios";
import { ROADMAPS } from "./apiRequest";
import { SRoadmap, CreateRoadmapParams } from "./types";

class Roadmaps {
  getRoadmaps() {
    return client.get<SRoadmap[]>(ROADMAPS);
  }

  createRoadmap(params: CreateRoadmapParams) {
    // Передаем JSON в теле запроса
    return client.post<SRoadmap>(ROADMAPS, params);
  }
}

export default Roadmaps;
