import {FunctionComponent, useEffect, useState} from "react";
import {DDMUICCColorPickerSettings} from "../../devices/device_definitions";
import {DMXProjectDeviceChannelState} from "../../backend/structs/DMXProjectDevice";
import {RgbColor, RgbColorPicker} from "react-colorful";

interface DeviceColorPicker_Props {
    valueupdate: (red: number, green: number, blue: number) => void;
    state: DMXProjectDeviceChannelState[];
    channels: DDMUICCColorPickerSettings

}

const DeviceColorPicker: FunctionComponent<DeviceColorPicker_Props> = ({valueupdate, state, channels}) => {

    /*const [rState, setRState] = useState(0);
    const [gState, setGState] = useState(0);
    const [bState, setBState] = useState(0);*/
    const [color, setColor] = useState<RgbColor>({r: 0, g: 0, b: 0})

    useEffect(() => {
        const red = state.filter((e) => e.channel === channels.channel_red)[0].value;
        const green = state.filter((e) => e.channel === channels.channel_green)[0].value;
        const blue = state.filter((e) => e.channel === channels.channel_blue)[0].value
        //setRState(state.filter((e) => e.channel === channels.channel_red)[0].value);
        //setGState(state.filter((e) => e.channel === channels.channel_green)[0].value);
        //setBState(state.filter((e) => e.channel === channels.channel_blue)[0].value);
    }, [state]);

    const handleColorChange = (color: RgbColor) => {
        sendDMXSignal(color.r, color.g, color.b);
        setColor(color);
        /*setRState(rgb.r);
        setGState(rgb.g);
        setBState(rgb.b);*/
    }

    const sendDMXSignal = (r: number, g: number, b: number) => {
        valueupdate(r, g, b);
    }


    return (
        <div>
            <RgbColorPicker color={color} onChange={handleColorChange} />
        </div>
    )

}
export default DeviceColorPicker;