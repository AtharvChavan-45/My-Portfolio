import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))

// Import routes
import feedbackRouter from './routes/feedback.routes.js'

// Mount routes
app.use('/api', feedbackRouter)

export { app }