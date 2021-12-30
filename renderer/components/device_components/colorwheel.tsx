import { FunctionComponent, useEffect, useState } from 'react';
import {
	DDMUICCColorWheelSubset,
	DDMUICCColorWheelSubsetType,
} from '../../devices/device_definitions';
import DeviceSlider, { Device_Slider_Settings } from './slider';

interface Device_Colorwheel {
	subsets: DDMUICCColorWheelSubset[];
	valueupdate: Function;
	state: number;
}

interface Device_Colorwheel_Subset {
	value: string;
	name: string;
	display_hex: string[];
	type: string;
	slider_settings?: Device_Slider_Settings;
}

const DeviceColorWheel: FunctionComponent<Device_Colorwheel> = ({
	subsets,
	valueupdate,
	state,
}) => {
	const [selectedColor, setSelectedColor] = useState('');

	useEffect(() => {
		findSelectionOption();
	}, [state]);

	function findSelectionOption() {
		subsets.map((subset) => {
			const { start, end } = getRangeOfValueFromString(subset.value);
			if (state >= start && state <= end) {
				setSelectedColor(subset.value);
			}
		});
	}
	return (
		<div>
			<div className="grid grid-flow-row gap-2 grid-cols-4 gap-y-4">
				{subsets.map((subset) => (
					<button
						key={subset.value}
						className="rounded-full w-6 h-6"
						onClick={(e) => {
							const { start, end } = getRangeOfValueFromString(subset.value);
							valueupdate(start);
							setSelectedColor(subset.value);
						}}
					>
						<div
							className={`w-6 h-6 rounded-full ${
								subset.value == selectedColor
									? 'border-4 border-yellow-300'
									: ''
							}`}
							style={{
								background: `linear-gradient(45deg, ${
									subset.display_hex.length > 1
										? subset.display_hex.join(', ')
										: [subset.display_hex[0], subset.display_hex[0]].join(', ')
								})`,
							}}
						></div>
					</button>
				))}
			</div>
			{(
				subsets.filter((e) => e.value === selectedColor)[0] || {
					type: 'static',
				}
			).type === DDMUICCColorWheelSubsetType.slider ? (
				<div className="mt-2">
					<p>
						{
							subsets?.filter((e) => e.value === selectedColor)[0]
								.slider_settings!.name
						}
					</p>
					<DeviceSlider
						slider_settings={
							subsets?.filter((e) => e.value === selectedColor)[0]
								.slider_settings!
						}
						valueupdate={(val: number) => {
							valueupdate(val);
						}}
						state={state}
					/>
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
};

function getRangeOfValueFromString(string: string): {
	start: number;
	end: number;
} {
	const values = string.split('-');
	const start = parseInt(values[0]);
	const end = values[1] != undefined ? parseInt(values[1]) : start;
	return { start: start, end: end };
}

export default DeviceColorWheel;

export type { Device_Colorwheel, Device_Colorwheel_Subset };
