import {NextPage} from "next";
import {useRouter} from "next/dist/client/router";
import {useContext, useEffect} from "react";
import {AppControlContext} from "../components/appContextProvider";
import dmxDevices, {getAllDevicesFromFolder} from "../devices/devicelist";

const Index: NextPage = () => {
    const router = useRouter();

    const randomTitles = [
        'Almost there!',
        'spinny loading animation, fun',
        'beep boop',
        'deploying deadly neurotoxin',
        'Powerup initiated',
        '$ rm -rf /',
        'ARE WE THERE YET???',
    ];

    const {projectManager} = useContext(AppControlContext);

    useEffect(() => {
        if (!router.isReady) return;
        initApp();
    }, [router.isReady]);

    async function initApp() {
        if (dmxDevices.length === 0) {
            getAllDevicesFromFolder();
        }
        if (projectManager.currentProject === null) {
            router.push("/home")
        } else {
            const returnto = router.query.returnto;
            if (typeof returnto === 'string') {
                router.push(returnto);
            } else {
                router.push('/dashboard');
            }
        }
    }

    return (
        <div className="flex overflow-hidden w-screen text-black h-screen justify-center items-center">
            <div className={"flex flex-col items-center"}>
                <img src="/svg/loading.svg" className="m-4 w-10"></img>
                <p className={"text-white"}>{randomTitles[
                    Math.floor(Math.random() * randomTitles.length)
                    ].toString()}</p>
            </div>
        </div>
    )
}

export default Index;