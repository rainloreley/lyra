import { app, dialog, Menu } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { ipcMain, shell } from 'electron';
import fs from "fs";
import FX5IntServer from "./interface_servers/FX5IntServer";
import {NotificationCenterElement, NotificationCenterElementStatus} from "../renderer/components/appContextProvider";
//require('@electron/remote/main').initialize()

const isProd: boolean = process.env.NODE_ENV === 'production';

var Server_FX5: FX5IntServer;

if (isProd) {
	serve({ directory: 'app' });
} else {
	app.setPath('userData', `${app.getPath('userData')} (development)`);
}
var mainWindow: Electron.CrossProcessExports.BrowserWindow;
(async () => {
	await app.whenReady();

	mainWindow = createWindow('main', {
		width: 1000,
		height: 600,
		webPreferences: { nodeIntegration: true, contextIsolation: false }

	});

	const appMenu: Menu = Menu.buildFromTemplate([
		{
			role: "appMenu"
		},
		{
			label: "Project",
			submenu: [
				{
					label: "Save",
					accelerator: "Cmd+S",
					click: () => {
						mainWindow.webContents.send("shortcut::save-project")
					}
				},
				{
					label: "Add device",
					accelerator: "Cmd+Shift+N",
					click: () => {
						mainWindow.webContents.send("shortcut::open-new-device")
					}
				},
				{
					label: "Settings",
					click: () => {
						mainWindow.webContents.send("shortcut::open-settings")
					}
				},
				{
					label: "Save and close project",
					click: () => {
						mainWindow.webContents.send("shortcut::save-and-close-project")
					}
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					role: 'undo',
				},
				{
					role: 'redo',
				},
				{
					type: 'separator',
				},
				{
					role: 'cut',
				},
				{
					role: 'copy',
				},
				{
					role: 'paste',
				},
			],
		},

		{
			label: 'View',
			submenu: [
				{
					label: 'Show scene list',
					click: () => {
						mainWindow.webContents.send('dashboard-show-scene-list');
					},
				},
				{
					type: "separator"
				},
				{
					role: 'reload',
				},
				{
					role: 'toggleDevTools',
				},
				{
					type: 'separator',
				},
				{
					role: 'resetZoom',
				},
				{
					role: 'zoomIn',
				},
				{
					role: 'zoomOut',
				},
				{
					type: 'separator',
				},
				{
					role: 'togglefullscreen',
				},
			],
		},

		{
			role: 'window',
			submenu: [
				{
					role: 'minimize',
				},
				{
					role: 'close',
				},
			],
		},

		{
			role: 'help',
			submenu: [
				{
					label: 'Learn More',
				},
			],
		},
	])

	Menu.setApplicationMenu(appMenu);


	Server_FX5 = new FX5IntServer();
	Server_FX5.start();

//	require("@electron/remote/main").enable(mainWindow.webContents)

	if (isProd) {
		await mainWindow.loadURL('app://./index.html');
	} else {
		const port = process.argv[2];
		await mainWindow.loadURL(`http://localhost:${port}/`);
		mainWindow.webContents.openDevTools();
	}

	ipcMain.on("app::open-file", () => {
		dialog
			.showOpenDialog({
				properties: ['openFile'],
				filters: [{ extensions: ['lyra'], name: 'Lyra' }],
			})
			.then((result) => {
				if (!result.canceled) {
					mainWindow.webContents.send("app::project-file-loaded", result.filePaths[0])
					//ipcMain.emit("app::project-file-loaded", result.filePaths[0])
				}
			});
	})

	ipcMain.on("app::save-file-dialog", (event, data) => {
		dialog.showSaveDialog({
			defaultPath: `~/${data}.lyra`,
			filters: [{ extensions: ['lyra'], name: 'Lyra' }],
		}).then((result) => {
			if (!result.canceled) {
				mainWindow.webContents.send("app::save-file-done", result.filePath);
			}
		}).catch((err) => {
			console.log(err)
		})
	})

	mainWindow.webContents.on('new-window', function(event, url){
		event.preventDefault();
		shell.openExternal(url);
	});


})();

ipcMain.on("app::get-version", () => {
	mainWindow.webContents.send("app::version", app.getVersion())
})

ipcMain.on('open-file-dialog', () => {
	dialog
		.showOpenDialog({
			properties: ['openFile'],
			filters: [{ extensions: ['lyra'], name: 'Lyra' }],
		})
		.then((result) => {
			if (!result.canceled) {
				try {
					const fileResult = fs.readFileSync(result.filePaths[0], {encoding: "utf-8"});
					mainWindow.webContents.send("app::project:file:loaded", {
						path: result.filePaths[0],
						data: fileResult
					});
				}
				catch(err) {
					mainWindow.webContents.send("show-error", err.message);
				}
			}
		});
});

app.on("will-quit", () => {
	Server_FX5.close();
})

app.on('window-all-closed', () => {
	Server_FX5.close();
	app.quit();
});
