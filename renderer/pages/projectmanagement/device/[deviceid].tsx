import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useContext, useEffect, useState } from 'react';
//import { GlobalProjectManager } from '../..';
import { DMXProjectDevice } from '../../../backend/structs/DMXProjectDevice';
import { AppControlContext } from '../../../components/appContextProvider';
import DMXBinaryDisplay from '../../../components/dmxBinaryDisplay';
import LoadingSpinner from '../../../components/loadingSpinner';

const DeviceConfigPage: NextPage = () => {
	const router = useRouter();
	var deviceId = router.query.deviceid as string;

	const [deviceInfo, setDeviceInfo] = useState<DMXProjectDevice | null>(null);

	const [deviceName, setDeviceName] = useState('');
	const [deviceStatingChannel, setDeviceStatingChannel] = useState('1');
	const [deviceStartingChannelInteger, setDeviceStartingChannelInteger] =
		useState(1);
	const [error, setError] = useState('');
	const [savingDevice, setSavingDevice] = useState(false);
	const { projectManager, setProjectManager, saveProject } = useContext(AppControlContext);

	useEffect(() => {
		if (!router.isReady) return;
		deviceId = router.query.deviceid as string;
		if (
			projectManager.currentProject === undefined
		) {
			router.push(`/?returnto=/projectmanagement/device/${deviceId}`);
			return;
		} else {
			const device = projectManager.currentProject?.devices.find(
				(e) => e.id === deviceId
			);
			if (device === undefined) {
				router.push('/');
			} else {
				initializeDeviceVariables(device!);
			}
		}
	}, [router.isReady]);

	const initializeDeviceVariables = (device: DMXProjectDevice) => {
		setDeviceName(device.name);
		setDeviceStatingChannel(device.start_channel.toString());
		setDeviceStartingChannelInteger(device.start_channel);
		setDeviceInfo(device);
	};

	const setDeviceStatingChannelByString = (channel: string) => {
		if (channel === '') {
			setDeviceStatingChannel(channel);
		} else {
			if (!isNaN(parseInt(channel))) {
				const number = parseInt(channel);
				if (number > 0 && number < 513) {
					setDeviceStartingChannelInteger(number);
					setDeviceStatingChannel(channel);
				}
			}
		}
	};

	const saveDevice = () => {
		setError('');
		setSavingDevice(true);
		if (
			deviceStartingChannelInteger > 0 &&
			deviceStartingChannelInteger < 513 &&
			deviceName !== ''
		) {
			var deviceInfoCopy = { ...deviceInfo! };
			deviceInfoCopy.start_channel = deviceStartingChannelInteger;
			deviceInfoCopy.name = deviceName;
			const index = projectManager.currentProject!.devices.findIndex(
				(e) => e.id === deviceId
			);
			if (index !== -1) {


				setProjectManager((e) => {
					// remove device
					e.currentProject?.devices.splice(index, 1);
					e.currentProject?.devices.push(deviceInfoCopy);
					saveProject(e.currentProject);
					return e;
				})


				setSavingDevice(false);
				router.back();
			} else {
				setSavingDevice(false);
				setError('Device not found');
			}
		} else {
			setError('Please fill in all fields');
			setSavingDevice(false);
			return;
		}
	};

	return (
		<div className="bg-gray-100 dark:bg-gray-900 h-screen w-screen flex">
			{deviceInfo === null ? (
				<div className="w-full h-full justify-center">
					<p className="self-center text-center text-3xl font-bold">
						Loading...
					</p>
				</div>
			) : (
				<div className="m-8">
					<div>
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
						<p className="text-md text-gray-500 dark:text-gray-400">
							MODIFY DEVICE
						</p>
						<input
							value={deviceName}
							placeholder="New device"
							className="p-1 bg-gray-200 font-bold text-xl rounded-xl border border-gray-300 dark:text-white dark:bg-gray-700 dark:border-gray-600"
							onChange={(e) => {
								setDeviceName(e.target.value);
							}}
						/>
					</div>
					<div className="mt-4">
						<h2 className="dark:text-white">DMX Channel</h2>
						<input
							value={deviceStatingChannel}
							placeholder="DMX Channel"
							className="p-1 bg-gray-200 rounded-xl border border-gray-300 dark:text-white dark:bg-gray-700 dark:border-gray-600"
							onChange={(e) => {
								setDeviceStatingChannelByString(e.target.value);
							}}
						/>
						<div className="mt-4">
							<DMXBinaryDisplay channel={deviceStartingChannelInteger} />
						</div>
						<div className="mt-8">
							{savingDevice ? (
								<div className="ml-4">
									<LoadingSpinner color="#0000ff" size={'38'} />
								</div>
							) : (
								<button
									className="p-2 px-4 bg-blue-500 rounded-xl text-white"
									onClick={() => {
										saveDevice();
									}}
								>
									Save device
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DeviceConfigPage;
