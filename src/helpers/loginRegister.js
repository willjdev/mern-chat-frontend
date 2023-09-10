import { alert } from "./alerts";
import { registerApi } from "../api/registerApi";


export const loginRegister = async ( username, password, isLoginOrRegister, setLoggedInUsername, setId ) => {

        const url = isLoginOrRegister === 'register' ? '/api/auth/register' : '/api/auth/login';
        try {
            const { data } = await registerApi.post( url, { username, password });
            setLoggedInUsername( username );
            setId( data._id );
        } catch (error) {
            console.log(error);
            if ( error && isLoginOrRegister === 'register' ) alert();
        };
        
};
