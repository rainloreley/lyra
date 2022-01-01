import DMX_DeviceStateSnapshot from "./DMX_DeviceStateSnapshot";

interface DMXProjectScene {
    id: string;
    name: string;
    fadein_time: number;
    device_states: DMX_DeviceStateSnapshot[];
}

export default DMXProjectScene