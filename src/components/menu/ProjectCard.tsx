import { useRouter } from "next/navigation";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

interface ProjectCardProps {
    project: any; // Replace 'any' with the appropriate type for the project object
}

export default function ProjectCard({ project }: ProjectCardProps) {

    const startYear = new Date(project.startPeriod).getFullYear()
    const endYear = new Date(project.endPeriod).getFullYear()

    const router = useRouter()

    const id = project.id;

    const handleClick = () => {
        router.push(`/projetos/${id}/stratums`)
    }

    /**/
    return (
        <CardActionArea>

            <Card variant="outlined" sx={{ minWidth: 275, minHeight: 150, backgroundColor: '#ffffff', '&:hover': { backgroundColor: '#bebebe' } }} onClick={handleClick}>
                <CardContent>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                        {project.name}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                        Inicio: {startYear}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        Fim: {endYear}
                    </Typography>
                </CardContent>
            </Card>
        </CardActionArea>
    );

}