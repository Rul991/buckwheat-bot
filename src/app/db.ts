import mongoose from 'mongoose'
import { DB_NAME, DB_URL } from '../utils/values/consts'

export const connectDatabase = async () => {
  try {
    await mongoose.connect(DB_URL, {dbName: DB_NAME})
  } 
  catch (e) {
    console.error(e)
    process.exit(1)
  }
}
