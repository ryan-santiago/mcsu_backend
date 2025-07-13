import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { uuid } from 'uuidv4'
import { asyncHandler } from '../utils/asyncHandler'
import { AuthenticatedRequest } from '../middlewares/auth'

const prisma = new PrismaClient()

export const getClients = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const clients = await prisma.clients.findMany()

		res.status(200).json({
			success: true,
			message: 'Clients fetched successfully',
			data: clients,
		})
	}
)

export const getClientsById = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { id } = req.params
		const client = await prisma.clients.findUnique({
			where: {
				id: id,
			},
		})

		if (!client) {
			throw { statusCode: 400, message: 'Client not found' }
		}

		res.status(200).json({
			success: true,
			message: 'Client fetched successfully',
			data: client,
		})
	}
)

export const newClient = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { name } = req.body
		const id = uuid()

		const newClient = await prisma.clients.create({
			data: {
				id,
				name,
			},
		})

		res.status(201).json({
			success: true,
			message: 'Client creation successfully',
			data: newClient,
		})
	}
)

export const updateClient = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const { id } = req.params
		const { name } = req.body

		const client = await prisma.clients.findUnique({
			where: {
				id: id,
			},
		})

		if (!client) {
			throw { statusCode: 400, message: 'Client not found' }
		}

		const updatedClient = await prisma.clients.update({
			where: { id },
			data: {
				name,
			},
		})

		res.status(200).json({
			success: true,
			message: 'Client updated successfully',
			data: updatedClient,
		})
	}
)
