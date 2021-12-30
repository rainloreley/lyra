import DMX_DeviceStateSnapshot from "./DMX_DeviceStateSnapshot";

interface DMXProjectScene {
    id: string;
    name: string;
    devicestates: DMX_DeviceStateSnapshot[];
}

export default DMXProjectScene