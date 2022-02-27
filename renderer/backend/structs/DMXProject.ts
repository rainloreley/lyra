import dmxDevices from '../../devices/devicelist';
import {DMXProjectDevice, DMXProjectDeviceChannelState,} from './DMXProjectDevice';
import DMXProjectScene from './DMXProjectScene';
import {v4 as uuidv4} from 'uuid';
import DMXProjectSceneGroup from './DMXProjectSceneGroup';
import DMX_DeviceStateSnapshot from "./DMX_DeviceStateSnapshot";

class DMXProject {
    uid: string;
    name: string;
    last_modified: number;
    devices: DMXProjectDevice[];
    scene_groups: DMXProjectSceneGroup[];

    getDeviceById(id: string): DMXProjectDevice | null {
        const foundDevice = this.devices.find((e) => e.id === id);
        if (foundDevice !== undefined) {
            return foundDevice;
        } else {
            return null;
        }
    }

    constructor(json: any, replaceUUID: boolean = true) {
        this.name = json.name;
        this.uid = json.uid;
        this.last_modified = json.last_modified;
        this.devices = json.devices.map((item: DMXProjectDevice) => {
            const obj: DMXProjectDevice = {
                id: item.id,
                name: item.name,
                device: replaceUUID
                    ? dmxDevices.filter((e) => e.uuid === item.device)[0]
                    : item.device,
                mode: item.mode,
                start_channel: item.start_channel,
                channel_state: item.channel_state.map(
                    (channel: DMXProjectDeviceChannelState) => {
                        var obj: DMXProjectDeviceChannelState = {
                            channel: channel.channel,
                            value: channel.value,
                        };
                        return obj;
                    }
                ),
            };
            return obj;
        });
        this.scene_groups = (json.scene_groups ?? []).map(
            (item: DMXProjectSceneGroup) => {
                const obj: DMXProjectSceneGroup = {
                    id: item.id,
                    name: item.name,
                    color: item.color,
                    scenes: item.scenes.map((scene) => {
                        const scene_obj: DMXProjectScene = {
                            id: scene.id,
                            name: scene.name,
                            fadein_time: scene.fadein_time,
                            device_states: scene.device_states.map((devicestate) => {
                                const ds_obj: DMX_DeviceStateSnapshot = {
                                    device_id: devicestate.device_id,
                                    channels: devicestate.channels.map((channel) => {
                                        const channel_obj: DMXProjectDeviceChannelState = {
                                            channel: channel.channel,
                                            value: channel.value
                                        }
                                        return channel_obj;
                                    })
                                }
                                return ds_obj
                            })
                        }

                        return scene_obj;
                    })
                }

                return obj;
            }
        );
    }

    static empty(name: string | undefined): DMXProject {
        return new DMXProject({
            uid: uuidv4(),
            name: name ?? 'New Project',
            last_modified: Date.now(),
            devices: [],
            scene_groups: [
                {
                    id: "main",
                    name: 'Main',
                    color: "#ef4444",
                    scenes: [],
                },
            ],
        });
    }
}

export default DMXProject;
