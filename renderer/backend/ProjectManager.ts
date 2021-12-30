import { ipcMain } from 'electron';
import fs from 'fs';
import DMXProject from "./structs/DMXProject";
import DMXInterface from "./Interface/DMXInterface";
import FX5Interface from "./Interface/DMXI_FX5";

class ProjectManager {

	projectFilePath?: string;
	currentProject?: DMXProject;
	interface?: DMXInterface;

	constructor() {
		this.currentProject = null;
	}
}

export default ProjectManager;
