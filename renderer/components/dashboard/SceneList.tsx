import {FunctionComponent, useContext, useEffect, useState} from "react";
import DMXProjectSceneGroup from "../../backend/structs/DMXProjectSceneGroup";
import {AppControlContext, DMXMapElement} from "../appContextProvider";
import DMXProjectScene from "../../backend/structs/DMXProjectScene";
import styles from "../../styles/Dashboard_Sidebar.module.css"
import {Play} from "react-feather";
import moment from "moment";
import CloseButton from "../small/close_button";
import NewSceneOverlay from "./scenes/NewSceneOverlay";

interface SceneList_Props {
    closeView: () => void;
}

const SceneList: FunctionComponent<SceneList_Props> = ({closeView}) => {

    const [groups, setGroups] = useState<DMXProjectSceneGroup[]>(
        []
    )
    const [selectedGroup, setSelectedGroup] = useState<DMXProjectSceneGroup | null>(null);

    const [searchField, setSearchField] = useState<string>("");

    const [scenes, setScenes] = useState<DMXProjectScene[]>([]);

    const { projectManager, sendDMXMap, setOverlayView } = useContext(AppControlContext);


    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setGroups(projectManager.currentProject.scene_groups)
        changedSelectedGroup(null, projectManager.currentProject.scene_groups);
    }

    const changedSelectedGroup = (group: DMXProjectSceneGroup | null, allGroups: DMXProjectSceneGroup[] = groups) => {
        setSelectedGroup(group);
        loadScenes(group, allGroups);
    }

    const loadScenes = (group: DMXProjectSceneGroup = selectedGroup, allGroups: DMXProjectSceneGroup[] = groups, filter = searchField) => {
        if (group !== null) {
            setScenes(group.scenes.filter((e) => e.name.toLowerCase().includes(filter.toLowerCase())));
        }
        else {
            var allScenes: DMXProjectScene[] = [];
            for (var _g of allGroups) {
                allScenes = allScenes.concat(_g.scenes);
            }
            setScenes(allScenes.filter((e) => e.name.toLowerCase().includes(filter.toLowerCase())));
        }
    }

    const runScene = (scene: DMXProjectScene) => {

        // instead of sending individual values, we just send the entire dmx map (1-512) to the backend.
        // When looking at the FX5 interface for example, this ensures that all commands are executed
        // at the same time because the backend of the FX5 creates a map with all dmx channels anyways.
        // we can bypass that and provide a custom map to send to the interface.
        // but we can't just fill it with 0s and replace the right channels with values because that would turn off
        // every other channel that isn't stored in the scene.

        // first up we do actually fill it up with 0s to have a map of 512 values.
        // you can see that we have another parameter called `device`. This is now empty but will be filled with
        // a device id later. this makes it easier for the context function later to update the channel values for
        // all devices

        var dmxoutmap: DMXMapElement[] = [];
        for (var i = 0; i < 512; i++) {
            dmxoutmap.push({
                channel: i + 1,
                value: 0,
                device: "",
            })
        }

        // after that, we loop through all devices in the project to get all channel states.
        // we put that information into the dmx map to make sure that we have the state of all
        // dmx channels in the map (to prevent setting channels not stored in the scene to 0 as mentioned before)

        for (var device of projectManager.currentProject.devices) {
            const start_channel = device.start_channel;
            for (var channel of device.channel_state) {
                dmxoutmap.find((e) => e.channel === start_channel + channel.channel - 1).value = channel.value;
                dmxoutmap.find((e) => e.channel === start_channel + channel.channel - 1).device = device.id;
            }
        }

        // next up, we loop through all devices stored in the scene.
        // the device id is stored, so we try to find the device in the project by its id.
        // if it exists (yay), we loop through all stored channels of this device in the scene
        // and set the specific channel to the stored value in the dmx map.
        // the reason we need the device is because the scene stores relative channels to the device
        // and not the absolute channel in the entire dmx universe.
        // If for example channel 1 of device 1 is set to 255 in the scene, we can't just set channel 1 of
        // the map to 255 because device 1 may start at channel 20. that's why we need the start channel.

        for (var device_state of scene.device_states) {
            const device = projectManager.currentProject.devices.find((e) => device_state.device_id === e.id);
            if (device) {
                for (var channel of device_state.channels) {
                    dmxoutmap.find((e) => e.channel === device.start_channel + channel.channel - 1).value = channel.value;
                    dmxoutmap.find((e) => e.channel === device.start_channel + channel.channel - 1).device = device.id;
                }
            }
        }

        // at the end, we send that data to a function in the context
        // that accepts dmx maps and forwards them to the right dmx server

        sendDMXMap(dmxoutmap);

    }

    return (
        <div className={"pb-4 my-2 mx-2 flex"}>
            <div className={"dark:bg-gray-800 bg-gray-200 h-full p-4 shadow-2xl rounded-2xl flex flex-col w-80"}>
                <div className={"flex justify-between items-center mb-2"}>
                    <h1 className={"font-bold text-xl dark:text-white"}>Scenes</h1>
                    <CloseButton buttonPressed={closeView} size={5} />
                </div>
                <div className={"flex flex-wrap pb-1"}>
                    <GroupButtonElement name={"All"} color={"#9ca3af"} isSelected={selectedGroup === null} onSelect={() => {
                        changedSelectedGroup(null)
                    }} />
                    {groups.map((group) => (
                        <GroupButtonElement key={group.id} name={group.name} color={group.color} isSelected={(selectedGroup?.id || "") === group.id} onSelect={() => {
                            changedSelectedGroup(group)
                        }} />
                    ))}
                </div>
                <div className={"border-b border-gray-400 dark:border-gray-600 w-full px-2 pb-2"}>
                    <input className={"border bg-gray-300 border-gray-400 dark:border-gray-500 dark:bg-gray-600 rounded-lg w-full px-1"} placeholder={"Search"} value={searchField} onChange={(event) => {
                        setSearchField(event.target.value);
                        loadScenes(selectedGroup, groups, event.target.value)
                    }}/>
                </div>
                <div className={`h-full overflow-y-scroll ${styles.noscrollbar}`}>
                    {scenes.length > 0 ? (
                        <ul>
                            {scenes.map((scene, index) => (
                                <div key={scene.id} className={`p-4 flex justify-between ${index !== scenes.length - 1 ? "border-b border-gray-400" : ""}`}>
                                    <div>
                                        <h3 className={"text-md font-semibold"}>{scene.name}</h3>
                                        <p className={"text-sm text-gray-400"}>Fade: {moment(scene.fadein_time).format("ss.SS")}s</p>
                                    </div>
                                    <div className={"flex items-center"}>
                                        <button onClick={() => {
                                            runScene(scene);
                                        }}>
                                            <Play size={18} color={"#22c55e"} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <div className={"flex items-center justify-center h-full"}>
                            <p className={"text-lg font-semibold"}>No scenes</p>
                        </div>
                    )}
                </div>
                <div className={"flex justify-end border-t border-gray-400 dark:border-gray-600 pt-2"}>
                    <div>
                        <button className={"bg-blue-500 text-white rounded-xl w-10 h-10 text-xl"} onClick={() => {
                            setOverlayView(<NewSceneOverlay />);
                        }}>+</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface GroupButtonElement_Props {
    name: string;
    color: string;
    isSelected: boolean;
    onSelect: () => void;
}

const GroupButtonElement: FunctionComponent<GroupButtonElement_Props> = ({name, color, isSelected, onSelect}) => {
    return (
        <button className={`p-1 px-2 text-xs m-1 border ${isSelected ? "border-yellow-500 dark:border-yellow-300" : "border-gray-400 dark:border-gray-500"} rounded-full`} onClick={() => onSelect()}>
            <div className={"flex items-center"}>
                <div style={{backgroundColor: color}} className={`rounded-full w-4 h-4 mr-1`} />
                <p>{name}</p>
            </div>
        </button>
    )
}

export {GroupButtonElement};

export default SceneList;