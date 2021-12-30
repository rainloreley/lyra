import { FunctionComponent, useEffect, useState } from 'react';

interface DMXBinaryDisplay_Props {
	channel: number;
}

const DMXBinaryDisplay: FunctionComponent<DMXBinaryDisplay_Props> = ({
	channel,
}) => {
	const [binaryRepresentation, setBinaryRepresentation] =
		useState<BinaryDMXChannel | null>(null);

	useEffect(() => {
		const binaryString = (channel >>> 0).toString(2);
		var binaryDMXChannel: BinaryDMXChannel = {
			_512: false,
			_256: false,
			_128: false,
			_64: false,
			_32: false,
			_16: false,
			_8: false,
			_4: false,
			_2: false,
			_1: false,
		};
		const binaryArray = reverseString(binaryString)
			.split('')
			.map((e, i) => {
				// @ts-ignore
				binaryDMXChannel[`_${Math.pow(2, i).toString()}`] = e === '1';
			});

		setBinaryRepresentation(binaryDMXChannel);
	}, [channel]);

	const reverseString = (str: string) => {
		return str.split('').reverse().join('');
	};
	return (
		<div>
			{binaryRepresentation !== null ? (
				<div className="flex">
					{Object.keys(binaryRepresentation).map((key, i) => {
						// @ts-ignore
						const isOn = binaryRepresentation[
							`_${Math.pow(2, i).toString()}`
						] as boolean;
						return (
							<div className="flex">
								<div className="flex flex-col w-8 text-center">
									<div
										className={`w-4 h-4 rounded-full self-center ${
											isOn ? 'bg-blue-500' : 'bg-gray-400'
										}`}
									/>
									<p className="dark:text-white">{Math.pow(2, i)}</p>
								</div>
								{i != 9 ? (
									<div className="h-full w-0.5 bg-gray-300 dark:bg-gray-400 rounded-xl" />
								) : (
									<div />
								)}
							</div>
						);
					})}
				</div>
			) : (
				<div />
			)}
		</div>
	);
};

interface BinaryDMXChannel {
	_512: boolean;
	_256: boolean;
	_128: boolean;
	_64: boolean;
	_32: boolean;
	_16: boolean;
	_8: boolean;
	_4: boolean;
	_2: boolean;
	_1: boolean;
}

export default DMXBinaryDisplay;
