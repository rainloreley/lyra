import { ipcRenderer } from 'electron';
import {createContext, Dispatch, SetStateAction, useEffect, useState} from 'react';
import { clearInterval } from 'timers';
import LoadingSpinner from './loadingSpinner';
import { v4 as uuidv4 } from 'uuid';
import ProjectManager from "../backend/ProjectManager";
import fs from "fs";
import DMXProject from "../backend/structs/DMXProject";
import HID from "node-hid";
import {useRouter} from "next/dist/client/router";

type AppControlHandlerProps = {
	projectManager: ProjectManager;
	setProjectManager: Dispatch<SetStateAction<ProjectManager>>
	addNotification: (element: NotificationCenterElement) => void;
	sendDMXCommand: (start_channel: number, channel: number, value: number) => void;
	saveProject:  (_project: DMXProject) => void;
};

interface NotificationCenterElement {
	uid: string;
	text: string;
	status: NotificationCenterElementStatus;
	dismissAt?: number;
}

enum NotificationCenterElementStatus {
	loading,
	notification,
	error,
	success,
}

export const AppControlContext = createContext<AppControlHandlerProps>(null);

const AppControlProvider = ({ children }) => {
	const [notificationCenter, setNotificationCenter] = useState<
		NotificationCenterElement[]
	>([]);

	const router = useRouter();

	var notificationcenterInterval: NodeJS.Timeout;
	var autosaveInterval: NodeJS.Timeout;

	const [projectManager, setProjectManager] = useState<ProjectManager>(new ProjectManager());

	useEffect(() => {
		clearInterval(notificationcenterInterval);
		clearInterval(autosaveInterval);
		notificationcenterInterval = setInterval(() => {
			/*const newNotificationArray = notificationCenter.filter(
				(e) => e.dismissAt === undefined || e.dismissAt > Date.now()
			);*/
			setNotificationCenter((e) => [
				...e.filter(
					(f) => f.dismissAt === undefined || f.dismissAt > Date.now()
				),
			]);
		}, 1000);

		autosaveInterval = setInterval(() => {
			if (typeof projectManager.currentProject?.uid === "string") {
				saveProject(projectManager.currentProject)

			}

		}, 20000);

		ipcRenderer.on("shortcut::save-project", () => {
			if (typeof projectManager.currentProject?.uid === "string") {
				saveProject(projectManager.currentProject);
			}
		});

		ipcRenderer.on("shortcut::open-new-device", () => {
			if (typeof projectManager.currentProject?.uid === "string") {
				router.push("/projectmanagement/addDevice");
			}
		});

		ipcRenderer.on("shortcut::open-settings", () => {
			if (typeof projectManager.currentProject?.uid === "string") {
				router.push("/settings");
			}
		});

		ipcRenderer.on('show-error', (event, error) => {
			console.log('received noti');
			const notification: NotificationCenterElement = {
				uid: uuidv4(),
				text: error,
				status: NotificationCenterElementStatus.error,
				dismissAt: Date.now() + 3000,
			};
			addElementToNotificationCenter(notification);
		});


	}, []);

	function addElementToNotificationCenter(element: NotificationCenterElement) {
		setNotificationCenter((e) => [...e, element]);
	}

	function updateElementInNotificationCenter(
		element: NotificationCenterElement
	) {
		setNotificationCenter((e) => {
			const index = e.findIndex((f) => f.uid === element.uid);
			if (index > -1) e[index] = element;
			return e;
		});
	}

	function sendDMXCommand(start_channel: number, channel: number, value: number) {
		if (projectManager.interface !== undefined) {
			projectManager.interface.sendDMX(start_channel + channel - 1, value);
		}
		setProjectManager((e) => {
			e.currentProject.devices.find((device) => device.start_channel === start_channel).channel_state.find((state) => state.channel === channel).value = value;
			return e;
		})
	}

	function saveProject(_project: DMXProject) {
		const notificationElement: NotificationCenterElement = {
			uid: uuidv4(),
			text: 'Saving project',
			status: NotificationCenterElementStatus.loading,
		};
		addElementToNotificationCenter(notificationElement);


		try {

			const project = new DMXProject(_project, false)

			// update the modified date
			project.last_modified = Date.now();

			// replace device variables with uuid of device definition file
			project.devices.forEach((device) => {
				if (typeof device.device !== "string") {
					const devicecopy = { ...device.device };
					device.device = devicecopy.uuid;
				}
			})

			// save the file
			fs.writeFileSync(projectManager.projectFilePath, JSON.stringify(project), { encoding: "utf-8"});

			const newNotificationElement: NotificationCenterElement = {
				uid: notificationElement.uid,
				text: 'Project saved!',
				dismissAt: Date.now() + 3000,
				status: NotificationCenterElementStatus.success,
			};
			updateElementInNotificationCenter(newNotificationElement);

		}
		catch(err) {
			const newNotificationElement: NotificationCenterElement = {
				uid: notificationElement.uid,
				text: err.message ?? "Project couldn't be saved",
				status: NotificationCenterElementStatus.error,
				dismissAt: Date.now() + 3000
			}
			updateElementInNotificationCenter(newNotificationElement)
		}
	}

	const state: AppControlHandlerProps = {
		projectManager: projectManager,
		setProjectManager: setProjectManager,
		addNotification: addElementToNotificationCenter,
		sendDMXCommand: sendDMXCommand,
		saveProject: saveProject
	}

	return (
		<div>
			<div
				className={`flex flex-col dark:bg-gray-900 bg-gray-100 h-screen w-screen overflow-hidden dark:text-white`}
			>
				<div className="absolute bottom-6 right-6 flex z-10 text-white flex-col">
					{notificationCenter.map((notification) => (
						<div
							key={notification.uid}
							className={`m-4 flex flex-row p-3 rounded-lg w-64 justify-between pl-4 ${
								notification.status === NotificationCenterElementStatus.error
									? 'bg-red-500'
									: `${
											notification.status ===
											NotificationCenterElementStatus.success
												? 'bg-green-400'
												: 'bg-gray-400 dark:bg-gray-600'
									  }`
							}`}
						>
							<p>{notification.text}</p>
							{notification.status ===
							NotificationCenterElementStatus.loading ? (
								<div className="w-5 ml-4 mr-2">
									<LoadingSpinner color="#ffffff" size={'25'} />
								</div>
							) : (
								<div></div>
							)}
						</div>
					))}
				</div>
				<AppControlContext.Provider value={state}>
					{children}
				</AppControlContext.Provider>
			</div>
		</div>
	);
};
export type {NotificationCenterElement};
export { NotificationCenterElementStatus };
export default AppControlProvider;
