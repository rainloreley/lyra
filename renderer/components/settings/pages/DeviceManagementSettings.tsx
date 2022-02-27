import {FunctionComponent, useContext, useEffect} from 'react';
import styles from '../../../styles/Dashboard_Sidebar.module.css';
import {AppControlContext,} from '../../appContextProvider';

const appData = require('app-data-folder');
const appDataFolder = appData('lyra');

const DeviceManagagementSettings: FunctionComponent = ({}) => {


    useEffect(() => {
        getRemoteDevices();
    }, []);

    /*function getInstalledDevices() {

    }*/

    function getRemoteDevices() {
    }

    return (
        <div
            className={`w-full h-screen overflow-y-scroll overflow-x-hidden ${styles.noscrollbar}`}
        >
            <div className={"mt-6 ml-4"}>
                <h1 className={"font-bold text-2xl"}>Device Management</h1>
            </div>
            <div className={"m-4 text-sm"}>
                <p>Download menu not ready yet. You can download LDF files and add them to this location:</p>
                <p className={"mt-2"}>{appDataFolder}/devices</p>
            </div>
        </div>
    );
};

export default DeviceManagagementSettings;
