import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import styles from '../../../styles/Dashboard_Sidebar.module.css';
import {
	AppControlContext,
	NotificationCenterElement,
	NotificationCenterElementStatus,
} from '../../appContextProvider';
import { v4 as uuidv4 } from 'uuid';

const SettingsAbout: FunctionComponent = ({}) => {
	const [appVersion, setAppVersion] = useState<string>('');

	const { addNotification } = useContext(AppControlContext);

	const quotes = [
		'Warning! Neurotoxin pressure has reached dangerously unlethal levels.',
		'Warning: Central core is eighty percent corrupt.',
		'We are currently experiencing technical difficulties due to circumstances of potentially apocalyptic significance beyond our control.',
		'Warning. Reactor core is at critical temperature.',
		'Reactor explosion in four minutes.',
		'Caroline deleted.',
		'Interpreting vague answer as YES.',
		'The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.',
		"I'd just like to interject for a moment. What you’re referring to as Linux, is in fact, GNU/Linux, or as I’ve recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX.\n" +
			'Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called “Linux”, and many of its users are not aware that it is basically the GNU system, developed by the GNU Project. There really is a Linux, and these people are using it, but it is just a part of the system they use.\n' +
			'Linux is the kernel: the program in the system that allocates the machine’s resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. Linux is normally used in combination with the GNU operating system: the whole system is basically GNU with Linux added, or GNU/Linux. All the so-called “Linux” distributions are really distributions of GNU/Linux.',
	];

	const [easterEggCounter, setEasterEggCounter] = useState(6);

	const easterEggClicked = () => {
		if (easterEggCounter > 0) {
			setEasterEggCounter((e) => {
				e -= 1;
				return e;
			});
		} else {
			const notification: NotificationCenterElement = {
				uid: uuidv4(),
				text: quotes[Math.floor(Math.random() * quotes.length)].toString(),
				status: NotificationCenterElementStatus.notification,
				dismissAt: Date.now() + 3000,
			};
			addNotification(notification);
		}
	};

	useEffect(() => {
		ipcRenderer.once('app::version', (event, data) => {
			setAppVersion(data);
		});
		ipcRenderer.send('app::get-version');
	}, []);

	return (
		<div
			className={`w-full h-screen overflow-y-scroll overflow-x-hidden flex justify-center items-center ${styles.noscrollbar}`}
		>
			<div className={' text-center items-center flex flex-col'}>
				<img src={'/images/logo.png'} width={150} className="mb-2" />
				<button
					className={'text-3xl font-bold'}
					onClick={() => {
						easterEggClicked();
					}}
				>
					Lyra v{appVersion}
				</button>
				<p className={'italic text-gray-500 dark:text-gray-400 mt-1'}>
					Open Source DMX Light control software
				</p>
				<a
					className={'underline text-blue-500 mt-2'}
					href={'https://github.com/rainloreley/lyra'}
					target={'_blank'}
				>
					GitHub
				</a>
			</div>
		</div>
	);
};

export default SettingsAbout;
