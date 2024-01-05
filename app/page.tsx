import { ref, child, get, query, limitToFirst } from 'firebase/database'
import { db } from '@/components/FirebaseConfig'
import Story from '@/components/Story'

export default async function TopStories() {
  const topStoriesRef = query(child(ref(db), 'v0/topstories'), limitToFirst(20))
  const topStories = await get(topStoriesRef)
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : []))
    .catch((error) => {
      console.error(error)
    })

  return (
    <main className="p-4 font-light space-y-20 max-w-5xl mx-auto">
      <h1 className="text-5xl">Alt HN</h1>
      {topStories.map((storyID: number) => (
        <Story storyID={storyID} key={storyID} />
      ))}
    </main>
  )
}
