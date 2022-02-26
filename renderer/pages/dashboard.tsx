import { NextPage } from 'next';
import React, { useContext, useEffect, useState } from 'react';
import { Head } from 'next/document';
import { useRouter } from 'next/router';
import { AppControlContext } from '../components/appContextProvider';
import { DMXProjectDevice } from '../backend/structs/DMXProjectDevice';
import { DeviceDefinition } from '../devices/device_definitions';
import styles from '../styles/Dashboard.module.css';
import DashboardSidebar from '../components/dashboard_sidebar';
import FX5Interface from '../backend/Interface/DMXI_FX5';
import HID, { devices } from 'node-hid';
import { AlertTriangle, List, Settings } from 'react-feather';
import { get as getCookie } from 'es-cookie';
import { store } from 'next/dist/build/output/store';
import SceneList from '../components/dashboard/SceneList';
const Dashboard: NextPage = () => {
	const router = useRouter();
	const [selectedDevices, setSelectedDevices] = useState<DMXProjectDevice[] | null>(
		[]
	);

	const [showSceneList, setShowSceneList] = useState<boolean>(false);

	const { projectManager } = useContext(AppControlContext);

	useEffect(() => {
		if (!projectManager.currentProject) {
			router.push("/")
		}
		enableStoredInterface();
	}, []);

	const enableStoredInterface = async () => {
		if (projectManager.interface === undefined) {
			const storedInterfaceDataString = getCookie('dmxInterface');
			if (storedInterfaceDataString) {
				const storedInterfaceData = JSON.parse(storedInterfaceDataString);
				if (storedInterfaceData.type === 'fx5') {
					const availableInterfaces = await FX5Interface.findInterfaces();
					const interfaceBySerial = availableInterfaces.find(
						(e) => e.serial === storedInterfaceData.serial
					);
					if (interfaceBySerial) {
						try {
							projectManager.interface = new FX5Interface(interfaceBySerial.id);
							const openResult = await projectManager.interface.openLink();
							const modeResult = await (
								projectManager.interface as FX5Interface
							).setDMXMode(storedInterfaceData.mode);
							if (modeResult) {
								(projectManager.interface as FX5Interface).dmxMode =
									storedInterfaceData.mode;
							}
						} catch {
							console.error('Something went wrong while opening the interface');
						}
					}
				} else {
					console.error('Interface not supported!');
				}
			}
		}
	};

	return (
		<div className="overflow-hidden w-screen text-black h-screen">
			<div
				className={`flex flex-col dark:bg-gray-900 bg-gray-100 h-screen w-screen overflow-hidden dark:text-white`}
			>
				<div className="flex dark:bg-gray-800 bg-gray-200 h-16  border-b-2 border-gray-300 dark:border-gray-800 justify-between shadow-lg rounded-xl m-2">
					<div className={'flex'}>
						<h1 className="self-center dark:text-white ml-4 text-2xl font-bold">
							{projectManager.currentProject?.name || 'DMX'}
						</h1>
						{projectManager.interface === undefined ? (
							<div className={'flex mx-4'}>
								<AlertTriangle
									fill={'#ff0000'}
									size={18}
									className={'self-center'}
								/>
								<p
									className={
										'text-red-500 ml-2 text-sm font-semibold italic self-center'
									}
								>
									No Interface enabled
								</p>
							</div>
						) : (
							<div />
						)}
					</div>
				</div>
				<div
					className={
						'flex dark:bg-gray-800 bg-gray-200 h-16 border-b-2 border-gray-300 dark:border-gray-800 justify-between shadow-lg rounded-xl mx-2'
					}
				>
					<div
						className={'flex justify-between w-full px-3 items-center h-full'}
					>
						<div />
						<div className={"flex"}>
							<div className={'flex mx-1'}>
								<button
									className={'h-6 w-6'}
									onClick={() => {
										setShowSceneList(true);
									}}
								>
									<List />
								</button>
							</div>
							<div className={'flex mx-1'}>
								<button
									className={'h-6 w-6'}
									onClick={() => {
										router.push('/settings');
									}}
								>
									<Settings />
								</button>
							</div>
						</div>
					</div>
				</div>
				<div id="canvas" className="flex flex-row w-full h-full relative overflow-y-hidden">
					{selectedDevices.length > 0 ? (
						<DashboardSidebar
							selectedDevices={selectedDevices}
							setSelectedDevices={setSelectedDevices}
						/>
					) : (
						<div></div>
					)}
					<div id="device-canvas" className={styles.devicegrid}>
						{projectManager.currentProject?.devices.length > 0 ? (
							<div className={'m-2'}>
								{projectManager.currentProject?.devices.map((e) => (
									<button
										key={e.start_channel}
										className={`dark:text-white justify-self-center self-center m-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl ${selectedDevices.filter((_filter) => _filter.id === e.id).length > 0 ? "border border-yellow-300" : ""}`}
										onClick={(clickEvent) => {
											console.log(clickEvent.metaKey);

											// check if command key is pressed
											if (clickEvent.metaKey) {
												// if so, add selected device to list of all selected devices
												if (selectedDevices.length > 0 &&
													((selectedDevices[0].device as DeviceDefinition).uuid !== (e.device as DeviceDefinition).uuid || e.mode !== selectedDevices[0].mode)) {
													return;
												}
												const existingIndex = selectedDevices.findIndex((device => device.id === e.id))
												if (existingIndex > -1) {
													setSelectedDevices((devices) => {
														devices.splice(existingIndex, 1);
														return devices;
													})
												}
												else {
													setSelectedDevices((devices) => {
														devices.push(e);
														return devices;
													})
												}
											}
											else {
												// if not, make the selected device the only one
												setSelectedDevices([e]);
											}
										}}
									>
										<div>
											{typeof (e.device as DeviceDefinition).image ===
											'string' ? (
												<div className="flex justify-center">
													<img
														src={(e.device as DeviceDefinition).image}
														alt={`Image of ${
															(e.device as DeviceDefinition).device_name
														}`}
														width={'40px'}
														height={'40px'}
													/>
												</div>
											) : (
												<div />
											)}
											<p className="font-bold text-md">{e.name}</p>
										</div>
									</button>
								))}
							</div>
						) : (
							<div className={'h-full w-full items-center justify-center flex'}>
								<div className={'flex flex-col items-center text-center'}>
									<h1 className={"text-lg"}>No devices</h1>
									<button className={"underline text-blue-500"} onClick={() => {
										router.push("/projectmanagement/addDevice")
									}}>Try adding one!</button>
								</div>
							</div>
						)}
					</div>
					{showSceneList ? (
						<SceneList
							closeView={() => {
								setShowSceneList(false);
							}}
						/>
					) : (
						<div />
					)}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
