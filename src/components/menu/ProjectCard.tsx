import { useRouter } from "next/navigation";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteProject } from "@/hooks/useProject";
import { alertConfirm } from "@/lib/alert";


interface ProjectCardProps {
    project: any;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const startYear = new Date(project.startPeriod).getFullYear();
    const endYear = new Date(project.endPeriod).getFullYear();
    const router = useRouter();
    const id = project.id;
    const deleteProject = useDeleteProject();

    const handleClick = () => {
        router.push(`/projetos/${id}/stratums`);
    };

    const handleDelete = async () => {
        if (await alertConfirm(`Tem certeza que deseja apagar o projeto "${project.name}" (ID: ${project.id})?`)) {
            deleteProject.mutate(project.id);
        }
    };

    return (
        <Card variant="outlined" sx={{ position: 'relative', minWidth: 275, minHeight: 150, backgroundColor: '#ffffff' }}>
            <CardActionArea
                onClick={handleClick}
                sx={{
                    height: '100%',
                    '&:hover': { backgroundColor: '#bebebe' },
                }}
            >
                <CardContent>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                        {project.name}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                        Início: {startYear}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        Fim: {endYear}
                    </Typography>
                </CardContent>
            </CardActionArea>

            <IconButton
                onClick={handleDelete}
                sx={{ position: 'absolute', top: 8, right: 8 }}
                aria-label="delete"
            >
                <DeleteIcon />
            </IconButton>
        </Card>
    );
}
