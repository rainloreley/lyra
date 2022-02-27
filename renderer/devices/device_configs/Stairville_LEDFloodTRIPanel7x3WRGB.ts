// TODO: add rgb picker component

import {DeviceDefinition, DeviceDefinitionModeUIChannelType,} from '../device_definitions';

const Stairville_LEDFloodTRIPanel7x3WRGB: DeviceDefinition = {
    vendor: 'Stairville',
    device_name: 'LED Flood TRI Panel 7x3W RGB',
    author: 'Loreley',
    manual:
        'https://images.static-thomann.de/pics/atg/atgdata/document/manual/c_253406_v5_en_online.pdf',
    uuid: '15572350-760f-47c7-93da-52e26c6d4dbd',
    modes: [
        {
            id: 0,
            name: '3 Channel DMX',
            channel_count: 3,
            channels: [
                {
                    channel: 1,
                    name: 'Intensity Red',
                },
                {
                    channel: 2,
                    name: 'Intensity Green',
                },
                {
                    channel: 3,
                    name: 'Intensity Blue',
                },
            ],
            ui_channels: [
                {
                    channel: '1-3',
                    name: 'Color Picker',
                    type: DeviceDefinitionModeUIChannelType.colorpicker,
                    config: {
                        colorpicker_settings: {
                            channel_red: 1,
                            channel_green: 2,
                            channel_blue: 3,
                        },
                    },
                },
            ],
        },
        {
            id: 1,
            name: '4 Channel DMX',
            channel_count: 4,
            channels: [
                {
                    channel: 1,
                    name: 'Dimmer',
                },
                {
                    channel: 2,
                    name: 'Intensity Red',
                },
                {
                    channel: 3,
                    name: 'Intensity Green',
                },
                {
                    channel: 4,
                    name: 'Intensity Blue',
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
                {
                    channel: '2-4',
                    name: 'Color Picker',
                    type: DeviceDefinitionModeUIChannelType.colorpicker,
                    config: {
                        colorpicker_settings: {
                            channel_red: 2,
                            channel_green: 3,
                            channel_blue: 4,
                        },
                    },
                },
            ],
        },
    ],
};

export default Stairville_LEDFloodTRIPanel7x3WRGB;
