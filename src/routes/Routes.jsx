import { useContext } from "react"
import { RegisterLoginForm } from "../auth"
import { UserContext } from "../context/UserContext"
import { Chat } from "../chat/Chat";


export const Routes = () => {

  const { username } = useContext( UserContext );

  
  if ( username ) {
    return <Chat />;
  }  

  return (
    <RegisterLoginForm/>
  )
}
