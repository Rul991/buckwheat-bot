import mongoose from 'mongoose'
import { DB_NAME, DB_PASSWORD, DB_URL, DB_USERNAME } from '../utils/values/consts'

export const connectDatabase = async () => {
  try {
    await mongoose.connect(DB_URL, {
      dbName: DB_NAME,
      auth: DB_USERNAME && DB_PASSWORD ? {
        username: DB_USERNAME,
        password: DB_PASSWORD
      } : undefined
    })
  } 
  catch (e) {
    console.error(e)
    process.exit(1)
  }
}
