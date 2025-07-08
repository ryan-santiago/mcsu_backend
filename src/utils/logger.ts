import winston from 'winston'
import dayjs from 'dayjs'
import path from 'path'
import fs from 'fs'

const isLoggingEnabled = process.env.ENABLE_LOGGER === 'true'

let logger: winston.Logger

if (!isLoggingEnabled) {
	// Dummy logger that does nothing
	logger = {
		info: () => {},
		error: () => {},
		warn: () => {},
		debug: () => {},
		log: () => {},
	} as unknown as winston.Logger
} else {
	const logsDir = path.join(__dirname, '..', 'logs')
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true })
	}

	logger = winston.createLogger({
		level: 'info',
		format: winston.format.combine(
			winston.format.timestamp(),
			winston.format.printf(
				({ timestamp, message }) => `[${timestamp}] ${message}`
			)
		),
		transports: [
			new winston.transports.File({
				filename: path.join(
					logsDir,
					`api-logs-${dayjs().format('YYYY-MM-DD')}.txt`
				),
			}),
		],
	})
}

export default logger
