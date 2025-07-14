import { Router } from 'express'
import {
	getAllEmployees,
	getEmployeeByIdOrCode,
	createEmployee,
	employeeDeployment,
} from '../controllers/employeeControllers'
import { validate } from '../middlewares/validate'
import { employeeSchema } from '../validation/employee.schema'
import { projectDeploymentSchema } from '../validation/projectDeployment.schema'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.get('/', authenticate, getAllEmployees)
router.get('/:idOrCode', authenticate, getEmployeeByIdOrCode)
router.post('/', authenticate, validate(employeeSchema), createEmployee)
router.post(
	'/:employeeId/deployment/:projectId',
	authenticate,
	validate(projectDeploymentSchema),
	employeeDeployment
)

export default router
