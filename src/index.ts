import express, { ErrorRequestHandler } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

// Routes Imports
import employeeRoutes from './routes/employeeRoutes'
import { errorHandler } from './middlewares/errorHandler'

// Initialize
dotenv.config()
const app = express()

// Middleware
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(cors())

// Routes
app.use('/employee', employeeRoutes)

// Error handler middleware
app.use(errorHandler as ErrorRequestHandler)

// Server
const port = Number(process.env.PORT) || 3001

app.listen(port, '0.0.0.0', () => {
	console.log(`Server running on port ${port}`)
})
