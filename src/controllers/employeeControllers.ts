import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { uuid } from 'uuidv4'
import { asyncHandler } from '../utils/asyncHandler'
import { AuthenticatedRequest } from '../middlewares/auth'

const prisma = new PrismaClient()

export const getAllEmployees = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const employees = await prisma.employees.findMany()

		res.status(200).json({
			success: true,
			message: 'Employees fetched successfully',
			data: employees,
		})
	}
)

export const createEmployee = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const employeeId = uuid()
		const userId = req.user?.id

		const {
			code,
			firstName,
			middleName,
			lastName,
			suffix,
			birthDate,
			gender,
			emailAddress,
			personalEmail,
			mobileNumber,
			viberNumber,
			addresses,
			employments,
		} = req.body

		const createdEmployee = await prisma.$transaction(async (tx) => {
			const employee = await tx.employees.create({
				data: {
					id: employeeId,
					code,
					firstName,
					middleName,
					lastName,
					suffix,
					birthDate: new Date(birthDate),
					gender,
					emailAddress,
					personalEmail,
					mobileNumber,
					viberNumber,
					createdBy: userId,
					createdDate: new Date(),
				},
			})

			const addressData = addresses.map((address: any) => ({
				id: uuid(),
				employeeId: employeeId,
				type: address.type,
				regionCode: address.regionCode,
				provinceCode: address.provinceCode,
				cityCode: address.cityCode,
				barangayCode: address.barangayCode,
				detail: address.detail,
				createdBy: userId,
				createdDate: new Date(),
			}))

			await tx.addresses.createMany({ data: addressData })

			const employmentData = employments.map((employment: any) => ({
				id: uuid(),
				employeeId: employeeId,
				type: employment.type,
				team: employment.team,
				role: employment.role,
				level: employment.level,
				startDate: new Date(employment.startDate),
				endDate: employment.endDate ? new Date(employment.endDate) : null,
				salary: employment.salary,
				communication: employment.communication,
				transportation: employment.transportation,
				createdBy: userId,
				createdDate: new Date(),
			}))

			await tx.employments.createMany({ data: employmentData })

			return employee
		})

		res.status(201).json({
			success: true,
			message: 'Employee and related data created successfully',
			data: createdEmployee,
		})
	}
)

export const getEmployeeByIdOrCode = asyncHandler(
	async (req: Request, res: Response) => {
		const { idOrCode } = req.params

		if (!idOrCode) {
			throw { statusCode: 400, message: 'ID or Code is required in the path' }
		}

		const isUUID =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
				idOrCode
			)

		const employee = await prisma.employees.findFirst({
			where: isUUID ? { id: idOrCode } : { code: idOrCode },
			include: {
				address: true,
				employment: true,
			},
		})

		if (!employee) {
			throw { statusCode: 404, message: 'Employee not found' }
		}

		res.status(200).json({
			success: true,
			message: 'Employee fetched successfully',
			data: employee,
		})
	}
)
