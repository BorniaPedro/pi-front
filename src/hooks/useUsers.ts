import { useQuery } from '@tanstack/react-query'
import { userSchema } from '@/lib/schemas'

async function fetchUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users')
  const data = await response.json()
  return userSchema.array().parse(data) // Validação com Zod
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}