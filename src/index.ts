import express, { ErrorRequestHandler } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

// Routes Imports
import authRoutes from './routes/authRoutes'
import employeeRoutes from './routes/employeeRoutes'
import clientRoutes from './routes/clientRoutes'
import projectRoutes from './routes/projectRoutes'
import { errorHandler } from './middlewares/errorHandler'

// Initialize
dotenv.config()
import { requestLogger } from './middlewares/requestLogger'
const app = express()

// Middleware
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(cors())

//Logger
app.use(requestLogger)

// Routes
app.use('/auth', authRoutes)
app.use('/employees', employeeRoutes)
app.use('/clients', clientRoutes)
app.use('/projects', projectRoutes)

// Error handler middleware
app.use(errorHandler as ErrorRequestHandler)

// Server
const port = Number(process.env.PORT) || 3001

app.listen(port, '0.0.0.0', () => {
	console.log(`Server running on port ${port}`)
})
