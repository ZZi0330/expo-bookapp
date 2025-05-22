import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI)
      console.log(`数据库已连接 ${conn.connection.host}`)
    } catch (error) {
      console.log('错误连接数据库', error)
      process.exit(1) //连接失败
    }
}