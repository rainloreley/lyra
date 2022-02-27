import {FunctionComponent, useEffect, useState} from 'react';
import {DDMUICCColorPickerSettings} from '../../devices/device_definitions';
import {DMXProjectDeviceChannelState} from '../../backend/structs/DMXProjectDevice';
import {RgbColor, RgbColorPicker} from 'react-colorful';
import {GroupButtonElement} from '../dashboard/SceneList';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface DeviceColorPicker_Props {
    valueupdate: (red: number, green: number, blue: number) => void;
    state: DMXProjectDeviceChannelState[];
    channels: DDMUICCColorPickerSettings;
}

const DeviceColorPicker: FunctionComponent<DeviceColorPicker_Props> = ({
                                                                           valueupdate,
                                                                           state,
                                                                           channels,
                                                                       }) => {
    const [color, setColor] = useState<RgbColor>({r: 0, g: 0, b: 0});
    const [selectedMenu, setSelectedMenu] = useState(0);

    useEffect(() => {
        const red = state.filter((e) => e.channel === channels.channel_red)[0]
            .value;
        const green = state.filter((e) => e.channel === channels.channel_green)[0]
            .value;
        const blue = state.filter((e) => e.channel === channels.channel_blue)[0]
            .value;
        setColor({r: red, g: green, b: blue});
    }, [state]);

    const handleColorChange = (color: RgbColor) => {
        sendDMXSignal(color.r, color.g, color.b);
        setColor(color);
    };

    const sendDMXSignal = (r: number, g: number, b: number) => {
        valueupdate(r, g, b);
    };

    return (
        <div>
            <div className="flex">
                <GroupButtonElement
                    name="Gradient"
                    color="#ff0000"
                    isSelected={selectedMenu === 0}
                    onSelect={() => {
                        setSelectedMenu(0);
                    }}
                />
                <GroupButtonElement
                    name="Sliders"
                    color="#00ff00"
                    isSelected={selectedMenu === 1}
                    onSelect={() => {
                        setSelectedMenu(1);
                    }}
                />
            </div>
            <div className="mx-4 mt-2">
                {selectedMenu === 0 ? (
                    <RgbColorPicker color={color} onChange={handleColorChange}/>
                ) : (
                    <div>
                        <p>Red</p>
                        <Slider
                            min={0}
                            max={255}
                            className="mb-2"
                            defaultValue={color.r}
                            trackStyle={{backgroundColor: 'rgba(255, 0, 0)'}}
                            railStyle={{backgroundColor: 'rgba(255, 100, 100)'}}
                            value={color.r}
                            onChange={(e) => {
                                handleColorChange({r: e, g: color.g, b: color.b});
                            }}
                        />
                        <p>Green</p>
                        <Slider
                            min={0}
                            max={255}
                            className="mb-2"
                            defaultValue={color.g}
                            trackStyle={{backgroundColor: 'rgba(0 ,255, 0)'}}
                            railStyle={{backgroundColor: 'rgba(100, 255, 100)'}}
                            value={color.g}
                            onChange={(e) => {
                                handleColorChange({r: color.r, g: e, b: color.b});
                            }}
                        />
                        <p>Blue</p>
                        <Slider
                            min={0}
                            max={255}
                            defaultValue={color.b}
                            trackStyle={{backgroundColor: 'rgba(0, 0, 255)'}}
                            railStyle={{backgroundColor: 'rgba(50, 50, 255)'}}
                            value={color.b}
                            onChange={(e) => {
                                handleColorChange({r: color.r, g: color.g, b: e});
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
export default DeviceColorPicker;
