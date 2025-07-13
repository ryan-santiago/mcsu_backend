import { z } from 'zod'

export const projectSchema = z.object({
	id: z.string().uuid().optional(),
	clientId: z.string().uuid({ message: 'Invalid client ID format' }),
	type: z.string().min(1, 'Project type is required'),
	code: z.string().min(1, 'Project code is required'),
	name: z.string().min(1, 'Project name is required'),
	description: z.string().optional(),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	contractPrice: z.number().nonnegative().optional(),
	estimatedCost: z.number().nonnegative().optional(),
	estimatedProfit: z.number().optional(),
	isActive: z.boolean().optional().default(true),
})
