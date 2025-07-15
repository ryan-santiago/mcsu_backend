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

export const employeeDeployment = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { employeeId, projectId } = req.params
		const deploymentId = uuid()
		const userId = req.user?.id
		const { startDate, endDate } = req.body

		const deployment = await prisma.projectDeployments.findFirst({
			where: {
				employeeId,
				projectId,
			},
		})
		if (deployment) {
			throw { statusCode: 400, message: 'Project Deployment already exists.' }
		}

		const employee = await prisma.employees.findUnique({
			where: { id: employeeId },
		})
		if (!employee) {
			throw { statusCode: 404, message: 'Employee not found' }
		}

		const project = await prisma.projects.findUnique({
			where: { id: projectId },
		})
		if (!project) {
			throw { statusCode: 404, message: 'Project not found' }
		}

		const newDeployment = await prisma.projectDeployments.create({
			data: {
				id: deploymentId,
				employeeId,
				projectId,
				startDate,
				endDate,
				createdBy: userId,
				createdDate: new Date(),
			},
		})

		res.status(201).json({
			success: true,
			message: 'Project Deployment created successfully',
			data: newDeployment,
		})
	}
)

export const getEmployeeDataList = asyncHandler(
	async (req: Request, res: Response) => {
		const employees = await prisma.employees.findMany({
			where: { isActive: true },
			include: {
				employment: {
					orderBy: { startDate: 'desc' },
					take: 1,
				},
				projectDeployments: {
					orderBy: { startDate: 'desc' },
					take: 1,
					include: {
						project: {
							include: {
								client: true,
							},
						},
					},
				},
			},
		})

		const formatted = employees.map((emp) => {
			const latestEmployment = emp.employment[0]
			const latestDeployment = emp.projectDeployments[0]
			const project = latestDeployment?.project
			const client = project?.client

			const fullName = `${emp.lastName}, ${emp.firstName}${
				emp.middleName ? ' ' + emp.middleName[0] + '.' : ''
			}${emp.suffix ? ' ' + emp.suffix : ''}`

			return {
				id: emp.id,
				code: emp.code,
				fullName,
				firstName: emp.firstName,
				middleName: emp.middleName,
				lastName: emp.lastName,
				suffix: emp.suffix,
				birthDate: emp.birthDate,
				gender: emp.gender,
				emailAddress: emp.emailAddress,
				mobileNumber: emp.mobileNumber,
				viberNumber: emp.viberNumber,

				employmentType: latestEmployment?.type ?? null,
				employmentTeam: latestEmployment?.team ?? null,
				employmentRole: latestEmployment?.role ?? null,
				employmentLevel: latestEmployment?.level ?? null,
				employmentStartDate: latestEmployment?.startDate ?? null,
				employmentEndDate: latestEmployment?.endDate ?? null,

				deploymentStartDate: latestDeployment?.startDate ?? null,
				deploymentEndDate: latestDeployment?.endDate ?? null,
				deploymentProjectType: project?.type ?? null,
				deploymentProjectCode: project?.code ?? null,
				deploymentProjectName: project?.name ?? null,
				deploymentClientName: client?.name ?? null,
			}
		})

		res.status(200).json({
			success: true,
			message: 'Employee Data List fetched successfully',
			data: formatted,
		})
	}
)
