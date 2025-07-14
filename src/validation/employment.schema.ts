import { z } from 'zod'

export const employmentSchema = z.object({
	type: z.enum(['Project Hired', 'Probationary', 'Regular']),
	team: z.string().min(1, 'Team is required'),
	role: z.string().min(1, 'Role is required'),
	level: z.string().min(1, 'Level is required'),
	startDate: z
		.string()
		.datetime({ message: 'startDate must be in ISO format' }),
	endDate: z
		.string()
		.datetime({ message: 'endDate must be in ISO format' })
		.optional()
		.or(z.null()),
	salary: z.number().nonnegative('Salary must be non-negative'),
	communication: z
		.number()
		.nonnegative('Communication allowance must be non-negative'),
	transportation: z
		.number()
		.nonnegative('Transportation allowance must be non-negative'),
})
