import React, { FunctionComponent, useState, useEffect } from 'react';
import {
	DDMUICCDropdownOption,
	DDMUICCDropdownOptionType,
} from '../../devices/device_definitions';
import DeviceSlider, { Device_Slider_Settings } from './slider';

interface Device_Dropdown {
	options?: DDMUICCDropdownOption[];
	valueupdate: Function;
	state: number;
}

interface Device_Dropdown_Options {
	value: string;
	name: string;
	type: string;
	slider_settings?: Device_Slider_Settings;
}

const DeviceDropdown: FunctionComponent<Device_Dropdown> = ({
	options,
	valueupdate,
	state,
}) => {
	const [dropdownToggled, setDropdownToggled] = useState(false);
	const [selectedOption, setSelectedOption] = useState('');

	useEffect(() => {
		findSelectionOption();
	}, [state]);

	function findSelectionOption() {
		options?.map((e) => {
			const { start, end } = getRangeOfValueFromString(e.value);
			if (state >= start && state <= end) {
				setSelectedOption(e.value);
			}
		});
	}
	return (
		<div>
			<div className="relative inline-block text-left">
				<div>
					<button
						type="button"
						onClick={(e) => {
							setDropdownToggled(!dropdownToggled);
						}}
						className="inline-flex dark:text-white justify-center w-full rounded-md border dark:border-gray-600 shadow-sm px-4 py-2 dark:bg-gray-700 bg-gray-300 text-sm font-medium dark:hover:bg-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-indigo-500"
						id="menu-button"
						aria-expanded="true"
						aria-haspopup="true"
					>
						{
							(
								options?.filter((e) => e.value === selectedOption)[0] || {
									name: '',
								}
							).name
						}
						<svg
							className="-mr-1 ml-2 h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>

				<div
					className={`origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-gray-200 dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none ${
						dropdownToggled
							? 'transition ease-out duration-100 transform opacity-100 scale-100'
							: 'transition ease-in duration-75 transform opacity-0 scale-0'
					} z-10`}
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="menu-button"
				>
					<div className="py-1" role="none">
						{options?.map((option) => (
							<button
								key={option.value}
								className="dark:text-white block w-full text-left px-4 py-2 text-sm"
								role="menuitem"
								onClick={(btn) => {
									setDropdownToggled(!dropdownToggled);
									const { start, end } = getRangeOfValueFromString(
										option.value
									);
									valueupdate(start);
								}}
							>
								{option.name}
							</button>
						))}
					</div>
				</div>
			</div>
			{(
				options?.filter((e) => e.value === selectedOption)[0] || {
					type: 'static',
				}
			).type === DDMUICCDropdownOptionType.slider ? (
				<div className="mt-2">
					<p>
						{
							options?.filter((e) => e.value === selectedOption)[0]
								.slider_settings!.name
						}
					</p>
					<DeviceSlider
						slider_settings={
							options?.filter((e) => e.value === selectedOption)[0]
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

export default DeviceDropdown;
