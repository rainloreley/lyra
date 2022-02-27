interface DMX_DeviceStateSnapshot {
    device_id: string;
    channels: DMX_DeviceStateSnapshotChannelValue[];

}

interface DMX_DeviceStateSnapshotChannelValue {
    channel: number;
    value: number;
}

export default DMX_DeviceStateSnapshot
export type {DMX_DeviceStateSnapshotChannelValue}