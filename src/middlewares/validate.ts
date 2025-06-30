// src/middlewares/validate.ts
import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export const validate =
	(schema: ZodSchema<any>) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			req.body = schema.parse(req.body)
			next()
		} catch (error) {
			next(error)
		}
	}
