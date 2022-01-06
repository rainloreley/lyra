const appData = require('app-data-folder');
import fs from 'fs';
import { DeviceDefinition } from './device_definitions';

const appDataFolder = appData('lyra');
//const dmxDevices = [Stairville_MHX50Plus, GenericDimmer, Stairville_LEDFloodTRIPanel7x3WRGB];

const dmxDevices: DeviceDefinition[] = [];

async function getAllDevicesFromFolder() {
	if (!fs.existsSync(appDataFolder)) {
		fs.mkdir(appDataFolder, (err) => {
			if (err !== null) {
				console.error(err);
			}
		});
	}
	if (!fs.existsSync(`${appDataFolder}/devices`)) {
		fs.mkdir(`${appDataFolder}/devices`, (err) => {
			if (err !== null) {
				console.error(err);
			}
		});
	}

	try {
		fs.readdirSync(`${appDataFolder}/devices`).forEach((file) => {
			if (file.endsWith('.ldf')) {
				const filecontent = fs.readFileSync(
					`${appDataFolder}/devices/${file}`,
					'utf8'
				);
				const deviceConfig = JSON.parse(filecontent);
				dmxDevices.push(deviceConfig);
			}
		});
	} catch (err) {
		console.error(err);
	}

	console.log(
		`${dmxDevices.length} device configs loaded from ${appDataFolder}/devices`
	);
}

export { getAllDevicesFromFolder };
export default dmxDevices;
