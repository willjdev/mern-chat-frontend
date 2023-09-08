import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { registerApi } from "../../api/registerApi";
import { isStrongPassword } from "../../helpers/checkPassword";
import './style.css';

export const RegisterLoginForm = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lengthT, setLength] = useState( true );
  const [lowercaseT, setLowercase] = useState( true );
  const [uppercaseT, setUppercase] = useState( true );
  const [numberT, setNumber] = useState( true );
  const [specialCharT, setSpecialChar] = useState( true );
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
  const [isClickedPassword, setIsClickedPassword] = useState( false );
  const [isClickedUsername, setIsClickedUsername] = useState( false );
  const [usernameLength, setUsernameLength] = useState( true );
  const { setUsername: setLoggedInUsername, setId } =  useContext( UserContext );

  const passwordInputRef = useRef( null );
  const submitButtonRef = useRef( null );
  const usernameInputRef = useRef( null );

  const handleSubmit = async ( env ) => {
    env.preventDefault();
    handleUsername();
    const { length, lowercase, uppercase, number, specialChar } = isStrongPassword( password )
    handlePassword( length, lowercase, uppercase, number, specialChar );

    if ( length, lowercase, uppercase, number, specialChar && username.length >= 1 ) {
      const url = isLoginOrRegister === 'register' ? '/api/auth/register' : '/api/auth/login'
      try {
        const { data } = await registerApi.post( url, { username, password });
        setLoggedInUsername( username );
        setId( data._id );
        console.log(`Hola, ${username}, identificado con ID ${data._id}`)
      } catch (error) {
        console.log(error);
      }
    } 
  };

  useEffect( () => {
    const handleClickOutisde = ( e ) => {
      if ( passwordInputRef.current && !passwordInputRef.current.contains( e.target ) && !submitButtonRef.current.contains( e.target ) ) {
        setIsClickedPassword( false );
      } else {
        setIsClickedPassword( true );
      }

      if ( usernameInputRef.current && !usernameInputRef.current.contains( e.target ) && !submitButtonRef.current.contains( e.target ) ) {
        setIsClickedUsername( false );
      } else {
        setIsClickedUsername( true );
      }
    };
    
    document.addEventListener( 'click', handleClickOutisde );

    return () => {
      document.removeEventListener( 'click', handleClickOutisde );
    };

  }, []);

  const handlePassword = ( length, lowercase, uppercase, number, specialChar ) => {
    setLength( length );
    setLowercase( lowercase );
    setUppercase( uppercase );
    setNumber( number );
    setSpecialChar( specialChar );
  };

  const handleUsername = () => {
    setUsernameLength( username.length < 1 ? false : true );
  };

  const handleClickPassword = () => {
    if ( isLoginOrRegister === 'register' ) setIsClickedPassword( true );
  };

  const handleClickUsername = () => {
    if ( isLoginOrRegister === 'register' ) setIsClickedUsername( true );
  };

  const handleLoginOrRegister = () => {
    setUsername('');
    setPassword('');
    isLoginOrRegister === 'login' ? setIsLoginOrRegister('register') : setIsLoginOrRegister('login');
  }; 


  return (
    <div className="bg-red-500 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onClick={ handleClickUsername }
          placeholder="Username"
          className="block w-full rounded-sm p-2 mb-2 border"
          ref={ usernameInputRef }
        />

          <div className={`w-full mb-2 p-2 bg-zinc-200 border border-gray-950 shadow-md rounded-sm transition-opacity transform ${ isLoginOrRegister === 'register' && isClickedUsername ? 'opacity-100 translate-y-0 transition duration-500 ease-out' : 'hidden opacity-0 -translate-y-2' }`}>
            <p className="text-xs font-semibold">Username requirements:</p>
            <ul className="ml-4 text-xs">
              <li className={usernameLength ? 'list-disc' : 'text-red-500 custom-bullet'}>Username most be at least 1 character long</li>
            </ul>
          </div>

        
        <input
          type="password"
          ref={ passwordInputRef }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="block w-full rounded-sm p-2 mb-2 border transition ease-in-out"
          onClick={ handleClickPassword }
        />

        <div className={`w-full mb-2 p-2 bg-zinc-200 border border-gray-950 shadow-md rounded-sm transition-opacity transform ${ isLoginOrRegister === 'register' && isClickedPassword ? 'opacity-100 translate-y-0 transition duration-500 ease-out' : 'hidden opacity-0 -translate-y-2' }`}>
          <p className="text-xs font-semibold">Password requirements:</p>
          <ul className="ml-4 text-xs">
            <li className={lengthT ? 'list-disc' : 'text-red-500 custom-bullet'}>Most be at least 8 characters long</li>
            <li className={uppercaseT ? 'list-disc' : 'text-red-500 custom-bullet'}>Most contain at least one capital letter</li>
            <li className={lowercaseT ? 'list-disc' : 'text-red-500 custom-bullet'}>Most contain at least one lower-case letter</li>
            <li className={numberT ? 'list-disc' : 'text-red-500 custom-bullet'}>Most contain at least one number</li>
            <li className={specialCharT ? 'list-disc' : 'text-red-500 custom-bullet'}>Most contain at least one special characters</li>
          </ul>
        </div>

        <button className="bg-blue-500 text-white block w-full rounded-sm p-2" ref={ submitButtonRef }>
          { isLoginOrRegister === 'register' ? 'Register' : 'Login' }
        </button>

        { 
          isLoginOrRegister === 'register' && 
          <div className="text-center mt-2 text-sm">
            Already a member ? 
            <button className="ml-1" onClick={ handleLoginOrRegister }>
              Login here
            </button>
          </div>
        }

        { 
          isLoginOrRegister === 'login' && 
          <div className="text-center mt-2 text-sm">
            Don't have an account ? 
            <button className="ml-1" onClick={ handleLoginOrRegister }>
              Register here
            </button>
          </div>
        }

      </form>
    </div>
  );
}
