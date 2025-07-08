import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
	id: string
	employeeId: string
	email: string
	iat: number
	exp: number
}

export interface AuthenticatedRequest extends Request {
	user?: JwtPayload
}

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const authHeader = req.headers.authorization

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(401).json({ message: 'Unauthorized' })
		return
	}

	const token = authHeader.split(' ')[1]

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload
		;(req as AuthenticatedRequest).user = decoded
		next()
	} catch (error) {
		res.status(401).json({ message: 'Invalid or expired token' })
		return
	}
}
