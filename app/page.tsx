import { redirect } from 'next/navigation'

export default function Home() {
  // Always redirect to marketing page - auth check happens there if needed
  redirect('/marketing')
}
