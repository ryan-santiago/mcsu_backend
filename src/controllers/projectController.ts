import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { uuid } from 'uuidv4'
import { asyncHandler } from '../utils/asyncHandler'
import { AuthenticatedRequest } from '../middlewares/auth'

const prisma = new PrismaClient()

export const getProjects = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const projects = await prisma.projects.findMany()

		res.status(200).json({
			success: true,
			message: 'Projects fetched successfully',
			data: projects,
		})
	}
)

export const getProjectById = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { id } = req.params
		const project = await prisma.projects.findUnique({
			where: {
				id: id,
			},
		})

		if (!project) {
			throw { statusCode: 400, message: 'Project not found' }
		}

		res.status(200).json({
			success: true,
			message: 'Project fetched successfully',
			data: project,
		})
	}
)

export const newProject = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const userId = req.user?.id
		const {
			clientId,
			type,
			code,
			name,
			description,
			startDate,
			endDate,
			contractPrice,
			estimatedCost,
			estimatedProfit,
		} = req.body

		const id = uuid()

		const validateClient = await prisma.clients.findUnique({
			where: { id: clientId },
		})
		if (!validateClient) {
			throw { statusCode: 400, message: 'Invalid Client ID' }
		}

		const newProject = await prisma.projects.create({
			data: {
				id,
				clientId,
				type,
				code,
				name,
				description,
				startDate: startDate ? new Date(startDate) : null,
				endDate: endDate ? new Date(endDate) : null,
				contractPrice,
				estimatedCost,
				estimatedProfit,
				isActive: true,
				createdBy: userId,
				createdDate: new Date(),
			},
		})

		res.status(201).json({
			success: true,
			message: 'Project creation successfully',
			data: newProject,
		})
	}
)

export const updateProject = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { id } = req.params
		const userId = req.user?.id
		const {
			clientId,
			type,
			code,
			name,
			description,
			startDate,
			endDate,
			contractPrice,
			estimatedCost,
			estimatedProfit,
			isActive,
		} = req.body

		const project = await prisma.projects.findUnique({
			where: { id },
		})
		if (!project) {
			throw { statusCode: 404, message: 'Project not found' }
		}

		const validateClient = await prisma.clients.findUnique({
			where: { id: clientId },
		})
		if (!validateClient) {
			throw { statusCode: 400, message: 'Invalid Client ID' }
		}

		const updatedProject = await prisma.projects.update({
			where: { id },
			data: {
				clientId,
				type,
				code,
				name,
				description,
				startDate: startDate ? new Date(startDate) : undefined,
				endDate: endDate ? new Date(endDate) : undefined,
				contractPrice,
				estimatedCost,
				estimatedProfit,
				isActive,
				modifiedBy: userId,
				modifiedDate: new Date(),
			},
		})

		res.status(200).json({
			success: true,
			message: 'Project updated successfully',
			data: updatedProject,
		})
	}
)
