import dmxDevices from '../../devices/devicelist';
import {
	DMXProjectDevice,
	DMXProjectDeviceChannelState,
} from './DMXProjectDevice';
import DMXProjectScene from './DMXProjectScene';
import { v4 as uuidv4 } from 'uuid';
import DMXProjectSceneGroup from './DMXProjectSceneGroup';

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
				return item;
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
					id: uuidv4(),
					name: 'Default',
					scenes: [],
				},
			],
		});
	}
}

export default DMXProject;
