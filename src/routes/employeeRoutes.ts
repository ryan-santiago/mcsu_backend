import { Router } from 'express'
import {
	getAllEmployees,
	createEmployee,
	getEmployeeByIdOrCode,
} from '../controllers/employeeControllers'
import { validate } from '../middlewares/validate'
import { employeeSchema } from '../validation/employee.schema'

const router = Router()

router.get('/', getAllEmployees)
router.get('/:idOrCode', getEmployeeByIdOrCode)
router.post('/', validate(employeeSchema), createEmployee)

export default router
