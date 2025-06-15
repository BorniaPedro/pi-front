'use client'

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';

export default function GoBackButton(){
    
    const router = useRouter()

    const handleClick = () => {
        router.back()
    }
    
    return <Button onClick={handleClick} variant="contained" size="large" ><KeyboardBackspaceOutlinedIcon/></Button>
}