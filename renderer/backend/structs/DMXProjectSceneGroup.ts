import DMXProjectScene from "./DMXProjectScene";

interface DMXProjectSceneGroup {
    id: string;
    name: string;
    color: string;
    scenes: DMXProjectScene[];
}

export default DMXProjectSceneGroup;