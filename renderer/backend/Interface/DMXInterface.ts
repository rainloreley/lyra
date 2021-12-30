abstract class DMXInterface {

    dmxoutmap: DMXMapElement[] = [];
    id: string;

    constructor(id: string) {
        this.id = id;

    }


    public static findInterfaces(): Promise<FoundInterface[]> { return};
    public static isRunning(): Promise<boolean> {return};
    openLink(): Promise<boolean> {return};
    closeLink(): Promise<boolean> {return};
    sendDMX(channel: number, value: number) {};

}

interface DMXMapElement {
    channel: number;
    value: number;
}

interface FoundInterface {
    id: string;
    name: string;
    serial: string;
    type: string;
}

export type {DMXMapElement, FoundInterface};
export default DMXInterface;