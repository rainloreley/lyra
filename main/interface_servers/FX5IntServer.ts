import {Server} from "socket.io";
import HID from "node-hid";
import express from "express";
import cors from "cors";

class FX5IntServer {

    static DMX_INTERFACE_VENDOR_ID = 1204;
    static DMX_INTERFACE_PRODUCT_ID = 3871;
    static DMX_INTERFACE_VENDOR_ID_2 = 5824;
    static DMX_INTERFACE_PRODUCT_ID_2 = 2187;

    // server stuff
    io?: Server;
    expApp;


    openInterface?: HID.HID;
    dmxoutmap: DMXMapElement[] = [];

    constructor() {
        this.io = undefined;
        this.dmxoutmap = [];
        for (var i = 0; i < 512; i++) {
            this.dmxoutmap.push({
                channel: i + 1,
                value: 0
            })
        }
    }

    findInterfaces(): object[] {
        try {
            const hidDevices = HID.devices()
            var interfaces: object[] = [];
            for (var device of hidDevices) {
                // check if device is an FX5 DMX interface
                if ((device.vendorId === FX5IntServer.DMX_INTERFACE_VENDOR_ID && device.productId === FX5IntServer.DMX_INTERFACE_PRODUCT_ID) || (device.vendorId === FX5IntServer.DMX_INTERFACE_VENDOR_ID_2 && device.productId === FX5IntServer.DMX_INTERFACE_PRODUCT_ID_2)) {
                    interfaces.push({
                        path: device.path,
                        serial: device.serialNumber
                    })
                }
            }
            return interfaces;
        } catch (err) {
            return [];
        }
    }

    openLink(path: string): boolean {
        try {
            this.openInterface = new HID.HID(path);
            return true;
        } catch {
            return false;
        }
    }

    setDMXMode(mode: number): boolean {
        try {
            if (!this.openInterface) {
                return false;
            } else {
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
                } else {
                    // success :D
                    return true;
                }
            }
        } catch {
            return false;
        }
    }

    sendDMX(channel?: number, value?: number) {
        try {
            if (typeof channel === "number" && typeof value === "number") {
                this.dmxoutmap.find((e) => e.channel === channel).value = value;
            }
            for (var i = 0; i < 16; i++) {
                var buffer = Array(34).fill(0);
                buffer[0] = 0;
                buffer[1] = i;
                for (var j = 2; j < 34; j++) {
                    buffer[j] = this.dmxoutmap.find((e) => e.channel === (i * 32) + j - 1).value;
                }
                const res = this.openInterface.write(buffer);
            }
        } catch {

        }
    }


    start() {
        this.expApp = express();
        this.expApp.use(require("body-parser").json())
        this.expApp.use(cors());
        this.expApp.get("/", this._httpAlivePingHandler.bind(this));
        this.expApp.get("/interfaces", this._httpFindInterfacesHandler.bind(this));
        this.expApp.post("/open", this._httpOpenLinkInterfacesHandler.bind(this));
        this.expApp.post("/close", this._httpCloseLinkInterfacesHandler.bind(this));
        this.expApp.post("/mode", this._httpSetDMXModeHandler.bind(this));
        this.expApp.listen(3018, "localhost", () => {
            console.log("Express server for node FX5 running")
        })

        this.io = new Server({
            cors: {
                origin: ["http://localhost:8888"],
            }
        });
        this.io.listen(3019,)
        this.io.on("connection", (socket) => {

            socket.on("setdmx", (arg1) => {
                if (typeof arg1 === "object" && typeof arg1.channel === "number" && typeof arg1.value === "number") {
                    this.sendDMX(arg1.channel, arg1.value);
                }
            });

            socket.on("setdmxmap", (arg1) => {
                this.dmxoutmap = arg1;
                this.sendDMX()
            })
        })
    }

    close() {
        if (this.openInterface !== undefined) {
            this.setDMXMode(0);
            try {
                this.openInterface.close();
            } catch (err) {
            }
        }
    }

    _httpAlivePingHandler(req, res) {
        res.status(200).json({status: "alive"})
    }

    _httpFindInterfacesHandler(req, res) {
        const availableInterfaces = this.findInterfaces();
        res.status(200).json({interfaces: availableInterfaces})
    }

    _httpOpenLinkInterfacesHandler(req, res) {
        const {path} = req.body;
        if (typeof path !== "string") {
            return res.status(400).json({err: "badRequest"})
        }
        const openRes = this.openLink(path);
        if (openRes) {
            res.status(200).json({})
            return;
        } else {
            res.status(500).json({err: "operationFailed"})
        }

    }

    _httpCloseLinkInterfacesHandler(req, res) {
        this.setDMXMode(0);
        try {
            this.openInterface.close();
            res.status(200).json({})
        } catch (err) {
            res.status(500).json({err: err})
        }

    }

    _httpSetDMXModeHandler(req, res) {
        const {mode} = req.body;
        if (typeof mode !== "number") {
            return res.status(400).json({err: "badRequest"});

        }
        const modeRes = this.setDMXMode(mode);
        if (modeRes) {
            res.status(200).json({});
        } else {
            res.status(500).json({err: "operationFailed"})
        }
    }


}

interface DMXMapElement {
    channel: number;
    value: number;
}

export default FX5IntServer