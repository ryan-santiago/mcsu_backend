import { z } from 'zod'

export const addressSchema = z.object({
	type: z.enum(['Current', 'Permanent']),
	regionCode: z.string().min(1, 'Region is required'),
	provinceCode: z.string().min(1, 'Province is required'),
	cityCode: z.string().min(1, 'City is required'),
	barangayCode: z.string().min(1, 'Barangay is required'),
	detail: z.string().min(1, 'Address detail is required'),
})
