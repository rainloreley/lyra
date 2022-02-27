interface DeviceDefinition {
    vendor: string;
    device_name: string;
    author: string;
    manual: string;
    image?: string;
    uuid: string;
    modes: DeviceDefinitionMode[];
}

interface DeviceDefinitionMode {
    id: number;
    name: string;
    channel_count: number;
    channels: DeviceDefinitionModeChannel[];
    ui_channels: DeviceDefinitionModeUIChannel[];
}

interface DeviceDefinitionModeChannel {
    channel: number;
    name: string;
}

interface DeviceDefinitionModeUIChannel {
    channel: string;
    name: string;
    type: DeviceDefinitionModeUIChannelType;
    config: DeviceDefinitionModeUIChannelConfig;
}

interface DeviceDefinitionModeUIChannelConfig {
    joystick_axis?: DDMUICCJoystickAxis;
    colorwheel_subsets?: DDMUICCColorWheelSubset[];
    slider_settings?: DDMUICCSliderSettings;
    dropdown_options?: DDMUICCDropdownOption[];
    button_settings?: DDMUICCButtonSettings;
    colorpicker_settings?: DDMUICCColorPickerSettings;
}

interface DDMUICCColorPickerSettings {
    channel_red: number;
    channel_green: number;
    channel_blue: number;
}

interface DDMUICCJoystickAxis {
    x: number;
    y: number;
}

interface DDMUICCColorWheelSubset {
    value: string;
    name: string;
    display_hex: string[];
    type: DDMUICCColorWheelSubsetType;
    slider_settings?: DDMUICCSliderSettings;
}

enum DDMUICCColorWheelSubsetType {
    static = 0,
    slider = 1,
}

interface DDMUICCSliderSettings {
    name?: string;
    start: number;
    end: number;
}

interface DDMUICCButtonSettings {
    text: string;
    is_dangerous: boolean;
    send_value: number;
    reset_value?: number;
    special_function?: DDMUICCButtonSettingsSpecialFunction;
}

enum DDMUICCButtonSettingsSpecialFunction {
    reset_all_values = 0,
}

enum DeviceDefinitionModeUIChannelType {
    joystick = 'joystick',
    colorwheel = 'color-wheel',
    dropdown = 'dropdown',
    slider = 'slider',
    button = 'button',
    colorpicker = 'colorpicker',
}

interface DDMUICCDropdownOption {
    value: string;
    name: string;
    type: DDMUICCDropdownOptionType;
    slider_settings?: DDMUICCSliderSettings;
}

enum DDMUICCDropdownOptionType {
    static = 0,
    slider = 1,
}

export type {
    DeviceDefinition,
    DeviceDefinitionMode,
    DeviceDefinitionModeChannel,
    DeviceDefinitionModeUIChannel,
    DeviceDefinitionModeUIChannelConfig,
    DDMUICCJoystickAxis,
    DDMUICCColorWheelSubset,
    DDMUICCSliderSettings,
    DDMUICCDropdownOption,
    DDMUICCButtonSettings,
    DDMUICCColorPickerSettings,
};

export {
    DDMUICCColorWheelSubsetType,
    DeviceDefinitionModeUIChannelType,
    DDMUICCDropdownOptionType,
    DDMUICCButtonSettingsSpecialFunction,
};
