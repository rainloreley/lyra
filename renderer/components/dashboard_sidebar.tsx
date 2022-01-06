import { useRouter } from 'next/dist/client/router';
import { FunctionComponent, useContext } from 'react';
import {
    DMXProjectDevice,
    DMXProjectDeviceChannelState,
} from '../backend/structs/DMXProjectDevice';
import {
    DDMUICCButtonSettingsSpecialFunction, DDMUICCColorPickerSettings,
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
import CloseButton from "./small/close_button";
import DeviceColorPicker from "./device_components/colorpicker";

interface Dashboard_Sidebar {
    selectedDevice: DMXProjectDevice;
    setSelectedDevice: (device: DMXProjectDevice | null) => void;
}

const DashboardSidebar: FunctionComponent<Dashboard_Sidebar> = ({
                                                                    selectedDevice,
                                                                    setSelectedDevice,
                                                                }) => {
    const router = useRouter();

    const { projectManager, sendDMXCommand } =
        useContext(AppControlContext);

    return (
        <div className="pb-4 left-4 absolute bottom-4 top-4 flex">
            <div className="dark:bg-gray-800 bg-gray-200 p-4 shadow-2xl rounded-2xl flex flex-col w-80 bottom-4">
                <div className="flex justify-between items-center">
                    <div className="flex mr-2">
                        <h1 className="font-bold dark:text-white text-xl">
                            {selectedDevice.name}
                        </h1>
                        <button
                            className="w-4 ml-2 flex"
                            onClick={(e) => {
                                router.push(`/projectmanagement/device/${selectedDevice.id}`);
                            }}
                        >
                            <SettingsIcon />
                        </button>
                    </div>

                    <CloseButton buttonPressed={() => setSelectedDevice(null)} size={5} />
                </div>
                <p className="dark:text-gray-400 text-gray-500 text-sm mb-2">
                    {
                        (selectedDevice.device as DeviceDefinition).modes.filter(
                            (e: any) => e.id == selectedDevice.mode
                        )[0].name
                    }{' '}
                    || Channel {selectedDevice.start_channel}
                </p>

                <ul className={`overflow-y-scroll ${styles.noscrollbar} h-full`}>
                    {(selectedDevice.device as DeviceDefinition).modes
                        .filter((e: any) => e.id == selectedDevice.mode)[0]
                        .ui_channels.map((channel: DeviceDefinitionModeUIChannel) => (
                            <div key={channel.channel} className="mt-2">
                                <h2 className="text-lg font-semibold">{channel.name}</h2>
                                <div className="mt-2">
                                    {
                                        // @ts-ignore
                                        {
                                            dropdown: (
                                                <DeviceDropdown
                                                    options={channel.config.dropdown_options}
                                                    valueupdate={(value: number) => {
                                                        sendDMXCommand(
                                                            selectedDevice.start_channel,
                                                            parseInt(channel.channel),
                                                            value
                                                        );
                                                    }}
                                                    state={
                                                        selectedDevice.channel_state.filter(
                                                            (e: DMXProjectDeviceChannelState) =>
                                                                e.channel == parseInt(channel.channel)
                                                        )[0].value
                                                    }
                                                />
                                            ),

                                            slider: (
                                                <DeviceSlider
                                                    slider_settings={channel.config.slider_settings!}
                                                    valueupdate={(value: number) => {
                                                        sendDMXCommand(
                                                            selectedDevice.start_channel,
                                                            parseInt(channel.channel),
                                                            value
                                                        );
                                                    }}
                                                    state={
                                                        selectedDevice.channel_state.filter(
                                                            (e: DMXProjectDeviceChannelState) =>
                                                                e.channel == parseInt(channel.channel)
                                                        )[0].value
                                                    }
                                                />
                                            ),
                                            'color-wheel': (
                                                <DeviceColorWheel
                                                    subsets={channel.config.colorwheel_subsets!}
                                                    valueupdate={(value: number) => {
                                                        sendDMXCommand(
                                                            selectedDevice.start_channel,
                                                            parseInt(channel.channel),
                                                            value
                                                        );
                                                    }}
                                                    state={
                                                        selectedDevice.channel_state.filter(
                                                            (e: DMXProjectDeviceChannelState) =>
                                                                e.channel == parseInt(channel.channel)
                                                        )[0].value
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

                                                            sendDMXCommand(
                                                                selectedDevice.start_channel,
                                                                axis == Device_Joystick_Axis.X
                                                                    ? dmxChannelX
                                                                    : dmxChannelY,
                                                                value
                                                            );
                                                        }}
                                                        state={selectedDevice.channel_state}
                                                        axis={channel.config.joystick_axis!}
                                                    />
                                                </div>
                                            ),
                                            button: (
                                                <DeviceButton
                                                    button_settings={channel.config.button_settings!}
                                                    valueupdate={(value: number) => {
                                                        sendDMXCommand(
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
                                        ),
                                        colorpicker: (
                                        <DeviceColorPicker valueupdate={(red: number, green: number, blue: number) => {
                                                    sendDMXCommand(selectedDevice.start_channel, channel.config.colorpicker_settings!.channel_red, red);
                                            sendDMXCommand(selectedDevice.start_channel, channel.config.colorpicker_settings!.channel_green, green);
                                            sendDMXCommand(selectedDevice.start_channel, channel.config.colorpicker_settings!.channel_blue, blue);

                                                }} state={selectedDevice.channel_state} channels={channel.config.colorpicker_settings!} />
                                            )
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

export default DashboardSidebar;
