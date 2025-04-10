'use client'

import { useUsers } from '@/hooks/useUsers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '@/lib/schemas'
import { z } from 'zod'

type FormData = z.infer<typeof userSchema>

export default function ExamplePage() {
  const { data: users, isLoading, error } = useUsers()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Aqui você faria a submissão para a API
  }

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar usuários</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Exemplo de Integração</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário com validação Zod */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Adicionar Usuário</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1">Nome</label>
              <input
                {...register('name')}
                className="w-full p-2 border rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block mb-1">Email</label>
              <input
                {...register('email')}
                className="w-full p-2 border rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block mb-1">Username</label>
              <input
                {...register('username')}
                className="w-full p-2 border rounded"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Enviar
            </button>
          </form>
        </div>
        
        {/* Lista de usuários com TanStack Query */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Lista de Usuários</h2>
          <ul className="space-y-2">
            {users?.map((user) => (
              <li key={user.id} className="p-3 border rounded">
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}