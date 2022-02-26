import { useRouter } from 'next/dist/client/router';
import { FunctionComponent, useContext } from 'react';
import {
	DMXProjectDevice,
	DMXProjectDeviceChannelState,
} from '../backend/structs/DMXProjectDevice';
import {
	DDMUICCButtonSettingsSpecialFunction,
	DDMUICCColorPickerSettings,
	DeviceDefinition,
	DeviceDefinitionMode,
	DeviceDefinitionModeUIChannel,
} from '../devices/device_definitions';
import { AppControlContext } from './appContextProvider';
//import { GlobalProjectManager } from '../pages';
import DeviceButton from './device_components/button';
import DeviceColorWheel from './device_components/colorwheel';
import DeviceDropdown from './device_components/dropdown';
import DeviceJoystick, {
	Device_Joystick_Axis,
} from './device_components/joystick';
import DeviceSlider from './device_components/slider';
import SettingsIcon from './icons/settings';
import styles from '../styles/Dashboard_Sidebar.module.css';
import CloseButton from './small/close_button';
import DeviceColorPicker from './device_components/colorpicker';

interface Dashboard_Sidebar {
	selectedDevices: DMXProjectDevice[];
	setSelectedDevices: (device: DMXProjectDevice[] | null) => void;
}

const DashboardSidebar: FunctionComponent<Dashboard_Sidebar> = ({
	selectedDevices,
	setSelectedDevices,
}) => {
	const router = useRouter();

	const { projectManager, sendDMXCommand } = useContext(AppControlContext);

	const _sendDMXForAllDevices = (channel: number, value: number) => {
		for (var device of selectedDevices) {
			sendDMXCommand(device.start_channel, channel, value);
		}
	}

	return (
		<div className="pb-4 my-2 mx-2 flex">
			<div className="dark:bg-gray-800 bg-gray-200 p-4 shadow-2xl rounded-2xl flex flex-col w-80 bottom-4">
				<div className="flex justify-between items-center">
					<div className="flex mr-2">
						<h1 className="font-bold dark:text-white text-lg">
							{selectedDevices.length === 1 ? selectedDevices[0].name : "Multiple devices"}
						</h1>
						{selectedDevices.length === 1 ? (
							<button
								className="w-4 ml-2 flex"
								onClick={(e) => {
									router.push(`/projectmanagement/device/${selectedDevices[0].id}`);
								}}
							>
								<SettingsIcon />
							</button>
						) : <div />}
					</div>

					<CloseButton buttonPressed={() => setSelectedDevices([])} size={5} />
				</div>
				<p className="dark:text-gray-400 text-gray-500 text-xs">
					{(selectedDevices[0].device as DeviceDefinition).device_name}
				</p>
				<p className="dark:text-gray-400 text-gray-500 text-sm mb-2">
					{
						(selectedDevices[0].device as DeviceDefinition).modes.filter(
							(e: any) => e.id == selectedDevices[0].mode
						)[0].name
					}{' '}
					{selectedDevices.length === 1 ? `|| Channel ${selectedDevices[0].start_channel}` : ""}
				</p>

				<ul className={`overflow-y-scroll ${styles.noscrollbar} h-full`}>
					{(selectedDevices[0].device as DeviceDefinition).modes
						.filter((e: any) => e.id == selectedDevices[0].mode)[0]
						.ui_channels.map((channel: DeviceDefinitionModeUIChannel) => (
							<div key={channel.channel} className="mt-2">
								<h2 className="text-md font-semibold">{channel.name}</h2>
								<div className="mt-2">
									{
										// @ts-ignore
										{
											dropdown: (
												<DeviceDropdown
													options={channel.config.dropdown_options}
													valueupdate={(value: number) => {
														_sendDMXForAllDevices(parseInt(channel.channel), value);
														/*sendDMXCommand(
															selectedDevice.start_channel,
															parseInt(channel.channel),
															value
														);*/
													}}
													state={
														arrayNumberAverage(selectedDevices.map((device) => device.channel_state.filter((e: DMXProjectDeviceChannelState) =>
															e.channel == parseInt(channel.channel))[0].value))
														/*selectedDevice.channel_state.filter(
															(e: DMXProjectDeviceChannelState) =>
																e.channel == parseInt(channel.channel)
														)[0].value*/
													}
												/>
											),

											slider: (
												<DeviceSlider
													slider_settings={channel.config.slider_settings!}
													valueupdate={(value: number) => {
														_sendDMXForAllDevices(parseInt(channel.channel), value);
														/*sendDMXCommand(
															selectedDevice.start_channel,
															parseInt(channel.channel),
															value
														);*/
													}}
													state={
														arrayNumberAverage(selectedDevices.map((device) => device.channel_state.filter((e: DMXProjectDeviceChannelState) =>
															e.channel == parseInt(channel.channel))[0].value))
														/*selectedDevice.channel_state.filter(
															(e: DMXProjectDeviceChannelState) =>
																e.channel == parseInt(channel.channel)
														)[0].value*/
													}
												/>
											),
											'color-wheel': (
												<DeviceColorWheel
													subsets={channel.config.colorwheel_subsets!}
													valueupdate={(value: number) => {
														_sendDMXForAllDevices(parseInt(channel.channel), value);
														/*sendDMXCommand(
															selectedDevice.start_channel,
															parseInt(channel.channel),
															value
														);*/
													}}
													state={
														arrayNumberAverage(selectedDevices.map((device) => device.channel_state.filter((e: DMXProjectDeviceChannelState) =>
															e.channel == parseInt(channel.channel))[0].value))
														/*selectedDevice.channel_state.filter(
															(e: DMXProjectDeviceChannelState) =>
																e.channel == parseInt(channel.channel)
														)[0].value*/
													}
												/>
											),
											joystick: (
												<div>
													<DeviceJoystick
														valueupdate={(
															axis: Device_Joystick_Axis,
															value: number
														) => {
															const dmxChannelX: number =
																channel.config.joystick_axis!.x;
															const dmxChannelY: number =
																channel.config.joystick_axis!.y;

															/*sendDMXCommand(
																selectedDevice.start_channel,
																axis == Device_Joystick_Axis.X
																	? dmxChannelX
																	: dmxChannelY,
																value
															);*/

															_sendDMXForAllDevices(axis == Device_Joystick_Axis.X
																? dmxChannelX
																: dmxChannelY, value);
														}}
														state={selectedDevices[0].channel_state}
														axis={channel.config.joystick_axis!}
													/>
												</div>
											),
											/*button: (
												<DeviceButton
													button_settings={channel.config.button_settings!}
													valueupdate={(value: number) => {
														_sendDMXForAllDevices(parseInt(channel.channel), value);
														/*sendDMXCommand(
															selectedDevice.start_channel,
															parseInt(channel.channel),
															value
														);
													}}
													post_function={() => {
														switch (
															channel.config.button_settings!.special_function
														) {
															case DDMUICCButtonSettingsSpecialFunction.reset_all_values:
																(
																	(
																		selectedDevice.device as DeviceDefinition
																	).modes.filter(
																		(e: any) => e.id == selectedDevice.mode
																	)[0] as DeviceDefinitionMode
																).channels.forEach((e) => {
																	sendDMXCommand(
																		selectedDevice.start_channel,
																		e.channel,
																		0
																	);
																});
																projectManager.currentProject?.devices
																	.find(
																		(e) =>
																			e.start_channel ===
																			selectedDevice.start_channel
																	)
																	?.channel_state.forEach((e) => {
																		e.value = 0;
																	});
														}
													}}
												/>
											),*/
											colorpicker: (
												<DeviceColorPicker
													valueupdate={(
														red: number,
														green: number,
														blue: number
													) => {
														_sendDMXForAllDevices(channel.config.colorpicker_settings!.channel_red, red);
														_sendDMXForAllDevices(channel.config.colorpicker_settings!
															.channel_green, green);
														_sendDMXForAllDevices(channel.config.colorpicker_settings!.channel_blue, blue);
														/*sendDMXCommand(
															selectedDevice.start_channel,
															channel.config.colorpicker_settings!.channel_red,
															red
														);
														sendDMXCommand(
															selectedDevice.start_channel,
															channel.config.colorpicker_settings!
																.channel_green,
															green
														);
														sendDMXCommand(
															selectedDevice.start_channel,
															channel.config.colorpicker_settings!.channel_blue,
															blue
														);*/
													}}
													state={selectedDevices[0].channel_state}
													channels={channel.config.colorpicker_settings!}
												/>
											),
										}[channel.type] || <div>{channel.type}</div>
									}
								</div>
							</div>
						))}
				</ul>
			</div>
		</div>
	);
};
const arrayNumberAverage = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
export default DashboardSidebar;
