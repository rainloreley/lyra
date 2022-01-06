import Stairville_MHX50Plus from './device_configs/MHX50Plus';
import GenericDimmer from "./device_configs/GenericDimmer";
import Stairville_LEDFloodTRIPanel7x3WRGB from "./device_configs/Stairville_LEDFloodTRIPanel7x3WRGB";

const appData = require("app-data-folder");
import fs from "fs";
import {DeviceDefinition} from "./device_definitions";

const appDataFolder = appData("lyra");
//const dmxDevices = [Stairville_MHX50Plus, GenericDimmer, Stairville_LEDFloodTRIPanel7x3WRGB];

const dmxDevices: DeviceDefinition[] = [];

async function getAllDevicesFromFolder() {
    if (!fs.existsSync(appDataFolder)) {
        fs.mkdir(appDataFolder, (err) => {
            if (err !== null) {
                console.error(err)
            }
        })
    }
    if (!fs.existsSync(`${appDataFolder}/devices`)) {
        fs.mkdir(`${appDataFolder}/devices`, (err) => {
            if (err !== null) {
                console.error(err);
            }
        })
    }
    fs.readdir(`${appDataFolder}/devices`, function(err, files) {
        if (err) {
            // TODO: error handling
            console.error(err);
            return;
        }
        files.forEach((file) => {
            if (file.endsWith(".ldf")) {
                fs.readFile(`${appDataFolder}/devices/${file}`, "utf8", (err, filecontent) => {
                    if (err) {
                        // TODO: error handling
                        console.error(err);
                        return;
                    }
                    try {
                        const deviceConfig = JSON.parse(filecontent);
                        dmxDevices.push(deviceConfig);
                    }
                    catch(err) {
                        console.error(err);
                    }
                })
            }
        });
        console.log(`${dmxDevices.length} device configs loaded from ${appDataFolder}/devices`)
    })
}

export {getAllDevicesFromFolder}
export default dmxDevices;
