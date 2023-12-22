import React, { useEffect, useState } from 'react'
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
    auth: boolean;
    setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}





const Dashboard: React.FC<DashboardProps> = ({ auth, setAuth }) => {
    const navigate = useNavigate();
    const [userId, setUserid] = useState<String>('')


    return (
        <div>Dashboard</div>
    )
}

export default Dashboard