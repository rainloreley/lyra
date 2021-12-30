import {NextPage} from "next";
import {useRouter} from "next/router";
import {ReactElement, useState} from "react";
import { v4 as uuidv4 } from "uuid";
import CloseButton from "../../components/small/close_button";
import DMXInterfaceSettings from "../../components/settings/pages/DMXInterfaceSettings";
import SettingsAbout from "../../components/settings/pages/SettingsAbout";

const SettingsIndex: NextPage = () => {
    const router = useRouter();

    const sidebarItems: SidebarItem[] = [
        {
            id: "001",
            title: "General",
            element: <p>Nothing here yet :(</p>
        },
        {
            id: "002",
            title: "DMX Interface",
            element: <DMXInterfaceSettings />
        },
        {
            id: "003",
            title: "About",
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
                                <button key={item.id} className={`mx-2 py-1 text-left mb-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedItem === item.id ? "bg-gray-100 dark:bg-gray-700" : ""}`} onClick={() => {
                                    setSelectedItem(item.id)
                                }}>
                                    <p className={"mx-2 text-md"}>{item.title}</p>
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
    element: ReactElement;
}

export default SettingsIndex;