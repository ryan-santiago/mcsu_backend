import { Router } from 'express'
import {
	getProjects,
	getProjectById,
	newProject,
	updateProject,
} from '../controllers/projectController'
import { authenticate } from '../middlewares/auth'
import { projectSchema } from '../validation/project.schema'
import { validate } from '../middlewares/validate'

const router = Router()

router.get('/', authenticate, getProjects)
router.get('/:id', authenticate, getProjectById)
router.post('/', authenticate, validate(projectSchema), newProject)
router.put('/:id', authenticate, validate(projectSchema), updateProject)

export default router
