import { z } from 'zod'

export const projectSchema = z.object({
	id: z.string().uuid().optional(),
	clientId: z.string().uuid({ message: 'Invalid client ID format' }),
	type: z.string().min(1, 'Project type is required'),
	code: z.string().min(1, 'Project code is required'),
	name: z.string().min(1, 'Project name is required'),
	description: z.string().optional(),
	startDate: z
		.string()
		.datetime({ message: 'startDate must be in ISO format' })
		.optional()
		.or(z.null()),
	endDate: z
		.string()
		.datetime({ message: 'endDate must be in ISO format' })
		.optional()
		.or(z.null()),
	contractPrice: z.number().nonnegative().optional(),
	estimatedCost: z.number().nonnegative().optional(),
	estimatedProfit: z.number().optional(),
	isActive: z.boolean().optional().default(true),
})
