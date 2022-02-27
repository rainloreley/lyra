import {FunctionComponent, useContext, useEffect, useState} from "react";
import {DMXProjectDevice} from "../../../backend/structs/DMXProjectDevice";
import {AppControlContext} from "../../appContextProvider";
import {ChevronDown, ChevronRight} from "react-feather";
import {DeviceDefinition} from "../../../devices/device_definitions"
import styles from "../../../styles/Dashboard_Sidebar.module.css"
import {GroupButtonElement} from "../SceneList";
import DMXProjectSceneGroup from "../../../backend/structs/DMXProjectSceneGroup";
import CloseButton from "../../small/close_button";
import LoadingSpinner from "../../loadingSpinner";
import DMXProjectScene from "../../../backend/structs/DMXProjectScene";
import {v4 as uuidv4} from "uuid";
import DMX_DeviceStateSnapshot, {DMX_DeviceStateSnapshotChannelValue} from "../../../backend/structs/DMX_DeviceStateSnapshot";

interface ChannelElement {
    device_id: string;
    channel: number;
    value: number;
}

const NewSceneOverlay: FunctionComponent = ({}) => {

    const [sceneName, setSceneName] = useState<string>("");
    const [sceneNameModified, setSceneNameModified] = useState<boolean>(false);
    const [devices, setDevices] = useState<DMXProjectDevice[]>([]);
    const [groups, setGroups] = useState<DMXProjectSceneGroup[]>(
        []
    )
    const [selectedGroup, setSelectedGroup] = useState<DMXProjectSceneGroup | null>(null);

    const [channelData, setChannelData] = useState<ChannelElement[]>([]);

    const {projectManager, setOverlayView, setProjectManager, saveProject} = useContext(AppControlContext);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const defaultGroup = projectManager.currentProject.scene_groups.find((e) => e.id === "main");
        setSelectedGroup(defaultGroup);
        setDevices(projectManager.currentProject.devices);
        setGroups(projectManager.currentProject.scene_groups);
    }, []);

    const deviceChannelChecked = async (deviceid: string, channel: number, value: number) => {
        const deviceById = devices.find((e) => e.id === deviceid);
        if (deviceById) {
            const existingElement = channelData.findIndex((e) => e.channel === deviceById.start_channel + channel - 1)
            if (existingElement > -1) {
                await setChannelData((e) => {
                    e[existingElement].value = value;
                    return e;
                })
            } else {

                await setChannelData((e) => {
                    e.push({
                        device_id: deviceid,
                        channel: deviceById.start_channel + channel - 1,
                        value: value
                    })
                    return e;
                });
            }
        }

        /*setDevices((old) => {
            const deviceById = old.find((e) => e.id === deviceid);
            if (deviceById) {
                deviceById.channel_state.find((e) => e.channel === channel).value = value;
            }
            return old;
        })*/
    }

    const deviceChannelUnchecked = async (deviceid: string, channels: number[]) => {

        const deviceById = devices.find((e) => e.id === deviceid);
        if (deviceById) {
            await setChannelData((e) => {
                const copy = [...e];
                for (var channel of channels) {
                    const elementIndex = copy.findIndex((item) => item.channel === deviceById.start_channel + channel - 1);
                    if (elementIndex > -1) {
                        copy.splice(elementIndex, 1)
                    }
                }
                return copy;
            })
        }
    }

    const deviceChannelValueChanged = async (deviceid: string, channel: number, value: number) => {
        const deviceById = devices.find((e) => e.id === deviceid);
        if (deviceById) {
            const elementIndex = channelData.findIndex((e) => e.channel === deviceById.start_channel + channel - 1)
            if (elementIndex > -1) {
                await setChannelData((e) => {
                    e[elementIndex].value = value;
                    return e;
                })
            }
        }
    }

    const saveScene = () => {
        setIsSaving(true);
        // remove spaces from scene name and check if its empty
        if (sceneName.replace(/\s/g, '') === "") {
            setIsSaving(false);
            return;
        }

        // we have a little problem here because in this view, we stored the channel states
        // in the wrong format:
        // array of { device_id, channel, value }
        //
        // we need this though:
        // { device_id, array:channels { channel, value }}
        //
        // this means we need to convert our format to the other one.

        var device_ids: string[] = [];
        var convertedDeviceStates: DMX_DeviceStateSnapshot[] = [];

        // To do that, we first get all device ids we want to store the channels of.
        // We make sure that duplicates are avoided

        for (var data of channelData) {
            if (device_ids.indexOf(data.device_id) === -1) {
                device_ids.push(data.device_id);
            }
        }

        // then we loop though these device ids and get all channel states that we want to store.
        // this will return an array of:
        // { device_id, channel, value }
        // we can ignore device_id, it's just what we filtered by.
        // We then convert that into the other format et voila, done!

        for (var id of device_ids) {
            const data_of_device = channelData.filter((e) => e.device_id === id);
            const deviceById = devices.find((e) => e.id === id);
            if (deviceById === undefined) continue;
            const snapshotValue: DMX_DeviceStateSnapshotChannelValue[] = data_of_device.map((e) => {
                const value: DMX_DeviceStateSnapshotChannelValue = {
                    channel: e.channel - deviceById.start_channel + 1,
                    value: e.value
                }
                return value;
            })
            convertedDeviceStates.push({
                device_id: id,
                channels: snapshotValue
            })
        }


        var packedScene: DMXProjectScene = {
            id: uuidv4(),
            name: sceneName,
            fadein_time: 0,
            device_states: convertedDeviceStates
        }

        setProjectManager((e) => {
            e.currentProject.scene_groups.find((group) => group.id === selectedGroup.id).scenes.push(packedScene);
            saveProject(e.currentProject);
            return e;
        });
        setIsSaving(false);
        setOverlayView(null);
    }

    return (
        <div
            className={"bg-gray-200 dark:bg-gray-800 shadow-2xl p-4 rounded-xl flex flex-col justify-between text-black dark:text-white"}
            style={{height: "80%", maxWidth: "60%"}}>
            <div className={"flex flex-col"} style={{height: "90%"}}>
                <div className={"mb-2"}>
                    <CloseButton buttonPressed={() => {
                        setOverlayView(null);
                    }} size={5}/>
                </div>
                <div>
                    <input placeholder={"New Scene"} value={sceneName}
                           className={`p-1 bg-gray-200 font-bold text-xl rounded-xl border border-gray-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600 ${sceneName.replace(/\s/g, '') === "" && sceneNameModified ? "border-red-500 dark:border-red-500" : ""}`}
                           onChange={(e) => {
                               setSceneNameModified(true);
                               setSceneName(e.target.value)
                           }}/>
                </div>
                <div className={"mt-2"}>
                    <div className={"flex flex-wrap pb-1"}>
                        {groups.map((group) => (
                            <GroupButtonElement key={group.id} name={group.name} color={group.color}
                                                isSelected={(selectedGroup?.id || "") === group.id} onSelect={() => {
                                setSelectedGroup(group)
                            }}/>
                        ))}
                    </div>
                </div>
                <h2 className={"mt-4 font-semibold mb-1"}>Devices</h2>
                <ul className={`p-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-gray-200 dark:bg-gray-700 overflow-y-scroll block ${styles.noscrollbar}`}
                    style={{listStylePosition: "inside"}}>
                    {devices.map((device) => (
                        <NewSceneOverlayDeviceCell key={device.id} device={device} onCheckEnable={async (d, c, v) => {
                            await deviceChannelChecked(d, c, v);
                        }} onCheckDisable={async (d, c) => {
                            await deviceChannelUnchecked(d, c);
                        }} onValueChange={async (d, c, v) => {
                            await deviceChannelValueChanged(d, c, v);
                        }}/>
                    ))}
                </ul>

            </div>
            <div className={"flex justify-end"}>
                {
                    isSaving ? (
                        <div className={" m-2"}>
                            <LoadingSpinner color={"#fff"} size={"30"}/>
                        </div>
                    ) : (
                        <button className={"bg-blue-500 rounded-xl px-4 py-2 text-white"}
                                onClick={saveScene}>Save</button>
                    )
                }
            </div>
        </div>
    )
}

interface NewSceneOverlayDeviceCell_Props {
    device: DMXProjectDevice;

    onCheckEnable(deviceid: string, channel: number, value: number);

    onCheckDisable(deviceid: string, channel: number[]);

    onValueChange(deviceid: string, channel: number, value: number);
}

interface NewSceneOverlayDeviceCellChannel {
    channel: number;
    name: string;
    value: number;
    checked: boolean;
}

enum NewSceneOverlayDeviceCellGlobalCheckState {
    none, between, all
}

const NewSceneOverlayDeviceCell: FunctionComponent<NewSceneOverlayDeviceCell_Props> = ({
                                                                                           device,
                                                                                           onCheckEnable,
                                                                                           onCheckDisable,
                                                                                           onValueChange
                                                                                       }) => {

    const [showChannels, setShowChannels] = useState<boolean>(false)
    const [channels, setChannels] = useState<NewSceneOverlayDeviceCellChannel[]>([]);

    const [checkState, setCheckState] = useState<NewSceneOverlayDeviceCellGlobalCheckState>(NewSceneOverlayDeviceCellGlobalCheckState.all);


    useEffect(() => {
        updateGlobalCheckmark()
    }, [channels]);

    const updateGlobalCheckmark = (_channels = channels) => {
        var channelsCopy = [..._channels];
        //channelsCopy.find((e) => e.channel === channel.channel).checked = checkState;

        const checkedChannels = channelsCopy.filter((e) => e.checked === true);
        const uncheckedChannels = channelsCopy.filter((e) => e.checked === false);

        if (checkedChannels.length === channelsCopy.length) {
            setCheckState(NewSceneOverlayDeviceCellGlobalCheckState.all);
        } else if (uncheckedChannels.length === channelsCopy.length) {
            setCheckState(NewSceneOverlayDeviceCellGlobalCheckState.none);
        } else {
            setCheckState(NewSceneOverlayDeviceCellGlobalCheckState.between);
        }

        for (var channel of _channels) {
            if (channel.checked) {
                console.log(channels.find((e) => e.channel === channel.channel));
                onCheckEnable(device.id, channel.channel, channels.find((e) => e.channel === channel.channel).value)
            } else {
                onCheckDisable(device.id, [channel.channel]);
            }
        }
    }

    useEffect(() => {
        setChannels((device.device as DeviceDefinition).modes[device.mode].channels.map((e) => {
            const obj: NewSceneOverlayDeviceCellChannel = {
                channel: e.channel,
                name: e.name,
                value: device.channel_state.find((f) => f.channel === e.channel).value,
                checked: false
            }
            return obj;
        }))
    }, []);


    return (
        <div className={"border-b border-gray-400 py-1"}>
            <div className={"flex items-center"}>
                <input type="checkbox" checked={checkState === NewSceneOverlayDeviceCellGlobalCheckState.all}
                       ref={input => {
                           if (input) {
                               input.indeterminate = checkState === NewSceneOverlayDeviceCellGlobalCheckState.between
                           }
                       }} onChange={(e) => {
                    setCheckState(e.target.checked ? NewSceneOverlayDeviceCellGlobalCheckState.all : NewSceneOverlayDeviceCellGlobalCheckState.none);
                    if (e.target.checked) {
                        for (var channel of channels) {
                            onCheckEnable(device.id, channel.channel, channel.value)
                        }
                    } else {
                        const allChannels = channels.map((e) => e.channel);
                        onCheckDisable(device.id, allChannels)
                    }
                    setChannels((oldState) => {
                        const newState = oldState.map(item => {
                            item.checked = e.target.checked
                            return item;
                        })
                        return newState;
                    })

                }}/>
                <button className={"flex items-center ml-1"} onClick={() => setShowChannels(!showChannels)}>
                    <div className={"mr-1"}>
                        {showChannels ? (
                            <ChevronDown size={15}/>
                        ) : (
                            <ChevronRight size={15}/>
                        )}
                    </div>
                    <div className={"flex items-center"}>

                        <p>{device.name}</p>
                        <p className={"text-sm text-gray-400 ml-2"}>Start Channel: {device.start_channel}</p>
                    </div>
                </button>
            </div>
            {showChannels ? (
                <div className={"mx-6"}>
                    {channels.map((channel, index) => (
                        <NewSceneOverlayDeviceCellChannelView key={JSON.stringify(channel)} channel={channel}
                                                              index={index} channelcount={channels.length}
                                                              onValueChange={(newvalue) => {
                                                                  setChannels((_channels) => {
                                                                      _channels.find((e) => e.channel === channel.channel).value = newvalue;
                                                                      return _channels;
                                                                  })
                                                                  onValueChange(device.id, channel.channel, newvalue);
                                                              }} onCheckChange={(checkState) => {
                            var channelsCopy = [...channels];
                            channelsCopy.find((e) => e.channel === channel.channel).checked = checkState;
                            updateGlobalCheckmark(channelsCopy)
                            if (checkState === true) {
                                onCheckEnable(device.id, channel.channel, channels.find((e) => e.channel === channel.channel).value)
                            } else {
                                onCheckDisable(device.id, [channel.channel]);
                            }


                            setChannels((_channels) => {
                                _channels.find((e) => e.channel === channel.channel).checked = checkState;
                                return _channels;
                            })
                        }}/>
                    ))}
                </div>
            ) : (
                <div/>
            )}
        </div>
    )
}

interface NewSceneOverlayDeviceCellChannelView_Props {
    channel: NewSceneOverlayDeviceCellChannel;
    index: number;
    channelcount: number;

    onValueChange: (value: number) => void;
    onCheckChange: (value: boolean) => void;
}

const NewSceneOverlayDeviceCellChannelView: FunctionComponent<NewSceneOverlayDeviceCellChannelView_Props> = ({
                                                                                                                 channel,
                                                                                                                 index,
                                                                                                                 channelcount,
                                                                                                                 onValueChange,
                                                                                                                 onCheckChange
                                                                                                             }) => {

    const [channelValue, setChannelValue] = useState(channel.value);
    const [channelChecked, setChannelChecked] = useState(channel.checked);

    useEffect(() => {
        setChannelValue(channel.value);
        setChannelChecked(channel.checked);
    }, [channel]);

    return (
        <div
            className={`${index !== channelcount - 1 ? "border-b border-gray-400 dark:border-gray-600" : ""} flex items-center justify-between`}>
            <div className={"flex items-center"}>
                <input type="checkbox" key={channelChecked ? "yes" : "no"} checked={channelChecked} onChange={(e) => {
                    setChannelChecked(e.target.checked);
                    onCheckChange(e.target.checked);
                    /*setChannels((_channel) => {
                        _channel.find((f) => f.channel === channel.channel).checked = e.target.checked;
                        return _channel;
                    })*/
                }} className={"mr-2"}/>
                <p className={"text-sm text-gray-400 mr-2"}>{channel.channel}</p>
                <p>{channel.name}</p>
            </div>
            <div className={"p-1"}>
                <input className={"bg-gray-300 dark:bg-gray-700 w-12 text-right rounded-lg"} type={"number"}
                       autoFocus={true} value={channelValue.toString()} onChange={(e) => {
                    var input = e.target.value;
                    if (input === "") {
                        input = "0";
                    }
                    const inputAsNumber = parseInt(input);
                    if (typeof inputAsNumber === "number" && !isNaN(inputAsNumber)) {
                        // check if value is between 0 and 255
                        if (inputAsNumber > -1 && inputAsNumber < 256) {
                            setChannelValue(inputAsNumber);
                            onValueChange(inputAsNumber);
                            /*setChannels((_channels) => {
                                _channels.find((f) => f.channel === channel.channel).value = inputAsNumber;
                                return _channels
                            })*/
                        }
                    }
                }}/>
            </div>
        </div>
    )
}

export default NewSceneOverlay;