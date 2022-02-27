import {NextPage} from 'next';
import {useRouter} from 'next/dist/client/router';
import {useContext, useState} from 'react';
import {AppControlContext} from '../../components/appContextProvider';
import DMXProject from "../../backend/structs/DMXProject";
import {ipcRenderer} from 'electron';
//import {dialog} from "@electron/remote";

const ProjectManagementNewPage: NextPage = () => {
    const router = useRouter();

    const [projectName, setProjectName] = useState('');
    const [error, setError] = useState('');
    const randomPlaceholders = [
        'Cool light stuff',
        'test1234',
        'pleasework',
        'copy of a copy of a copy',
        'the real project',
    ];

    const {projectManager, saveProject} = useContext(AppControlContext);

    const createProject = async () => {
        setError('');
        if (projectName.length < 1) {
            setError('Project name is required');
            return;
        }
        const newProject = DMXProject.empty(projectName);

        ipcRenderer.once("app::save-file-done", (event, data) => {
            projectManager.projectFilePath = data;
            projectManager.currentProject = newProject;
            saveProject(projectManager.currentProject);
            router.push(
                '/projectmanagement/addDevice?skipAllowed=true&hideBackButton=true')

        });

        ipcRenderer.send("app::save-file-dialog", projectName);


        /*
                //projectManager.projectFilePath
                projectManager.currentProject = newProject;
                saveProject(projectManager.currentProject);
                router.push(
                    '/projectmanagement/addDevice?skipAllowed=true&hideBackButton=true'
                );*/
    };

    return (
        <div
            className="flex justify-center text-black dark:bg-gray-900 bg-gray-100 h-screen w-screen overflow-hidden text-center dark:text-white">
            <div className="self-center">
                <h1 className="text-3xl font-semibold">New Project</h1>
                <p className="my-1">Please enter a project name</p>
                <div>
                    <input
                        className="rounded-xl border-gray-300 border p-2 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                        placeholder={
                            randomPlaceholders[
                                Math.floor(Math.random() * randomPlaceholders.length)
                                ]
                        }
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />
                </div>
                <button
                    className="mt-4 bg-blue-500 p-2 px-4 rounded-xl text-white"
                    onClick={createProject}
                >
                    Continue
                </button>
                <p></p>
                <button className={"my-2 underline text-blue-500 hover:text-blue-400"} onClick={() => {
                    router.push("/")
                }}>Back
                </button>
                {error !== '' ? <p className="text-red-500">{error}</p> : <div/>}
            </div>
        </div>
    );
};

export default ProjectManagementNewPage;
