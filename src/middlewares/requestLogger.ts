import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const start = Date.now()

	// Hook into response end
	const originalJson = res.json
	res.json = function (body) {
		const duration = Date.now() - start
		const log =
			`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)\n` +
			`Request: ${JSON.stringify(req.body)}\n` +
			`Response: ${JSON.stringify(body)}\n`
		logger.info(log)
		return originalJson.call(this, body)
	}

	next()
}
