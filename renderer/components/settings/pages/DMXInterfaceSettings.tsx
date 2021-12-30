import {FunctionComponent, useContext, useEffect, useState} from "react";
import DMXInterface, {FoundInterface} from "../../../backend/Interface/DMXInterface";
import FX5Interface from "../../../backend/Interface/DMXI_FX5";
import {useRouter} from "next/dist/client/router";
import {AppControlContext, NotificationCenterElement, NotificationCenterElementStatus} from "../../appContextProvider";
import {v4 as uuidv4} from "uuid";
import DeviceDropdown from "../../device_components/dropdown";
import {DDMUICCDropdownOptionType} from "../../../devices/device_definitions";
import DMXFX5Settings from "./DMXInterfaceSettings/FX5Settings";
import styles from "../../../styles/Dashboard_Sidebar.module.css"
import {CheckCircle} from "react-feather";
import {set as setCookie, remove as removeCookie} from 'es-cookie';


const DMXInterfaceSettings: FunctionComponent = ({}) => {

    const router = useRouter();

    const { projectManager, setProjectManager, addNotification } = useContext(AppControlContext);

    const [interfaceServers, setInterfaceServers] = useState<InterfaceServerEntry[]>([
        {
            id: "fx5",
            name: "Digital Enlightenment/FX5",
            status: InterfaceServerStatus.unknown,
            handler: FX5Interface
        }
    ]);

    const [availableInterfaces, setAvailableInterfaces] = useState<FoundInterface[]>([]);

    const [ selectedInterface, setSelectedInterface ] = useState<FoundInterface | null>(null);


    useEffect(() => {
        if (router.isReady) {
            checkServerStatus()
            getAvailableInterfaces();
        }
    }, [router.isReady]);

    const checkServerStatus = async () => {
        for (var server of interfaceServers) {
            const status = await server.handler.isRunning();
            setInterfaceServers((e) => {
                e.find((i) => i.id === server.id).status = status == true ? InterfaceServerStatus.running : InterfaceServerStatus.dead
                const newarray = [... e];
                return newarray;
            })
        }
    }

    const getAvailableInterfaces = async () => {

        var interfaces: FoundInterface[] = [];
        for (var server of interfaceServers) {
            var foundInterfaces: FoundInterface[] = [];
            if (server.id == "fx5") {
                foundInterfaces = await FX5Interface.findInterfaces();
                console.log(foundInterfaces)
                interfaces = interfaces.concat(foundInterfaces)
            }
        }
        console.log(interfaces);
        setAvailableInterfaces(interfaces);
        const selectedInterfaceObject = interfaces.find((e) => e.id === projectManager.interface?.id)
        if (selectedInterfaceObject) {
            setSelectedInterface(selectedInterfaceObject)
        }
    }

    const switchSelectedInterface = async (id: string) => {
        if (projectManager.interface !== undefined) {
            try {
                await projectManager.interface.closeLink()
                projectManager.interface = undefined;
            }
            catch(err) {
                const notification: NotificationCenterElement = {
                    uid: uuidv4(),
                    text: err,
                    status: NotificationCenterElementStatus.error,
                    dismissAt: Date.now() + 3000
                }
                addNotification(notification)
                return;
            }

        };
        if (selectedInterface?.id === id) {
            removeCookie("dmxInterface");
            setSelectedInterface(null);
            return;
        }
        const newInterface = availableInterfaces.find((e) => e.id === id);
        if (newInterface) {
            if (newInterface.type === "fx5") {

                projectManager.interface = new FX5Interface(newInterface.id)
                    try {
                        const openResult = await projectManager.interface.openLink();
                    if (openResult) {
                        setSelectedInterface(availableInterfaces.find((e) => e.id === id));
                        setCookie("dmxInterface", JSON.stringify({type: newInterface.type, serial: newInterface.serial, mode: (projectManager.interface as FX5Interface).dmxMode}), {expires: 365})
                    }
                }
                catch(err) {
                    const notification: NotificationCenterElement = {
                        uid: uuidv4(),
                        text: err,
                        status: NotificationCenterElementStatus.error,
                        dismissAt: Date.now() + 3000
                    }
                    addNotification(notification)
                }
            }
            else {
                console.error("Interface not supported!")
            }
        }
    }

    /*const switchSelectedInterface = (newid: string) => {
        const oldInterface = availableInterfaces.find((e) => e.id === selectedInterface);
        if (projectManager.interface !== undefined && oldInterface) {
            projectManager.interface.closeLink(oldInterface.path);
        }
        const newInterface = availableInterfaces.find((e) => e.id === newid);
        if (newInterface) {
            setProjectManager((e) => {
                e.interface = new newInterface.handler;
                e.interface.openLink(newInterface.path);
                return e;
            })
        }
    }*/


    return (
        <div className={`w-full h-screen overflow-y-scroll overflow-x-hidden ${styles.noscrollbar}`}>
            <div className={"mt-6 ml-4"}>
                <h1 className={"font-bold text-2xl"}>DMX Interface Settings</h1>
            </div>
            <div className={"mx-6 my-4"}>
                <div>
                    <h2 className={"font-semibold text-lg"}>Status of Servers</h2>
                    <ul className={"mx-1"}>
                        {interfaceServers.map((server) => (
                            <div key={server.id} className={"flex"}>

                                {
                                    // @ts-ignore
                                    {
                                        0: (
                                            <div className={"self-center w-4 h-4 rounded-full bg-red-500"} />
                                        ),
                                        1: (
                                            <div className={"self-center w-4 h-4 rounded-full bg-gray-500"} />
                                        ),
                                        2: (
                                            <div className={"self-center w-4 h-4 rounded-full bg-green-500"} />
                                        )

                                    }[server.status]
                                }
                                <p className={"ml-2"}>{server.name}</p>
                            </div>
                        ))}
                    </ul>
                </div>
                <div className={"mt-4"}>
                    <h2 className={"font-semibold text-lg"}>Available Interfaces</h2>
                    <div className={"mx-1 mt-2"}>
                        {availableInterfaces.length > 0 ? (
                            <ul>
                                {availableInterfaces.map((_interface) => (
                                    <button className={`bg-gray-200 dark:bg-gray-800 rounded-lg text-left p-2 ${selectedInterface?.id === _interface.id}`} onClick={() => {
                                        switchSelectedInterface(_interface.id)
                                    }}>
                                        <div className={"flex"}>
                                            {_interface.id === selectedInterface?.id ? (
                                                <CheckCircle className={"self-center mr-2"} size={18} color={"#22c55e"} />

                                            ) : (<div></div>)}
                                            <div className={"flex flex-col"}>
                                                <h3 className={"text-md font-semibold"}>{_interface.name}</h3>
                                                <p className={"italic text-sm text-gray-500"}>{_interface.serial}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </ul>
                        ) : (
                            <div>
                                <p>No Interfaces available</p>
                            </div>
                        )}
                        <button className={"bg-blue-500 rounded-xl px-4 py-2 text-white mt-4"} onClick={async () => {
                            await getAvailableInterfaces();
                        }}>Scan</button>
                    </div>

                </div>
                {selectedInterface !== null ? (
                    <div className={"mt-8"}>
                        {selectedInterface.type == "fx5" ? (
                            <DMXFX5Settings selectedInterface={selectedInterface} />
                        ) : (
                            <p>Interface not supported!</p>
                        )}

                    </div>
                ) : (<div />)}
            </div>
        </div>
    )
}

interface InterfaceServerEntry {
    id: string;
    name: string;
    status: InterfaceServerStatus;
    handler: typeof DMXInterface;
}

enum InterfaceServerStatus {
    dead, unknown, running
}

interface AvailableInterfaceEntry {
    id: string;
    name: string;
    serial: string;
    handler: typeof DMXInterface;
}

export default DMXInterfaceSettings;