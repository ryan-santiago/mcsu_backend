import { z } from 'zod'
import { addressSchema } from './address.schema'
import { employmentSchema } from './employment.schema'

export const employeeSchema = z.object({
	code: z.string().min(1, 'Code is required'),
	firstName: z.string().min(1, 'First name is required'),
	middleName: z.string().nullable(),
	lastName: z.string().min(1, 'Last name is required'),
	suffix: z.string().nullable(),
	birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: 'Invalid birth date format',
	}),
	gender: z.enum(['Male', 'Female']),
	emailAddress: z.string().email('Invalid Questronix Email'),
	personalEmail: z.string().email('Invalid Personal Email'),
	mobileNumber: z
		.string()
		.regex(/^(09\d{9}|\+639\d{9})$/, 'Invalid Philippine mobile number'),
	viberNumber: z
		.string()
		.regex(/^(09\d{9}|\+639\d{9})$/, 'Invalid Philippine mobile number'),

	addresses: z
		.array(addressSchema)
		.min(2, 'Must have at least 2 addresses')
		.refine(
			(addresses) => {
				const types = addresses.map((a) => a.type)
				return types.includes('Current') && types.includes('Permanent')
			},
			{
				message: 'Addresses must include both Current and Permanent types',
			}
		),

	employments: z
		.array(employmentSchema)
		.min(1, 'At least one employment record is required'),
})
