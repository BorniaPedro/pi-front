import { useRouter } from "next/navigation";

interface ProjectCardProps {
    project: any; // Replace 'any' with the appropriate type for the project object
  }
  
export default function ProjectCard({ project }: ProjectCardProps){

    const startYear = new Date(project.startPeriod).getFullYear()
    const endYear = new Date(project.endPeriod).getFullYear()

    const router = useRouter()
    
    const handleClick = () => {
        router.push(`/projetos/{project.id}`)
    }


    return <div
        onClick={handleClick} 
        className="bg-green-100 rounded-lg shadow-md w-64 h-46 flex flex-col justify-between mx-auto border border-black cursor-pointer">
        <h3 className="text-center font-medium text-2xl break-words whitespace-normal pt-6">{project.name}</h3>
        <div className="grid grid-rows-2">
        <div className="pl-1">Inicio: {startYear}</div>
        <div className="pl-1">Fim: {endYear}</div>
        </div>
    </div>
}