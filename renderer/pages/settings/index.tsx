import {NextPage} from "next";
import {useRouter} from "next/router";
import {ReactElement, useState} from "react";
import { v4 as uuidv4 } from "uuid";
import CloseButton from "../../components/small/close_button";
import DMXInterfaceSettings from "../../components/settings/pages/DMXInterfaceSettings";
import SettingsAbout from "../../components/settings/pages/SettingsAbout";
import DeviceManagagementSettings from "../../components/settings/pages/DeviceManagementSettings";
import USBPortIcon from "../../components/icons/usb-port";
import MovingHeadIcon from "../../components/icons/moving-head";
import SettingsIcon from "../../components/icons/settings";
import {Info, Settings} from "react-feather";

const SettingsIndex: NextPage = () => {
    const router = useRouter();

    const sidebarItems: SidebarItem[] = [
        {
            id: "001",
            title: "General",
            icon: <Settings width={"20px"} />,
            element: <p>Nothing here yet :(</p>
        },
        {
            id: "002",
            title: "Device Management",
            icon: <MovingHeadIcon />,
            element: <DeviceManagagementSettings />
        },
        {
            id: "003",
            title: "DMX Interface",
            icon: <USBPortIcon />,
            element: <DMXInterfaceSettings />
        },
        {
            id: "004",
            title: "About",
            icon: <Info width={"20px"} />,
            element: <SettingsAbout />
        }
    ]

    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    return(
        <div className={"overflow-hidden w-screen text-black h-screen"}>
            <div className={"flex dark:bg-gray-900 bg-gray-100 h-screen w-screen overflow-hidden dark:text-white"}>
                <div className={"h-screen w-72 bg-gray-200 dark:bg-gray-800 rounded-r-xl"}>
                    <div className={"mt-4 ml-2"}>
                        <CloseButton buttonPressed={() => {
                            router.push("/")
                        }}  size={5} />
                    </div>
                    <div className={"mt-2 mx-4"}>
                        <h1 className={"font-bold text-2xl"}>Settings</h1>
                    </div>
                    <div className={"mt-4"}>
                        <ul className={"flex flex-col"}>
                            {sidebarItems.map((item) => (
                                <button key={item.id} className={`mx-2 h-8 py-1 text-left mb-2 flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedItem === item.id ? "bg-gray-100 dark:bg-gray-700" : ""}`} onClick={() => {
                                    setSelectedItem(item.id)
                                }}>
                                    <div className={"w-5 mx-2"}>
                                        {item.icon}
                                    </div>
                                    <p className={"mx-2 text-sm"}>{item.title}</p>
                                </button>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={"w-full"}>
                    {selectedItem !== null ? (
                        <div>
                            {sidebarItems.find((e) => e.id === selectedItem).element}
                        </div>

                    ) : (<div></div>)}
                </div>
            </div>
        </div>
    )
}

interface SidebarItem {
    id: string;
    title: string;
    icon: ReactElement;
    element: ReactElement;
}

export default SettingsIndex;