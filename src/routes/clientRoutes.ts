import { Router } from 'express'
import {
	getClients,
	getClientsById,
	newClient,
	updateClient,
} from '../controllers/clientController'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.get('/', authenticate, getClients)
router.get('/:id', authenticate, getClientsById)
router.post('/', authenticate, newClient)
router.put('/:id', authenticate, updateClient)

export default router
