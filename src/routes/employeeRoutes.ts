import { Router } from 'express'
import {
	getAllEmployees,
	createEmployee,
	getEmployeeByIdOrCode,
} from '../controllers/employeeControllers'
import { validate } from '../middlewares/validate'
import { employeeSchema } from '../validation/employee.schema'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.get('/', authenticate, getAllEmployees)
router.get('/:idOrCode', authenticate, getEmployeeByIdOrCode)
router.post('/', authenticate, validate(employeeSchema), createEmployee)

export default router
