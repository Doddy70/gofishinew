import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Note: 'todos' table must exist in your Supabase database for this to work
  const { data: todos, error } = await supabase.from('todos').select()

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Supabase Error</h1>
        <p className="mt-4 text-gray-600">{error.message}</p>
        <p className="mt-2 text-sm text-gray-400">Make sure the 'todos' table exists in your Supabase project.</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Todos Test</h1>
      <ul className="list-disc pl-5">
        {todos?.map((todo: any) => (
          <li key={todo.id} className="py-1">{todo.name}</li>
        ))}
        {todos?.length === 0 && <p className="text-gray-500 italic">No todos found.</p>}
      </ul>
    </div>
  )
}
