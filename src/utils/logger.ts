const LogLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const;
const levelMap: Record<typeof LogLevels[number], number> = {
	'DEBUG': 0,
	'INFO': 1,
	'WARN': 2,
	'ERROR': 3,
};

export type LogLevel = typeof LogLevels[number];


export class Logger {
	constructor(private readonly name: string, private readonly level: LogLevel = 'INFO') {}

	private log(level: typeof LogLevels[number], message: string, ...args: unknown[]) {
		if (levelMap[level] < levelMap[this.level]) {
			return;
		}

		const timestamp = new Date().toLocaleString();
		const levelStr = level.padEnd(5);
		const nameStr = this.name.padEnd(20);

		console.log(`${timestamp} ${levelStr} ${nameStr} ${message}`, ...args);
	}

	debug(message: string, ...args: unknown[]) {
		this.log('DEBUG', message, ...args);
	}

	info(message: string, ...args: unknown[]) {
		this.log('INFO', message, ...args);
	}

	warn(message: string, ...args: unknown[]) {
		this.log('WARN', message, ...args);
	}

	error(message: string, ...args: unknown[]) {
		this.log('ERROR', message, ...args);
	}
}
