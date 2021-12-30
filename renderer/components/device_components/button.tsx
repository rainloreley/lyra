import { FunctionComponent } from 'react';
import { DDMUICCButtonSettings } from '../../devices/device_definitions';

interface Device_Button {
	button_settings: DDMUICCButtonSettings;
	valueupdate: Function;
	post_function: () => void;
}

const DeviceButton: FunctionComponent<Device_Button> = ({
	button_settings,
	valueupdate,
	post_function,
}) => {
	return (
		<div>
			<button
				className={`text-white p-2 px-4 rounded-xl ${
					button_settings.is_dangerous
						? `bg-red-400 hover:bg-red-300`
						: `bg-blue-500 hover:bg-blue-400`
				}`}
				onClick={() => {
					valueupdate(button_settings.send_value);
					if (button_settings.reset_value !== undefined) {
						setTimeout((e) => {
							valueupdate(button_settings.reset_value);
						}, 1000);
					}
					post_function();
				}}
			>
				{button_settings.text}
			</button>
		</div>
	);
};

export default DeviceButton;
