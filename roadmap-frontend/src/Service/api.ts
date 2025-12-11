import Roadmaps from "./roadmaps";
import Steps from "./steps";
import Tasks from "./tasks";
import Tests from "./tests";

class ApiService {
  public roadmaps = new Roadmaps();
  public steps = new Steps();
  public tasks = new Tasks();
  public tests = new Tests();
}

export default new ApiService();