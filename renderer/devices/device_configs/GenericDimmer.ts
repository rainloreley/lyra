import {
	DeviceDefinition,
	DeviceDefinitionModeUIChannelType,
} from '../device_definitions';

const GenericDimmer: DeviceDefinition = {
	vendor: 'Generic',
	device_name: 'Dimmer',
	author: 'Loreley',
	manual: '-',
	uuid: '330f2992-a9b9-47f4-9f8b-69854c379da7',
	modes: [
		{
			id: 0,
			name: '1 Channel DMX',
			channel_count: 1,
			channels: [
				{
					channel: 1,
					name: 'Dimmer',
				},
			],
			ui_channels: [
				{
					channel: '1',
					name: 'Dimmer',
					type: DeviceDefinitionModeUIChannelType.slider,
					config: {
						slider_settings: {
							start: 0,
							end: 255,
						},
					},
				},
			],
		},
	],
};

export default GenericDimmer;
