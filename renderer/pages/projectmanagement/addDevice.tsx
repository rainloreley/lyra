import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useContext, useEffect, useState } from 'react';
//import { GlobalInterfaceServer, GlobalProjectManager } from '..';
import {
	DMXProjectDevice,
	DMXProjectDeviceChannelState,
} from '../../backend/structs/DMXProjectDevice';
import dmxDevices from '../../devices/devicelist';
import { DeviceDefinition } from '../../devices/device_definitions';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles/AddDevicePage.module.css';
import { AppControlContext } from '../../components/appContextProvider';

const AddDevicePage: NextPage = () => {
	const router = useRouter();

	const [patchMap, setPatchMap] = useState<PatchMapChannel[]>([]);
	const [selectedNewDeviceDefinition, setSelectedNewDeviceDefinition] =
		useState<DeviceDefinition | null>(null);

	const [newDeviceName, setNewDeviceName] = useState('');
	const [newDeviceStartingChannel, setNewDeviceStartingChannel] = useState('1');
	const [newDeviceDMXMode, setNewDeviceDMXMode] = useState(0);
	const [dmxModeDropdownToggled, setDmxModeDropdownToggled] = useState(false);

	const [newDeviceCount, setNewDeviceCount] = useState('1');
	const [error, setError] = useState('');
	const [deviceListFilter, setDeviceListFilter] = useState('');

	const [skipAllowed, setSkipAllowed] = useState(false);
	const [hideBackButton, setHideBackButton] = useState(false);

	const { projectManager, setProjectManager, saveProject } =
		useContext(AppControlContext);

	useEffect(() => {
		if (!router.isReady) return;
		setSkipAllowed(router.query.skipAllowed === 'true');
		setHideBackButton(router.query.hideBackButton === 'true');
		if (projectManager.currentProject === undefined) {
			router.push(`/?returnto=${router.pathname}`);
			return;
		}

		setPatchMap((e) => {
			e = [];
			for (var i = 1; i <= 512; i++) {
				e.push({
					channel: i,
					devices: [],
				});
			}
			return e;
		});

		projectManager.currentProject?.devices.map((device) => {
			const channel_count = (device.device as DeviceDefinition).modes.find(
				(mode) => mode.id === device.mode
			)?.channel_count!;
			setPatchMap((e) => {
				for (
					var i = device.start_channel;
					i < device.start_channel + channel_count;
					i++
				) {
					if (e[i - 1].devices.findIndex((f) => f.id === device.id) === -1) {
						e[i - 1].devices.push({
							id: device.id,
							name: device.name,
						});
					}
				}
				return e;
			});
		});
	}, [router.isReady]);

	const updateNewDeviceStartingChannel = (
		channel: number,
		device: DeviceDefinition,
		name: string,
		dmxmode: number,
		devicecount: number
	) => {
		if (
			devicecount *
				device.modes.find((e) => e.id === dmxmode)?.channel_count! <=
				513 - channel &&
			channel <=
				513 -
					device.modes.find((e) => e.id === dmxmode)?.channel_count! *
						devicecount
		) {
			setPatchMap((e) => {
				for (var i = 0; i < e.length; i++) {
					const index = e[i].devices.findIndex((f) => f.id === '__newdevice');
					if (index !== -1) {
						e[i].devices.splice(index, 1);
					}
				}

				for (
					var i = parseInt(newDeviceStartingChannel);
					i <
					parseInt(newDeviceStartingChannel) +
						device?.modes.find((e) => e.id === dmxmode)?.channel_count! *
							devicecount;
					i++
				) {
					const index = e[i - 1].devices.findIndex(
						(e) => e.id === '__newdevice'
					);
					if (index !== -1) {
						e[i - 1].devices.splice(index, 1);
					}
				}

				for (
					var i = channel;
					i <
					channel +
						device?.modes.find((e) => e.id === dmxmode)?.channel_count! *
							devicecount;
					i++
				) {
					if (
						e[i - 1].devices.findIndex((f) => f.id === '__newdevice') === -1
					) {
						e[i - 1].devices.push({
							id: '__newdevice',
							name: name,
						});
					}
				}

				return e;
			});
			setNewDeviceStartingChannel(channel.toString());
			setNewDeviceCount(devicecount.toString());
		}
	};

	const saveDevices = async () => {
		setError('');
		return new Promise(async (resolve, reject) => {
			if (newDeviceName === '') {
				setError('Please enter a name for the device');
				reject('');
				return;
			}
			if (selectedNewDeviceDefinition === null) {
				setError('Please select a device');
				reject('');
				return;
			}
			if (
				newDeviceStartingChannel === '' ||
				isNaN(parseInt(newDeviceStartingChannel))
			) {
				setError('Please select a starting channel');
				reject('');
				return;
			}
			if (newDeviceCount === '' || isNaN(parseInt(newDeviceCount))) {
				setError('Please select a device count');
				reject('');
				return;
			}

			// loop through all devices
			for (var i = 0; i < parseInt(newDeviceCount); i++) {
				const starting_channel =
					parseInt(newDeviceStartingChannel) +
					selectedNewDeviceDefinition.modes.find(
						(e) => e.id === newDeviceDMXMode
					)!.channel_count *
						i;
				var channel_state: DMXProjectDeviceChannelState[] = [];
				for (
					var j = 1;
					j <=
					selectedNewDeviceDefinition!.modes.find(
						(e) => e.id === newDeviceDMXMode
					)!.channel_count;
					j++
				) {
					channel_state.push({
						channel: j,
						value: 0,
					});
				}
				const newDMXProjectDevice: DMXProjectDevice = {
					id: uuidv4(),
					name: `${newDeviceName}${
						parseInt(newDeviceCount) > 1 ? ` ${i + 1}` : ''
					}`,
					device: selectedNewDeviceDefinition!,
					start_channel: starting_channel,
					mode: newDeviceDMXMode,
					channel_state: channel_state,
				};
				setProjectManager((e) => {
					e.currentProject?.devices.push(newDMXProjectDevice);
					saveProject(e.currentProject);
					return e;
				});
			}

			resolve('');
		});
	};

	return (
		<div className="h-screen w-screen bg-gray-100 dark:bg-gray-900 flex flex-row text-black">
			<div
				className={`w-1/2 h-full relative flex flex-col ${styles.addDeviceView}`}
			>
				<div className="m-8">
					{!hideBackButton ? (
						<button
							className="dark:bg-gray-400 bg-gray-300 rounded-full w-6 h-6"
							onClick={() => {
								router.back();
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-6 flex-no-shrink fill-current"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="gray"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
					) : (
						<div />
					)}
					<h1 className="text-white text-3xl font-bold">Add Device</h1>
				</div>
				<div
					className={`flex flex-col h-full justify-between overflow-y-scroll mb-2 ${styles.noscrollbar}`}
				>
					<div className="mx-8">
						<h2 className="text-white text-lg">Device List</h2>
						<div className="bg-gray-300 p-2 w-full rounded-lg flex flex-col items-center shadow-xl">
							<input
								className="p-1 text-center w-9/12 mt-2 border rounded-xl bg-gray-200 border-gray-300"
								placeholder="Device name"
								value={deviceListFilter}
								onChange={(e) => {
									setDeviceListFilter(e.target.value);
								}}
							/>
							<ul className="border w-full mt-2 bg-gray-200 border-gray-300 rounded-lg">
								{dmxDevices
									.filter(
										(e) =>
											e.device_name
												.toLowerCase()
												.includes(deviceListFilter.toLowerCase()) ||
											e.vendor
												.toLowerCase()
												.includes(deviceListFilter.toLowerCase())
									)
									.map((device, index) => (
										<button
											key={device.uuid}
											className="w-full text-left hover:bg-gray-100"
											onClick={(e) => {
												setNewDeviceName(device.device_name);
												setNewDeviceDMXMode(0);
												setNewDeviceStartingChannel('1');
												setSelectedNewDeviceDefinition(device);
												updateNewDeviceStartingChannel(
													1,
													device,
													device.device_name,
													0,
													parseInt(newDeviceCount)
												);
											}}
										>
											<div
												className={`${
													index < dmxDevices.length - 1
														? 'border-b border-gray-500'
														: ''
												} p-2 `}
											>
												<p className="text-gray-500 text-sm">{device.vendor}</p>
												<p>{device.device_name}</p>
												<p className="text-gray-500 text-sm italic">
													{device.modes.map(
														(e, i) =>
															`${e.channel_count} Channel ${
																i < device.modes.length - 1 ? '// ' : ''
															}`
													)}
												</p>
											</div>
										</button>
									))}
							</ul>
						</div>
						{selectedNewDeviceDefinition !== null ? (
							<div className="mt-8 ">
								<h2 className="text-2xl text-white font-bold mb-4">
									New Device
								</h2>
								<div className="m-1">
									<p className="text-white">Name:</p>
									<input
										className="bg-gray-200 rounded p-1 border border-gray-300 mt-1"
										placeholder="New Device"
										value={newDeviceName}
										onChange={(e) => {
											setNewDeviceName(e.target.value);
											updateNewDeviceStartingChannel(
												parseInt(newDeviceStartingChannel),
												selectedNewDeviceDefinition,
												e.target.value === '' ? 'New Device' : e.target.value,
												newDeviceDMXMode,
												parseInt(newDeviceCount)
											);
										}}
									/>
									<div className="mt-4">
										<p className="text-white">Starting channel:</p>
										<input
											value={newDeviceStartingChannel}
											className="bg-gray-200 rounded p-1 border border-gray-300"
											onChange={(e) => {
												var value = e.target.value;
												if (value === '') {
													setNewDeviceStartingChannel(value);
												} else if (
													!isNaN(parseInt(value)) &&
													parseInt(value) > 0 &&
													parseInt(value) <=
														513 -
															selectedNewDeviceDefinition.modes.find(
																(e) => e.id === newDeviceDMXMode
															)?.channel_count! *
																parseInt(newDeviceCount)
												) {
													updateNewDeviceStartingChannel(
														parseInt(value),
														selectedNewDeviceDefinition,
														newDeviceName,
														newDeviceDMXMode,
														parseInt(newDeviceCount)
													);
												}
											}}
										/>
									</div>
									<div className="mt-4">
										<p className="text-white">DMX mode:</p>
										<div className="relative inline-block text-left">
											<div>
												<button
													type="button"
													onClick={(e) => {
														setDmxModeDropdownToggled(!dmxModeDropdownToggled);
													}}
													className="inline-flex justify-center w-full rounded-md border shadow-sm px-4 py-2 bg-gray-200 text-sm font-medium  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-indigo-500"
													id="menu-button"
													aria-expanded="true"
													aria-haspopup="true"
												>
													{
														selectedNewDeviceDefinition.modes.find(
															(e) => e.id === newDeviceDMXMode
														)?.name
													}
													<svg
														className="-mr-1 ml-2 h-5 w-5"
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
													>
														<path
															fill-rule="evenodd"
															d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
															clipRule="evenodd"
														/>
													</svg>
												</button>
											</div>

											<div
												className={`origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none ${
													dmxModeDropdownToggled
														? 'transition ease-out duration-100 transform opacity-100 scale-100'
														: 'transition ease-in duration-75 transform opacity-0 scale-0'
												} z-10`}
												role="menu"
												aria-orientation="vertical"
												aria-labelledby="menu-button"
											>
												<div className="py-1" role="none">
													{selectedNewDeviceDefinition.modes.map((mode) => (
														<button
															className="block w-full text-left px-4 py-2 text-sm"
															role="menuitem"
															onClick={(btn) => {
																setDmxModeDropdownToggled(
																	!dmxModeDropdownToggled
																);
																setNewDeviceDMXMode(mode.id);
																updateNewDeviceStartingChannel(
																	parseInt(newDeviceStartingChannel),
																	selectedNewDeviceDefinition,
																	newDeviceName,
																	mode.id,
																	parseInt(newDeviceCount)
																);
															}}
														>
															{mode.name}
														</button>
													))}
												</div>
											</div>
										</div>
									</div>
									<div className="mt-4">
										<p className="text-white">Amount:</p>
										<input
											className="bg-gray-200 rounded p-1 border border-gray-300"
											value={newDeviceCount}
											onChange={(e) => {
												var value = e.target.value;
												if (value === '') {
													setNewDeviceCount(value);
												} else if (
													!isNaN(parseInt(value)) &&
													parseInt(value) > 0 &&
													parseInt(value) *
														selectedNewDeviceDefinition.modes.find(
															(e) => e.id === newDeviceDMXMode
														)?.channel_count! <=
														513 - parseInt(newDeviceStartingChannel)
												) {
													updateNewDeviceStartingChannel(
														parseInt(newDeviceStartingChannel),
														selectedNewDeviceDefinition,
														newDeviceName,
														newDeviceDMXMode,
														parseInt(value)
													);
												}
											}}
										/>
									</div>
									<div className="mt-4">
										<button
											className="p-2 px-4 bg-blue-500 rounded-xl text-white hover:bg-blue-600"
											onClick={async () => {
												saveDevices()
													.then((_) => {
														router.push('/');
														return;
													})
													.catch((e) => {
														return;
													});
											}}
										>
											Save
										</button>
									</div>
									{error !== '' ? (
										<p className="mt-4 ml-2 text-red-500">{error}</p>
									) : (
										<div></div>
									)}
								</div>
							</div>
						) : (
							<div></div>
						)}
					</div>
					{skipAllowed ? (
						<div className="m-8">
							<button
								className="bg-gray-300 p-2 px-6 text-MD rounded-xl hover:bg-gray-400"
								onClick={(e) => {
									router.push('/');
								}}
							>
								Skip
							</button>
						</div>
					) : (
						<div />
					)}
				</div>
			</div>
			<div className={` ${styles.wave}`} />
			<div
				className={`bg-white w-1/2 h-screen flex flex-col ${styles.patchMapView}`}
			>
				<div className="m-8">
					<h1 className="text-3xl dark:text-white font-bold">Patch map</h1>
				</div>
				<div className={`${styles.patchgrid} ${styles.noscrollbar}`}>
					{patchMap.map((channel, index) => (
						<div
							className={`w-20 border bg-gray-200 border-gray-300 dark:border-gray-600 dark:bg-gray-700 flex flex-col items-center ${
								channel.devices.length === 0 ? 'h-20' : ''
							}`}
						>
							<p className="text-xs dark:text-white font-bold mt-1">
								{channel.channel}
							</p>
							{channel.devices.map((device) => (
								<div
									className={`rounded w-3/4 my-1 p-0.5 ${
										device.id === '__newdevice' ? 'bg-gray-400' : 'bg-blue-500'
									}`}
								>
									<p className="text-xs text-center text-white mx-0.5">
										{device.name}
									</p>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

interface PatchMapChannel {
	channel: number;
	devices: PatchMapChannelDevice[];
}

interface PatchMapChannelDevice {
	id: string;
	name: string;
}

export default AddDevicePage;

//grid rounded-xl dark:bg-gray-700 grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 w-auto h-full overflow-y-scroll overflow-x-hidden m-4 gap-0
