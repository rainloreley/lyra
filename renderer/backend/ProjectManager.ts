import DMXProject from "./structs/DMXProject";
import DMXInterface from "./Interface/DMXInterface";

class ProjectManager {

    projectFilePath?: string;
    currentProject?: DMXProject;
    interface?: DMXInterface;

    constructor() {
        this.currentProject = null;
    }
}

export default ProjectManager;
