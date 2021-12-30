interface DMX_DeviceStateSnapshot {
    deviceid: string;

}

interface DMX_DeviceStateSnapshotChannelValue {
    channel: number;
    value: number;
}

export default DMX_DeviceStateSnapshot
export type { DMX_DeviceStateSnapshotChannelValue }