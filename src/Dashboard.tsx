import { signOut } from 'firebase/auth'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from './firebase'

const Dashboard = () => {
    const navigate = useNavigate()

    useEffect(() => {
     const checkToken = () => {
        const userToken = localStorage.getItem("token");
        if (userToken){
            console.log("User is valid")
        }
        else {
            console.log("User is not valid")
            navigate("/")
        }
     }
     checkToken()
    }, [])

    const logoutuser = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("token")
            navigate("/")
        } catch (error:any) {
            console.log("Error msg: ", error.message)
            alert(error.message)
        }
    }

  return (
    <>
        <div>Dashboard</div>
        <div>
            <button onClick={logoutuser}>Logout</button>
        </div>
    </>
  )
}

export default Dashboard
