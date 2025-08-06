import mongoose from 'mongoose'
import { DB_NAME, DB_URL } from '../utils/consts'

const connectDatabase = async () => {
  try {
    await mongoose.connect(DB_URL, {dbName: DB_NAME})
  } 
  catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export default connectDatabase