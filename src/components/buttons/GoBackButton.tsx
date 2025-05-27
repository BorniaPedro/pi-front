'use client'

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation";

export default function GoBackButton(){
    
    const params = useParams()
    const projetoIdParam = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = useRouter()

    const handleClick = () => {
        router.back()
    }
    
    return <div onClick={handleClick} className="bg-gray-200 border rounded-lg cursor-pointer h-10 w-10">
        <img src="/left-arrow.svg" className="w-10 h-10"></img>

    </div>
}