import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  databaseURL: 'https://hacker-news.firebaseio.com',
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export { db }
