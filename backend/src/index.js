import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import authRoutes from './routes/authRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import { connectDB } from './lib/db.js';

const app = express()
const PORT = process.env.PORT || 3000;

// 在这里修改：增加 express.json() 的 limit 选项
app.use(express.json({ limit: '50mb' })); // 将请求体大小限制增加到 50MB
// 你也可以根据需要设置更大的值，例如 '100mb'

app.use(cors())

app.use('/api/auth',authRoutes)
app.use('/api/books',bookRoutes)

app.listen(PORT, '0.0.0.0', () => {
    console.log(`在${PORT}的端口监听`)
    connectDB()
})