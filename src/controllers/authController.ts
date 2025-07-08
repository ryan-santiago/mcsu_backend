import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { uuid } from 'uuidv4'
import { asyncHandler } from '../utils/asyncHandler'
import jwt, { SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const register = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body
	const userId = uuid()

	if (!email || !password) {
		throw { statusCode: 400, message: 'Email and password are required' }
	}

	const employee = await prisma.employees.findFirst({
		where: {
			emailAddress: email,
		},
	})

	if (!employee) {
		throw { statusCode: 400, message: 'Invalid Email Address' }
	}

	const existingUser = await prisma.users.findUnique({
		where: {
			employeeId: employee.id,
		},
	})

	if (existingUser) {
		throw { statusCode: 400, message: 'Email Address already registered.' }
	}

	const saltRounds = 10
	const hashedPassword = await bcrypt.hash(password, saltRounds)

	const newUser = await prisma.users.create({
		data: {
			id: userId,
			employeeId: employee.id,
			password: hashedPassword,
			lastChangePassword: new Date(),
		},
	})

	res.status(201).json({
		success: true,
		message: 'Registration successfully',
		data: newUser,
	})
})

export const login = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body

	if (!email || !password) {
		throw { statusCode: 400, message: 'Email and password are required' }
	}

	const employee = await prisma.employees.findFirst({
		where: { emailAddress: email },
	})

	if (!employee) {
		throw { statusCode: 400, message: 'Invalid email or password' }
	}

	const user = await prisma.users.findUnique({
		where: { employeeId: employee.id },
	})

	if (!user) {
		throw { statusCode: 400, message: 'Invalid email or password' }
	}

	const isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch) {
		throw { statusCode: 400, message: 'Invalid email or password' }
	}

	const token = jwt.sign(
		{
			id: user.id,
			employeeId: user.employeeId,
			email: employee.emailAddress,
		},
		process.env.JWT_SECRET as string,
		{
			expiresIn: '1d',
		}
	)

	res.status(200).json({
		success: true,
		message: 'Login successfully',
		token,
		data: {
			id: user.id,
			employeeId: user.employeeId,
			email: employee.emailAddress,
			name: `${employee.firstName} ${employee.lastName}`,
		},
	})
})
