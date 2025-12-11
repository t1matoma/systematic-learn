import { FC } from "react";
import MainPage from "./Pages/MainPage";
import MyRoadmapsList from "./Pages/MyRoadmapsList";
import StepsPage from "./Pages/StepsPage";
import TasksPage from "./Pages/TasksPage";
import TestPage from "./Pages/TestPage";

export interface RouteData {
  permissions: ReadonlyArray<string>;
  page: FC;
}

export const routeMap = new Map<string, RouteData>()
  .set("/", {
    page: MainPage,
    permissions: [],
  })
  .set("/roadmaps", {
    page: MyRoadmapsList,
    permissions: [],
  })
  .set("/roadmaps/:roadmapId/steps", {
    page: StepsPage,
    permissions: [],
  })
  .set("/steps/:stepId/tasks", {
    page: TasksPage,
    permissions: [],
  })
  .set("/tasks/:taskId/test", {
    page: TestPage,
    permissions: [],
  });

export const routeArray = Array.from(routeMap, ([path, r]) => ({ ...r, path }));