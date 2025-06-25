class Logger {
	private static instance: Logger;

	public static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}

		return Logger.instance;
	}

	public log(...args: any[]): void {
		this.logMessage('LOG', '34', ...args);
	}

	public info(...args: any[]): void {
		this.logMessage('INFO', '32', ...args);
	}

	public warn(...args: any[]): void {
		this.logMessage('WARN', '33', ...args);
	}

	public error(...args: any[]): void {
		this.logMessage('ERROR', '31', ...args);
	}

	private logMessage(type: string, color: string, ...args: any[]): void {
		const options = { timeZone: 'Europe/Berlin' };
		const date = new Date().toLocaleString('de-DE', options);

		const coloredType = `\x1b[${color}m${type}\x1b[97m`;

		// eslint-disable-next-line no-console
		console.log(`\x1b[37m${date}\x1b[97m [${coloredType}]:`, ...args);
	}
}

const logger = Logger.getInstance();

export default logger;
