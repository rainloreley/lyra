// TODO: migrate project to use this type of device definition files

import {
	DDMUICCButtonSettingsSpecialFunction,
	DDMUICCColorWheelSubsetType,
	DDMUICCDropdownOptionType,
	DeviceDefinition,
	DeviceDefinitionModeUIChannelType,
} from '../device_definitions';

const Stairville_MHX50Plus: DeviceDefinition = {
	vendor: 'Stairville',
	device_name: 'MH-X50+ LED Spot',
	author: 'Loreley',
	manual:
		'https://images.thomann.de/pics/atg/atgdata/document/manual/c_250558_v2_r1_en_online.pdf',
	uuid: '93f9cc00-5982-40e9-86ce-7ce3b7db7d16',
	modes: [
		{
			id: 0,
			name: '8 Channel DMX',
			channel_count: 8,
			channels: [
				{
					channel: 1,
					name: 'Pan',
				},
				{
					channel: 2,
					name: 'Tilt',
				},
				{
					channel: 3,
					name: 'Color wheel',
				},
				{
					channel: 4,
					name: 'Shutter',
				},
				{
					channel: 5,
					name: 'Gobo wheel',
				},
				{
					channel: 6,
					name: 'Gobo rotation',
				},
				{
					channel: 7,
					name: 'Prism',
				},
				{
					channel: 8,
					name: 'Focus',
				},
			],
			ui_channels: [
				{
					channel: '1-2',
					name: 'Position',
					type: DeviceDefinitionModeUIChannelType.joystick,
					config: {
						joystick_axis: {
							x: 1,
							y: 2,
						},
					},
				},
				{
					channel: '3',
					name: 'Color wheel',
					type: DeviceDefinitionModeUIChannelType.colorwheel,
					config: {
						colorwheel_subsets: [
							{
								value: '0-6',
								name: 'White',
								display_hex: ['#ffffff'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '7-13',
								name: 'Yellow',
								display_hex: ['#ffff00'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '14-20',
								name: 'Pink',
								display_hex: ['#FFC0CB'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '21-27',
								name: 'Green',
								display_hex: ['#00ff00'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '28-34',
								name: 'Peachblow',
								display_hex: ['#D7735B'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '35-41',
								name: 'Blue',
								display_hex: ['#32acfc'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '42-48',
								name: 'Kelly-green',
								display_hex: ['#4cbb17'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '49-55',
								name: 'Red',
								display_hex: ['#ff0000'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '56-63',
								name: 'Dark blue',
								display_hex: ['#0000ff'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '64-70',
								name: 'White + yellow',
								display_hex: ['#ffffff', '#ffff00'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '71-77',
								name: 'Yellow - pink',
								display_hex: ['#ffff00', '#FFC0CB'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '78-84',
								name: 'Pink + green',
								display_hex: ['#FFC0CB', '#00ff00'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '85-91',
								name: 'Green + peachblow',
								display_hex: ['#00ff00', '#D7735B'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '92-98',
								name: 'Peachblow + blue',
								display_hex: ['#D7735B', '#0000ff'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '99-105',
								name: 'Blue + Kelly-green',
								display_hex: ['#0000ff', '#4cbb17'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '106-112',
								name: 'Kelly-green + red',
								display_hex: ['#4cbb17', '#ff0000'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '113-119',
								name: 'Red + dark blue',
								display_hex: ['#ff0000', '#00008B'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '120-127',
								name: 'Dark blue + white',
								display_hex: ['#00008B', '#ffffff'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '128-191',
								name: 'Rainbow (positive direction)',
								display_hex: [
									'#FF6663',
									'#FEB144',
									'#FDFD97',
									'#9EE09E',
									'#9EC1CF',
									'#CC99C9',
								],
								type: DDMUICCColorWheelSubsetType.slider,
								slider_settings: {
									name: 'Speed',
									start: 128,
									end: 191,
								},
							},
							{
								value: '192-255',
								name: 'Rainbow (negative direction)',
								display_hex: [
									'#CC99C9',
									'#9EC1CF',
									'#9EE09E',
									'#FDFD97',
									'#FEB144',
									'#FF6663',
								],
								type: DDMUICCColorWheelSubsetType.slider,
								slider_settings: {
									name: 'Speed',
									start: 192,
									end: 255,
								},
							},
						],
					},
				},
				{
					channel: '4',
					name: 'Shutter',
					type: DeviceDefinitionModeUIChannelType.dropdown,
					config: {
						dropdown_options: [
							{
								value: '0-3',
								name: 'Closed',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '4-7',
								name: 'Open',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '8-215',
								name: 'Strobe effect',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 8,
									end: 215,
								},
							},
							{
								value: '216-255',
								name: 'Open',
								type: DDMUICCDropdownOptionType.static,
							},
						],
					},
				},
				{
					channel: '5',
					name: 'Gobo wheel',
					type: DeviceDefinitionModeUIChannelType.dropdown,
					config: {
						dropdown_options: [
							{
								value: '0-7',
								name: 'Open',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '8-15',
								name: 'Gobo 2',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '16-23',
								name: 'Gobo 3',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '24-31',
								name: 'Gobo 4',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '32-39',
								name: 'Gobo 5',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '40-47',
								name: 'Gobo 6',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '48-55',
								name: 'Gobo 7',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '56-63',
								name: 'Gobo 8',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '64-71',
								name: 'Gobo 8 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 64,
									end: 71,
								},
							},
							{
								value: '72-79',
								name: 'Gobo 7 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 72,
									end: 79,
								},
							},
							{
								value: '80-87',
								name: 'Gobo 6 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 80,
									end: 87,
								},
							},
							{
								value: '88-95',
								name: 'Gobo 5 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 88,
									end: 95,
								},
							},
							{
								value: '96-103',
								name: 'Gobo 4 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 96,
									end: 103,
								},
							},
							{
								value: '104-111',
								name: 'Gobo 3 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 104,
									end: 111,
								},
							},
							{
								value: '112-119',
								name: 'Gobo 2 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 112,
									end: 119,
								},
							},
							{
								value: '128-191',
								name: 'Rainbow effect (positive direction)',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 128,
									end: 191,
								},
							},
							{
								value: '192-255',
								name: 'Rainbow effect (negative direction)',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 192,
									end: 255,
								},
							},
						],
					},
				},
				{
					channel: '6',
					name: 'Gobo rotation',
					type: DeviceDefinitionModeUIChannelType.dropdown,
					config: {
						dropdown_options: [
							{
								value: '0-63',
								name: 'Fixed',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '64-147',
								name: 'Rotation (positive)',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 64,
									end: 147,
								},
							},
							{
								value: '148-231',
								name: 'Rotation (negative)',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 148,
									end: 231,
								},
							},
							{
								value: '232-255',
								name: 'Bouncing',
								type: DDMUICCDropdownOptionType.static,
							},
						],
					},
				},
				{
					channel: '7',
					name: 'Prism',
					type: DeviceDefinitionModeUIChannelType.dropdown,
					config: {
						dropdown_options: [
							{
								value: '0-7',
								name: 'Unused',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '8-247',
								name: 'Rotation',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 8,
									end: 247,
								},
							},
							{
								value: '248-255',
								name: 'Fixed',
								type: DDMUICCDropdownOptionType.static,
							},
						],
					},
				},
				{
					channel: '8',
					name: 'Focus',
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
		{
			id: 1,
			name: '14 Channel DMX',
			channel_count: 14,
			channels: [
				{
					channel: 1,
					name: 'Pan',
				},
				{
					channel: 2,
					name: 'Tilt',
				},
				{
					channel: 3,
					name: 'Pan Fine',
				},
				{
					channel: 4,
					name: 'Tilt Fine',
				},
				{
					channel: 5,
					name: 'Response Speed',
				},
				{
					channel: 6,
					name: 'Color wheel',
				},
				{
					channel: 7,
					name: 'Shutter',
				},
				{
					channel: 8,
					name: 'Dimmer',
				},
				{
					channel: 9,
					name: 'Gobo wheel',
				},
				{
					channel: 10,
					name: 'Gobo rotation',
				},
				{
					channel: 11,
					name: 'Special functions',
				},
				{
					channel: 12,
					name: 'Built-in programs',
				},
				{
					channel: 13,
					name: 'Prism',
				},
				{
					channel: 14,
					name: 'Focus',
				},
			],
			ui_channels: [
				{
					channel: '1-2',
					name: 'Position',
					type: DeviceDefinitionModeUIChannelType.joystick,
					config: {
						joystick_axis: {
							x: 1,
							y: 2,
						},
					},
				},
				{
					channel: '3',
					name: 'Pan Fine',
					type: DeviceDefinitionModeUIChannelType.slider,
					config: {
						slider_settings: {
							start: 0,
							end: 255,
						},
					},
				},
				{
					channel: '4',
					name: 'Tilt Fine',
					type: DeviceDefinitionModeUIChannelType.slider,
					config: {
						slider_settings: {
							start: 0,
							end: 255,
						},
					},
				},
				{
					channel: '5',
					name: 'Response Speed',
					type: DeviceDefinitionModeUIChannelType.slider,
					config: {
						slider_settings: {
							start: 0,
							end: 255,
						},
					},
				},
				{
					channel: '6',
					name: 'Color wheel',
					type: DeviceDefinitionModeUIChannelType.colorwheel,
					config: {
						colorwheel_subsets: [
							{
								value: '0-6',
								name: 'White',
								display_hex: ['#ffffff'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '7-13',
								name: 'Yellow',
								display_hex: ['#ffff00'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '14-20',
								name: 'Pink',
								display_hex: ['#FFC0CB'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '21-27',
								name: 'Green',
								display_hex: ['#00ff00'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '28-34',
								name: 'Peachblow',
								display_hex: ['#D7735B'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '35-41',
								name: 'Blue',
								display_hex: ['#32acfc'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '42-48',
								name: 'Kelly-green',
								display_hex: ['#4cbb17'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '49-55',
								name: 'Red',
								display_hex: ['#ff0000'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '56-63',
								name: 'Dark blue',
								display_hex: ['#0000ff'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '64-70',
								name: 'White + yellow',
								display_hex: ['#ffffff', '#ffff00'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '71-77',
								name: 'Yellow - pink',
								display_hex: ['#ffff00', '#FFC0CB'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '78-84',
								name: 'Pink + green',
								display_hex: ['#FFC0CB', '#00ff00'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '85-91',
								name: 'Green + peachblow',
								display_hex: ['#00ff00', '#D7735B'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '92-98',
								name: 'Peachblow + blue',
								display_hex: ['#D7735B', '#0000ff'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '99-105',
								name: 'Blue + Kelly-green',
								display_hex: ['#0000ff', '#4cbb17'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '106-112',
								name: 'Kelly-green + red',
								display_hex: ['#4cbb17', '#ff0000'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '113-119',
								name: 'Red + dark blue',
								display_hex: ['#ff0000', '#00008B'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '120-127',
								name: 'Dark blue + white',
								display_hex: ['#00008B', '#ffffff'],
								type: DDMUICCColorWheelSubsetType.static,
							},
							{
								value: '128-191',
								name: 'Rainbow (positive direction)',
								display_hex: [
									'#FF6663',
									'#FEB144',
									'#FDFD97',
									'#9EE09E',
									'#9EC1CF',
									'#CC99C9',
								],
								type: DDMUICCColorWheelSubsetType.slider,
								slider_settings: {
									name: 'Speed',
									start: 128,
									end: 191,
								},
							},
							{
								value: '192-255',
								name: 'Rainbow (negative direction)',
								display_hex: [
									'#CC99C9',
									'#9EC1CF',
									'#9EE09E',
									'#FDFD97',
									'#FEB144',
									'#FF6663',
								],
								type: DDMUICCColorWheelSubsetType.slider,
								slider_settings: {
									name: 'Speed',
									start: 192,
									end: 255,
								},
							},
						],
					},
				},
				{
					channel: '7',
					name: 'Shutter',
					type: DeviceDefinitionModeUIChannelType.dropdown,
					config: {
						dropdown_options: [
							{
								value: '0-3',
								name: 'Closed',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '4-7',
								name: 'Open',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '8-215',
								name: 'Strobe effect',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 8,
									end: 215,
								},
							},
							{
								value: '216-255',
								name: 'Open',
								type: DDMUICCDropdownOptionType.static,
							},
						],
					},
				},
				{
					channel: '8',
					name: 'Dimmer',
					type: DeviceDefinitionModeUIChannelType.slider,
					config: {
						slider_settings: {
							start: 0,
							end: 255,
						},
					},
				},
				{
					channel: '9',
					name: 'Gobo wheel',
					type: DeviceDefinitionModeUIChannelType.dropdown,
					config: {
						dropdown_options: [
							{
								value: '0-7',
								name: 'Open',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '8-15',
								name: 'Gobo 2',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '16-23',
								name: 'Gobo 3',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '24-31',
								name: 'Gobo 4',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '32-39',
								name: 'Gobo 5',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '40-47',
								name: 'Gobo 6',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '48-55',
								name: 'Gobo 7',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '56-63',
								name: 'Gobo 8',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '64-71',
								name: 'Gobo 8 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 64,
									end: 71,
								},
							},
							{
								value: '72-79',
								name: 'Gobo 7 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 72,
									end: 79,
								},
							},
							{
								value: '80-87',
								name: 'Gobo 6 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 80,
									end: 87,
								},
							},
							{
								value: '88-95',
								name: 'Gobo 5 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 88,
									end: 95,
								},
							},
							{
								value: '96-103',
								name: 'Gobo 4 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 96,
									end: 103,
								},
							},
							{
								value: '104-111',
								name: 'Gobo 3 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 104,
									end: 111,
								},
							},
							{
								value: '112-119',
								name: 'Gobo 2 shake',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 112,
									end: 119,
								},
							},
							{
								value: '128-191',
								name: 'Rainbow effect (positive direction)',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 128,
									end: 191,
								},
							},
							{
								value: '192-255',
								name: 'Rainbow effect (negative direction)',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 192,
									end: 255,
								},
							},
						],
					},
				},
				{
					channel: '10',
					name: 'Gobo rotation',
					type: DeviceDefinitionModeUIChannelType.dropdown,
					config: {
						dropdown_options: [
							{
								value: '0-63',
								name: 'Fixed',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '64-147',
								name: 'Rotation (positive)',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 64,
									end: 147,
								},
							},
							{
								value: '148-231',
								name: 'Rotation (negative)',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 148,
									end: 231,
								},
							},
							{
								value: '232-255',
								name: 'Bouncing',
								type: DDMUICCDropdownOptionType.static,
							},
						],
					},
				},
				{
					channel: '12',
					name: 'Built-in programs',
					type: DeviceDefinitionModeUIChannelType.dropdown,
					config: {
						dropdown_options: [
							{
								value: '0-7',
								name: 'Unused',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '8-23',
								name: 'Program 1',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '24-39',
								name: 'Program 2',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '40-55',
								name: 'Program 3',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '56-71',
								name: 'Program 4',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '72-87',
								name: 'Program 5',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '88-103',
								name: 'Program 6',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '104-119',
								name: 'Program 7',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '120-135',
								name: 'Program 8',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '136-151',
								name: 'Sound control 1',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '152-167',
								name: 'Sound control 2',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '168-183',
								name: 'Sound control 3',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '184-199',
								name: 'Sound control 4',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '200-215',
								name: 'Sound control 5',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '216-231',
								name: 'Sound control 6',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '232-247',
								name: 'Sound control 7',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '248-255',
								name: 'Sound control 8',
								type: DDMUICCDropdownOptionType.static,
							},
						],
					},
				},
				{
					channel: '13',
					name: 'Prism',
					type: DeviceDefinitionModeUIChannelType.dropdown,
					config: {
						dropdown_options: [
							{
								value: '0-7',
								name: 'Unused',
								type: DDMUICCDropdownOptionType.static,
							},
							{
								value: '8-247',
								name: 'Rotation',
								type: DDMUICCDropdownOptionType.slider,
								slider_settings: {
									name: 'Speed',
									start: 8,
									end: 247,
								},
							},
							{
								value: '248-255',
								name: 'Fixed',
								type: DDMUICCDropdownOptionType.static,
							},
						],
					},
				},
				{
					channel: '14',
					name: 'Focus',
					type: DeviceDefinitionModeUIChannelType.slider,
					config: {
						slider_settings: {
							start: 0,
							end: 255,
						},
					},
				},
				{
					channel: '11',
					name: 'Reset channels',
					type: DeviceDefinitionModeUIChannelType.button,
					config: {
						button_settings: {
							text: 'Reset channels',
							is_dangerous: true,
							send_value: 152,
							reset_value: 0,
							special_function:
								DDMUICCButtonSettingsSpecialFunction.reset_all_values,
						},
					},
				},
			],
		},
	],
};

export default Stairville_MHX50Plus;
