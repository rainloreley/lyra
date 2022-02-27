import {FunctionComponent, useContext, useState} from "react";
import {
    AppControlContext,
    NotificationCenterElement,
    NotificationCenterElementStatus
} from "../../../appContextProvider";
import DeviceDropdown from "../../../device_components/dropdown";
import {DDMUICCDropdownOptionType} from "../../../../devices/device_definitions";
import {FoundInterface} from "../../../../backend/Interface/DMXInterface";
import FX5Interface from "../../../../backend/Interface/DMXI_FX5";
import {v4 as uuidv4} from "uuid";
import {get as getCookie, set as setCookie} from 'es-cookie';

interface DMXFX5Settings_Props {
    selectedInterface: FoundInterface
}

const DMXFX5Settings: FunctionComponent<DMXFX5Settings_Props> = ({selectedInterface}) => {

    const {projectManager, addNotification} = useContext(AppControlContext);

    const [selectedMode, setSelectedMode] = useState<number>((projectManager.interface as FX5Interface).dmxMode);

    const changeMode = async (value: number) => {
        try {
            const result = await (projectManager.interface as FX5Interface).setDMXMode(value);
            if (result) {
                (projectManager.interface as FX5Interface).dmxMode = value;
                setSelectedMode(value);

                const storedInterfaceDataString = getCookie("dmxInterface");
                if (storedInterfaceDataString) {
                    const storedInterfaceData = JSON.parse(storedInterfaceDataString);
                    if (storedInterfaceData && storedInterfaceData.type === "fx5") {
                        storedInterfaceData.mode = value;
                        setCookie("dmxInterface", JSON.stringify(storedInterfaceData), {expires: 365})
                    }
                }

            }
        } catch (err) {
            const notification: NotificationCenterElement = {
                uid: uuidv4(),
                text: err,
                status: NotificationCenterElementStatus.error,
                dismissAt: Date.now() + 3000
            }
            addNotification(notification)
        }
    }

    return (
        <div>
            <div>
                <h3 className={"text-sm font-semibold"}>Selected Interface</h3>
                <h2 className={"text-lg font-bold"}>{selectedInterface.name}</h2>
                <p className={"text-gray-500 text-sm italic"}>Serial: {selectedInterface.serial}</p>
            </div>
            <div className={"mt-2"}>
                <p className={"font-semibold text-lg"}>Mode</p>
                <DeviceDropdown valueupdate={(value: number) => {
                    changeMode(value);
                }} state={selectedMode} options={[
                    {
                        value: "0",
                        name: "0 - Standby",
                        type: DDMUICCDropdownOptionType.static
                    },
                    {
                        value: "1",
                        name: "1 - DMX In -> DMX Out",
                        type: DDMUICCDropdownOptionType.static
                    },
                    {
                        value: "2",
                        name: "2 - PC Out -> DMX Out",
                        type: DDMUICCDropdownOptionType.static
                    },
                    {
                        value: "3",
                        name: "3 - DMX In + PC Out -> DMX Out",
                        type: DDMUICCDropdownOptionType.static
                    },
                    {
                        value: "4",
                        name: "4 - DMX In -> PC In",
                        type: DDMUICCDropdownOptionType.static
                    },
                    {
                        value: "5",
                        name: "5 - DMX In -> DMX Out & DMX In -> PC In",
                        type: DDMUICCDropdownOptionType.static
                    },
                    {
                        value: "6",
                        name: "6 - PC Out -> DMX Out & DMX In -> PC In",
                        type: DDMUICCDropdownOptionType.static
                    },
                    {
                        value: "7",
                        name: "7 - DMX In + PC Out -> DMX Out & DMX In -> PC In",
                        type: DDMUICCDropdownOptionType.static
                    },
                ]}/>
            </div>
        </div>
    )
}

export default DMXFX5Settings;