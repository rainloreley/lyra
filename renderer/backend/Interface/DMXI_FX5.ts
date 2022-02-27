import DMXInterface, {DMXMapElement, FoundInterface} from "./DMXInterface";
import {io, Socket} from "socket.io-client";
import axios from "axios";

class FX5Interface extends DMXInterface {

    static DMX_INTERFACE_VENDOR_ID = 1204;
    static DMX_INTERFACE_PRODUCT_ID = 3871;
    static DMX_INTERFACE_VENDOR_ID_2 = 5824;
    static DMX_INTERFACE_PRODUCT_ID_2 = 2187;

    public static FX5_HTTP_SERVER_PORT = 3018;
    public static FX5_WS_SERVER_PORT = 3019;

    socket: Socket;
    id: string;
    dmxMode: number;

    constructor(id: string) {
        super(id);
        // init DMX out map with 512 channels
        this.dmxoutmap = [];
        this.id = id;
        this.dmxMode = 0;
        this.socket = io("http://127.0.0.1:3019")

        for (var i = 0; i < 512; i++) {
            this.dmxoutmap.push({
                channel: i + 1,
                value: 0
            })
        }
    }

    public static isRunning(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            axios.get(`http://127.0.0.1:${FX5Interface.FX5_HTTP_SERVER_PORT}/`).then((result) => {
                if (result.data.status === "alive") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((_) => {
                resolve(false);
            });
        })
    }

    public static findInterfaces(): Promise<FoundInterface[]> {
        return new Promise<FoundInterface[]>((resolve, reject) => {

            axios.get(`http://127.0.0.1:${FX5Interface.FX5_HTTP_SERVER_PORT}/interfaces`).then((result) => {
                const mapped: FoundInterface[] = result.data.interfaces.map((e) => {
                    return {
                        id: e.path,
                        serial: e.serial,
                        name: "FX5 Interface",
                        type: "fx5"
                    }
                })
                resolve(mapped);
            }).catch((err) => {
                reject(err.message);
            })
        })
    }

    openLink(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            axios.post(`http://127.0.0.1:${FX5Interface.FX5_HTTP_SERVER_PORT}/open`, {
                path: this.id
            }).then((_) => {
                resolve(true);
            }).catch((err) => {
                reject(`${err} (${JSON.stringify(err.response.data.err)})`);
            })
        })
    }

    closeLink(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            axios.post(`http://127.0.0.1:${FX5Interface.FX5_HTTP_SERVER_PORT}/close`).then((_) => {
                resolve(true);
            }).catch((err) => {
                reject(`${err} (${JSON.stringify(err.response.data.err)})`)
            })
        })
    }

    setDMXMode(mode: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            axios.post(`http://127.0.0.1:${FX5Interface.FX5_HTTP_SERVER_PORT}/mode`, {
                mode: mode
            }).then((_) => {
                resolve(true);
            }).catch((err) => {
                reject(`${err} (${JSON.stringify(err.response.data.err)})`);
            })
        })
        /*if (!this.openInterface) {
            return false;
        }
        else {
            var buffer = Array(35).fill(0);
            // report ID
            buffer[0] = 0;
            // 16 = mode change
            buffer[1] = 16;
            // data
            buffer[2] = mode;
            var res = this.openInterface.write(buffer);
            if (res === 0) {
                return false;
            }
            else {
                // success :D
                return true;
            }
        }*/
    }

    sendDMX(channel: number, value: number) {
        this.dmxoutmap[channel - 1].value = value;
        this.socket.emit("setdmx", {channel: channel, value: value});
    }

    sendDMXMap(map: DMXMapElement[]) {
        this.socket.emit("setdmxmap", map);
        for (var channel of map) {
            this.dmxoutmap[channel.channel - 1].value = channel.value
        }
    }


}

export default FX5Interface;