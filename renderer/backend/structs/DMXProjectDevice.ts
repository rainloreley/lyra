import {DeviceDefinition} from "../../devices/device_definitions";

interface DMXProjectDevice {
    id: string;
    name: string;
    device: DeviceDefinition | string;
    start_channel: number;
    mode: number;
    channel_state: DMXProjectDeviceChannelState[];
}

interface DMXProjectDeviceChannelState {
    channel: number;
    value: number;
}

export type {DMXProjectDevice, DMXProjectDeviceChannelState}