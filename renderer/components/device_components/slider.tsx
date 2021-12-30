import React, { FunctionComponent, useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { DDMUICCSliderSettings } from '../../devices/device_definitions';

interface Device_Slider {
	slider_settings: DDMUICCSliderSettings;
	valueupdate: Function;
	state: number;
}

interface Device_Slider_Settings {
	name: string;
	range: Device_Slider_Settings_Range;
}

interface Device_Slider_Settings_Range {
	start: string;
	end: string;
}

const DeviceSlider: FunctionComponent<Device_Slider> = ({
	slider_settings,
	valueupdate,
	state,
}) => {
	useEffect(() => {
		setSliderValue(state);
	}, [state]);

	const [sliderValue, setSliderValue] = useState(state);

	return (
		<div className="mx-2">
			<Slider
				min={slider_settings.start}
				max={slider_settings.end}
				defaultValue={state}
				railStyle={{ backgroundColor: 'rgba(209, 213, 219)' }}
				value={sliderValue}
				onChange={(e) => {
					setSliderValue(e);
					valueupdate(e);
				}}
			/>
		</div>
	);
};

export type { Device_Slider_Settings, Device_Slider_Settings_Range };
export default DeviceSlider;
