import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDb } from './db.js'
import authRoutes from './routes/auth.js'
import profilesRoutes from './routes/profiles.js'
import plansRoutes from './routes/plans.js'
import subscriptionsRoutes from './routes/subscriptions.js'
import paymentsRoutes from './routes/payments.js'
import titlesRoutes from './routes/titles.js'
import myListRoutes from './routes/myList.js'
import watchProgressRoutes from './routes/watchProgress.js'
import adminRoutes from './routes/admin.js'
import { ensureGroupAdminAccount } from './bootstrapAdmin.js'

const app = express()
const port = Number(process.env.PORT) || 4000

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
  })
)
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'streamlab-api' })
})

app.use('/api/auth', authRoutes)
app.use('/api/profiles', profilesRoutes)
app.use('/api/plans', plansRoutes)
app.use('/api/subscriptions', subscriptionsRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/titles', titlesRoutes)
app.use('/api/my-list', myListRoutes)
app.use('/api/watch-progress', watchProgressRoutes)
app.use('/api/admin', adminRoutes)

await connectDb()
await ensureGroupAdminAccount()
app.listen(port, () => {
  console.log(`StreamLab API listening on http://localhost:${port}`)
})
