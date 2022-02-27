import {ipcRenderer} from 'electron';
import React, {createContext, Dispatch, ReactElement, SetStateAction, useEffect, useState} from 'react';
import {clearInterval} from 'timers';
import LoadingSpinner from './loadingSpinner';
import {v4 as uuidv4} from 'uuid';
import ProjectManager from "../backend/ProjectManager";
import fs from "fs";
import DMXProject from "../backend/structs/DMXProject";
import {useRouter} from "next/dist/client/router";
import {io} from "socket.io-client";

type AppControlHandlerProps = {
    projectManager: ProjectManager;
    setProjectManager: Dispatch<SetStateAction<ProjectManager>>;
    addNotification: (element: NotificationCenterElement) => void;
    sendDMXCommand: (start_channel: number, channel: number, value: number) => void;
    sendDMXMap: (map: DMXMapElement[]) => void;
    saveProject: (_project: DMXProject) => void;
    setOverlayView: Dispatch<SetStateAction<ReactElement>>;
    deleteDevice: (_deviceid: string) => void;
    executeScene: (map: DMXMapElement[], time: number) => void;

};

interface NotificationCenterElement {
    uid: string;
    text: string;
    status: NotificationCenterElementStatus;
    dismissAt?: number;
}

enum NotificationCenterElementStatus {
    loading,
    notification,
    error,
    success,
}

export const AppControlContext = createContext<AppControlHandlerProps>(null);

const AppControlProvider = ({children}) => {
    const [notificationCenter, setNotificationCenter] = useState<NotificationCenterElement[]>([]);

    const router = useRouter();

    var notificationcenterInterval: NodeJS.Timeout;
    var autosaveInterval: NodeJS.Timeout;

    // fill an array with 512 entries
    // @ts-ignore
    const [dmxoutmap, setdmxoutmap] = useState<DMXMapElement[]>([... Array(512).keys()].map((i) => {
        return {
            channel: i + 1,
            value: 0
        }
    }));


    const [projectManager, setProjectManager] = useState<ProjectManager>(new ProjectManager());
    const [overlayView, setOverlayView] = useState<ReactElement | null>(null);


    useEffect(() => {
        /*for (var i = 0; i < 512; i++) {
            dmxoutmap.push({
                channel: i + 1,
                value: 0
            })
        }*/
        clearInterval(notificationcenterInterval);
        clearInterval(autosaveInterval);
        notificationcenterInterval = setInterval(() => {
            /*const newNotificationArray = notificationCenter.filter(
                (e) => e.dismissAt === undefined || e.dismissAt > Date.now()
            );*/
            setNotificationCenter((e) => [
                ...e.filter(
                    (f) => f.dismissAt === undefined || f.dismissAt > Date.now()
                ),
            ]);
        }, 1000);

        autosaveInterval = setInterval(() => {
            if (typeof projectManager.currentProject?.uid === "string") {
                saveProject(projectManager.currentProject)

            }

        }, 20000);

        ipcRenderer.on("shortcut::save-project", () => {
            if (typeof projectManager.currentProject?.uid === "string") {
                saveProject(projectManager.currentProject);
            }
        });

        ipcRenderer.on("shortcut::open-new-device", () => {
            if (typeof projectManager.currentProject?.uid === "string") {
                router.push("/projectmanagement/addDevice");
            }
        });

        ipcRenderer.on("shortcut::open-settings", () => {
            if (typeof projectManager.currentProject?.uid === "string") {
                router.push("/settings");
            }
        });

        ipcRenderer.on("shortcut::save-and-close-project", () => {
            if (projectManager.currentProject !== undefined) {
                saveProject(projectManager.currentProject)
                setProjectManager(new ProjectManager());
                router.push("/")
            }
        })

        ipcRenderer.on('show-error', (event, error) => {
            const notification: NotificationCenterElement = {
                uid: uuidv4(),
                text: error,
                status: NotificationCenterElementStatus.error,
                dismissAt: Date.now() + 3000,
            };
            addElementToNotificationCenter(notification);
        });


    }, []);

    function addElementToNotificationCenter(element: NotificationCenterElement) {
        setNotificationCenter((e) => [...e, element]);
    }

    function updateElementInNotificationCenter(
        element: NotificationCenterElement
    ) {
        setNotificationCenter((e) => {
            const index = e.findIndex((f) => f.uid === element.uid);
            if (index > -1) e[index] = element;
            return e;
        });
    }

    function sendDMXCommand(start_channel: number, channel: number, value: number) {
        if (projectManager.interface !== undefined) {
            projectManager.interface.sendDMX(start_channel + channel - 1, value);
        }
        setdmxoutmap((e) => {
            e[channel - 1].value = value;
            return e;
        })
        console.log(dmxoutmap[channel - 1].value)
        console.log(dmxoutmap[channel - 1].channel)
        setProjectManager((e) => {
            e.currentProject.devices.find((device) => device.start_channel === start_channel).channel_state.find((state) => state.channel === channel).value = value;
            return e;
        })
    }

    function sendDMXMap(map: DMXMapElement[]) {
        if (projectManager.interface !== undefined) {
            projectManager.interface.sendDMXMap(map.map((e) => {
                const obj = {
                    channel: e.channel,
                    value: e.value
                }
                return obj;
            }));
        }

        setProjectManager((e) => {
            for (var map_element of map) {
                setdmxoutmap((e) => {
                    e[map_element.channel - 1].value = map_element.value;
                    return e;
                });
                const device = e.currentProject.devices.find((e) => e.channel_state.find((f) => f.channel === map_element.channel) !== undefined)
                //const device = e.currentProject.devices.find((e) => e.id === map_element.device);
                if (device) {
                    device.channel_state.find((e) => e.channel === map_element.channel - device.start_channel + 1).value = map_element.value;
                }
            }
            return e;
        })


    }

    function deleteDevice(_deviceid: string) {
        const deviceIndex = projectManager.currentProject.devices.findIndex((e) => e.id === _deviceid);
        if (deviceIndex > -1) {
            projectManager.currentProject.devices.splice(deviceIndex, 1);
        }
        for (var scenegroup of projectManager.currentProject.scene_groups) {
            for (var scene of scenegroup.scenes) {
                const sceneDeviceIndex = scene.device_states.findIndex((e) => e.device_id === _deviceid);
                if (sceneDeviceIndex > -1) {
                    scene.device_states.splice(sceneDeviceIndex, 1);
                }
            }
        }

        saveProject(projectManager.currentProject)

    }

    function saveProject(_project: DMXProject) {
        const notificationElement: NotificationCenterElement = {
            uid: uuidv4(),
            text: 'Saving project',
            status: NotificationCenterElementStatus.loading,
        };
        addElementToNotificationCenter(notificationElement);


        try {

            const project = new DMXProject(_project, false)

            // update the modified date
            project.last_modified = Date.now();

            // replace device variables with uuid of device definition file
            project.devices.forEach((device) => {
                if (typeof device.device !== "string") {
                    const devicecopy = {...device.device};
                    device.device = devicecopy.uuid;
                }
            })

            // save the file
            fs.writeFileSync(projectManager.projectFilePath, JSON.stringify(project), {encoding: "utf-8"});

            const newNotificationElement: NotificationCenterElement = {
                uid: notificationElement.uid,
                text: 'Project saved!',
                dismissAt: Date.now() + 3000,
                status: NotificationCenterElementStatus.success,
            };
            updateElementInNotificationCenter(newNotificationElement);

        } catch (err) {
            const newNotificationElement: NotificationCenterElement = {
                uid: notificationElement.uid,
                text: err.message ?? "Project couldn't be saved",
                status: NotificationCenterElementStatus.error,
                dismissAt: Date.now() + 3000
            }
            updateElementInNotificationCenter(newNotificationElement)
        }
    }

    function executeScene(map: DMXMapElement[], time: number) {
        if (time < 100) {
            sendDMXMap(map);
        }
        else {
            linearDMXFade(map, time);
        }
    }

    function linearDMXFade(to: DMXMapElement[], time: number) {
        const repeatingTime = 50 // repeat function every 50 ms
        const requiredIterations = time / repeatingTime; // repeat function this often
        var passedIterations = 0; // value how often a function has been called

        var channelsToChange: AnimationDMXMapElement[] = [];
        for (var i = 0; i < 512; i++) {
            if (dmxoutmap[i].value !== to[i].value) {

                // this value contains the amount the value of a certain channel needs to be increased to reach the target value after `requiredIterations`-times
                const stepsToTake = (to[i].value - dmxoutmap[i].value) / requiredIterations;

                channelsToChange.push({
                    channel: i + 1,
                    initialValue: dmxoutmap[i].value,
                    targetValue: to[i].value,
                    currentValue: dmxoutmap[i].value,
                    stepsToTake: stepsToTake
                })
            }
        }


        var animation = setInterval(() => {
            // if the function has been called often enough, cancel it
            if (passedIterations >= requiredIterations) {
                clearInterval(animation);
                return;
            }

            for (var channel of channelsToChange) {
                channel.currentValue += channel.stepsToTake;
                sendDMXCommand(1, channel.channel, channel.currentValue);
            }

            passedIterations += 1;
        }, repeatingTime)
    }

    const state: AppControlHandlerProps = {
        projectManager: projectManager,
        setProjectManager: setProjectManager,
        addNotification: addElementToNotificationCenter,
        sendDMXCommand: sendDMXCommand,
        sendDMXMap: sendDMXMap,
        saveProject: saveProject,
        setOverlayView: setOverlayView,
        deleteDevice: deleteDevice,
        executeScene: executeScene
    }

    return (
        <div className={"h-screen w-screen overflow-hidden dark:text-white bg-gray-100 dark:bg-gray-900"}>


            <div
                className={`flex flex-col h-screen w-screen overflow-hidden `}
            >

                <AppControlContext.Provider value={state}>

                    <div className={"h-screen relative overflow-hidden"}>
                        <div className="absolute bottom-6 right-6 flex z-20 text-white flex-col">
                            {notificationCenter.map((notification) => (
                                <div
                                    key={notification.uid}
                                    className={`m-4 flex flex-row p-3 rounded-lg w-64 justify-between pl-4 ${
                                        notification.status === NotificationCenterElementStatus.error
                                            ? 'bg-red-500'
                                            : `${
                                                notification.status ===
                                                NotificationCenterElementStatus.success
                                                    ? 'bg-green-400'
                                                    : 'bg-gray-400 dark:bg-gray-600'
                                            }`
                                    }`}
                                >
                                    <p>{notification.text}</p>
                                    {notification.status ===
                                    NotificationCenterElementStatus.loading ? (
                                        <div className="w-5 ml-4 mr-2">
                                            <LoadingSpinner color="#ffffff" size={'25'}/>
                                        </div>
                                    ) : (
                                        <div/>
                                    )}
                                </div>
                            ))}
                        </div>
                        {overlayView !== null ? (
                            <div className={"h-screen w-screen absolute top-0 z-10 bottom-0 left-0 right-0"}>
                                <div className={"flex w-full h-full justify-center items-center"}>
                                    {overlayView}
                                </div>
                            </div>
                        ) : (
                            <div/>
                        )}


                        <div className={`${overlayView !== null ? "filter blur-md scale-105 transform" : ""}`}>
                            {children}
                        </div>
                    </div>

                </AppControlContext.Provider>
            </div>
        </div>
    );
};

interface DMXMapElement {
    channel: number;
    //device: string;
    value: number;
}

interface AnimationDMXMapElement {
    channel: number;
    initialValue: number;
    targetValue: number;
    currentValue: number;
    stepsToTake: number;
}

export type {NotificationCenterElement, DMXMapElement};
export {NotificationCenterElementStatus};
export default AppControlProvider;
