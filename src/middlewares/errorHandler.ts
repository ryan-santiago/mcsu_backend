import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err)

	if (err instanceof ZodError) {
		return res.status(400).json({
			success: false,
			message: 'Validation error',
			errors: err.errors.map((e) => ({
				field: e.path.join('.'),
				message: e.message,
			})),
		})
	}

	const statusCode = err.statusCode || 500
	const message = err.message || 'Internal Server Error'

	res.status(statusCode).json({
		success: false,
		message,
	})
}
