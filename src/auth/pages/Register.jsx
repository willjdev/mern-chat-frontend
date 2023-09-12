import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { isStrongPassword } from "../../helpers/checkPassword";
import { RegisterRequirements } from "../../components/RegisterRequirements";
import { loginRegister } from "../../helpers/loginRegister";


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
    const correctPassword = handlePassword( length, lowercase, uppercase, number, specialChar );
    loginRegister( username, password, isLoginOrRegister, setLoggedInUsername, setId, correctPassword, usernameLength ); 
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
    if ( length, lowercase, uppercase, number, specialChar ) {
      return true;
    } else {
      return false;
    }

  };

  const handleUsername = () => {
    setUsernameLength( username.length < 1 ? false : true );
  };

  const handleClick = ( type ) => {
    if ( isLoginOrRegister === 'register' && type === 'password' ) {
      setIsClickedPassword( true );
    } else {
      setIsClickedUsername( true );
    }
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
          onClick={ handleClick }
          placeholder="Username"
          className="block w-full rounded-sm p-2 mb-2 border"
          ref={ usernameInputRef }
        />
          <RegisterRequirements 
            isLoginOrRegister={ isLoginOrRegister } 
            isClicked={ isClickedUsername } 
            type={'Username'} 
            username={ usernameLength } 
          />
        
        <input
          type="password"
          ref={ passwordInputRef }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="block w-full rounded-sm p-2 mb-2 border transition ease-in-out"
          onClick={ () => handleClick('password') }
        />
          <RegisterRequirements 
            isLoginOrRegister={ isLoginOrRegister } 
            isClicked={ isClickedPassword } 
            type={'Password'} 
            lengthT={ lengthT } 
            uppercaseT={ uppercaseT } 
            lowercaseT={ lowercaseT } 
            numberT={ numberT } 
            specialCharT={ specialCharT } 
          />

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
