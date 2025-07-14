import { z } from 'zod'

export const projectDeploymentSchema = z.object({
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
	isActive: z.boolean().optional(),
})
