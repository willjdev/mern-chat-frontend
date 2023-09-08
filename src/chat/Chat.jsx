import { useContext, useEffect, useRef, useState } from "react";
import { Logo } from "../components/Logo";
import { UserContext } from "../context/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import { registerApi } from "../api/registerApi";
import { Contact } from "../components/Contact";


export const Chat = () => {

  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [loggedOut, setLoggedOut] = useState( null );
  const { username, id, setId, setUsername } = useContext( UserContext );
  const [messages, setMessages] = useState([]);
  const divUnderMessages = useRef();

  const loggedOutClient = [];

  useEffect( () => {
    connectToWs(); 
  }, [selectedUserId]);

  const connectToWs = () => {
    const ws = new WebSocket('ws://localhost:4000');
    setWs( ws );
    ws.addEventListener( 'message', handleMessage );
    ws.addEventListener( 'close', () => {
      setTimeout(() => {
        console.log('Disconnected. Trying to reconnect.');
        connectToWs();
      }, 1000);
    });
  };

  const showOnlinePeople = ( peopleArray ) => {
    const people = {};
    peopleArray.forEach( ({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople( people );
  }

  const handleMessage = ( e ) => {
    const messageData = JSON.parse( e.data );
    console.log({ e, messageData })
    if ( 'online' in messageData ) {
      showOnlinePeople( messageData.online );
    } else if ( 'text' in messageData ) {
      if ( messageData.sender === selectedUserId ) {
        setMessages( prev => ([...prev, { ...messageData }]) )
      }
    }
  };

  const logout = () => {
    //ws.send( JSON.stringify({ id }) );
    console.log(`Hasta pronto, ${username} identificado con ID ${id}`)
    axios.post( '/api/auth/logout' ).then( () => {
      ws.close();
      //setWs( null );
      setId( null );
      setUsername( null );
    });
    //window.location.reload(); Revisar gestion del token, dos tokens al mismo tiempo ?
  };

  const sendMessage = ( e, file = null ) => {
    if ( e ) e.preventDefault();
    ws.send( JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
      file
    }));
    
    if ( file ) {
      axios.get( 'api/events/messages/' + selectedUserId ).then( res => {
        setMessages( res.data );
      })
    } else {
      setNewMessageText('');
      setMessages( prev => ([...prev, { 
        text: newMessageText, 
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      }]));
    }
  };

  const sendFile = ( e ) => {
    const reader = new FileReader();
    reader.readAsDataURL( e.target.files[0] );
    reader.onload = () => {
      sendMessage( null, { 
        name: e.target.files[0].name,
        data: reader.result 
      })
    }
  };
  
  useEffect( () => {
    const div = divUnderMessages.current;
    if ( div ) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect( () => {
    axios.get( '/api/auth/people').then( res => {
      const offlinePeopleArr = res.data
        .filter( person => person._id !== id )
        .filter( person => !Object.keys( onlinePeople ).includes( person._id ) );
      const offlinePeople = {};
      offlinePeopleArr.forEach( person => {
        offlinePeople[person._id] = person;
      })
      setOfflinePeople( offlinePeople );
      });
  }, [onlinePeople]);

  useEffect( () => {
    if ( selectedUserId ) {
      axios.get( 'api/events/messages/' + selectedUserId ).then( res => {
        setMessages( res.data );
      }) 
    }
  }, [selectedUserId]);


  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  const messagesWithoutDupes = uniqBy( messages, '_id' );


  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />
          {Object.keys(onlinePeopleExclOurUser).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              username={onlinePeopleExclOurUser[userId]}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
              online={true}
            />
          ))}
          {Object.keys(offlinePeople).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              username={offlinePeople[userId].username}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
              online={false}
            />
          ))}
        </div>
        <div className="p-2 text-center flex items-center justify-center">
          <span className="mr-2 text-sm text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            {username}
          </span>
          <button
            onClick={logout}
            className="text-sm bg-blue-100 py-1 px-2 text-gray-600 border rounded-sm"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2 border border-red-50">
        <div className="flex-grow flex flex-col">
          {!selectedUserId && (
            <div className="flex flex-grow items-center justify-center">
              <div className="text-gray-400">
                &larr; Select a contact to chat
              </div>
            </div>
          )}
          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithoutDupes.map((message) => (
                  <div className={ message.sender === id ? "text-right" : "text-left" }>
                    <div
                      className={
                        "text-left inline-block p-2 my-2 rounded-md text-sm " +
                        (message.sender === id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-500")
                      }
                    >
                      {message.text}
                      { message.file && (
                        <div className="">
                          <a target="_blank" className="flex items-center gap-1 border-b" href={ axios.defaults.baseURL + '/uploads/' + message.file }>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                            </svg>
                            { message.file }
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
          {!!selectedUserId && (
            <form className="flex gap-2" onSubmit={sendMessage}>
              <input
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                type="text"
                placeholder="Type your message"
                className="bg-white border rounded-sm p-2 flex-grow"
              />
              
              <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200">
                <input type="file" className="hidden" onChange={ sendFile }/>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                </svg>
              </label>
              <button
                type="submit"
                className="bg-blue-500 p-2 text-white rounded-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
