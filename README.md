<p align="center"><img  width="120px" src="/build/icon.png"></p>
<div>
<h1 align="center">Lyra</h1>
<h2 align="center">Open-Source DMX light control software</h2>
</div>

<p align="center"><b>This software is in development and may not work properly yet</b></p>

## Installation

_not ready yet, you have to build it from source_

```bash
git clone https://github.com/rainloreley/lyra lyra
cd lyra
yarn
yarn dev # or yarn build if you want a production build
```

## Supported devices

After a recent update ([b85aac6](https://github.com/rainloreley/lyra/commit/b85aac6f1bc037f4d964e6d7c4c92d7e702905b3)) it's now possible to add custom device config files in Lyras' app data folder:

|  OS     | Path                                                       |
| ------- | ---------------------------------------------------------- |
| macOS   | `/Users/username/Library/Application Support/lyra/devices` |
| Windows | `C:\Users\username\AppData\Roaming\lyra\devices`           |
| Linux   | `/home/username/.lyra/devices`                             |

A documentation for these `.ldf` files can be found [here](https://wiki.lory.dev/en/lyra/ldf-files)

Click on one of the devices below to download its `.ldf` file

- (Stairville MH-X50+ LED Spot) currently unavailable
- [Stairville LED Flood TRI Panel 7x3W RGB](https://dl.abmgrt.dev/lyra/device_configs/Stairville_LEDFloodTRIPanel7x3WRGB.ldf)
- [Generic Dimmer](https://dl.abmgrt.dev/lyra/device_configs/GenericDimmer.ldf)

## Supported DMX interfaces

1. The only supported DMX Interface is the FX5 USB DMX Interface. More interfaces may be added in the future (lyra can be used without an interface)

## License

The project is licensed under the [MIT license](LICENSE)
