import axios from 'axios';
import { createContext, useEffect, useState } from 'react'

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    useEffect(() => {
      axios.get( '/api/auth/profile' ).then( resp => {
        setId( resp.data.userId );
        setUsername( resp.data.username );
        console.log('From context')
      })
    }, [])
    


    return (
        <UserContext.Provider value={{ username, id, setId, setUsername }}>
            { children }
        </UserContext.Provider>
    )
}
