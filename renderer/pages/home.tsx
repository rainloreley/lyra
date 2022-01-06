import React, {useContext} from 'react';
import Head from 'next/head';
import { ipcRenderer } from 'electron';
import {
	AppControlContext,
	NotificationCenterElement,
	NotificationCenterElementStatus
} from "../components/appContextProvider";
import {v4 as uuidv4} from "uuid";
import {useRouter} from "next/router";
import DMXProject from "../backend/structs/DMXProject";
import fs from "fs";
import dmxDevices from "../devices/devicelist";

function Home() {

	const { setProjectManager, addNotification } = useContext(AppControlContext);
	const router = useRouter();

	ipcRenderer?.on("app::project-file-loaded", (event, data) => {
		try {
			const fileResult = fs.readFileSync(data, {encoding: "utf-8"});
			parseFile(data, fileResult)
		}
		catch(err) {
			const notification: NotificationCenterElement = {
				uid: uuidv4(),
				text: err.message,
				status: NotificationCenterElementStatus.error,
				dismissAt: Date.now() + 3000
			}
			addNotification(notification)
		}
	})

	const parseFile = (path: string, data: string) => {
		try {
			const jsondata = JSON.parse(data);
			for (var i = 0; i < jsondata.devices.length; i++) {
				const device = jsondata.devices[i];
				if (typeof device.device === "string") {
					const deviceConfig = dmxDevices.findIndex((e) => e.uuid === device.device);
					if (deviceConfig === -1 || deviceConfig === undefined) {
						console.error(`ERROR: Project cannot be loaded because the config file for ${device.name} is missing (id ${device.device})`)
						throw `Project cannot be loaded because the config file for ${device.name} is missing`
						return;
					}
				}
			}
			const project = new DMXProject(jsondata);
			setProjectManager((e) => {
				e.projectFilePath = path
				e.currentProject = project
				return e;
			})
			router.push("/dashboard");
		}
		catch(err) {
			// error :(
			const notification: NotificationCenterElement = {
				uid: uuidv4(),
				text: err.message || err,
				status: NotificationCenterElementStatus.error,
				dismissAt: Date.now() + 3000
			}
			addNotification(notification)
		}
	}


	return (
		<React.Fragment>
			<Head>
				<title>Lyra</title>
			</Head>

			<div className="overflow-hidden w-screen text-black h-screen">
				<div
					className={`flex justify-center items-center dark:bg-gray-900 bg-gray-100 h-screen w-screen overflow-hidden dark:text-white`}
				>
					<div className={"flex flex-col text-center"}>
						<h1 className={"font-bold text-4xl"}>Lyra</h1>
						<p className={"mt-1 italic"}>DMX Control Software</p>
						<button
							className="bg-blue-500 rounded-xl mt-2 text-white p-2 align-middle"
							onClick={async () => {
								//openFileHandler()
								await ipcRenderer.send("app::open-file")
							}}
						>
							Open File
						</button>

						<button className={"bg-blue-500 rounded-xl mt-2 text-white p-2 align-middle"} onClick={() => {
							router.push("/projectmanagement/new")
						}}>New Project</button>
					</div>





				</div>
			</div>
		</React.Fragment>
	);
}

export default Home;
