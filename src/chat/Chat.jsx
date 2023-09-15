import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { uniqBy } from "lodash";
import { Logo } from "../components/Logo";
import { UserContext } from "../context/UserContext";
import { Contact } from "../components/Contact";
import { connectToWs } from "../helpers/connectWs";
import { ChatMessages } from "../components/ChatMessages";
import { Form } from "../components/Form";


export const Chat = () => {

  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const { username, id, setId, setUsername } = useContext( UserContext );
  const divUnderMessages = useRef();

  useEffect( () => {
    connectToWs( handleMessage, setWs ); 
  }, [selectedUserId]);


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
    console.log(`Hasta pronto, ${username} identificado con ID ${id}`)
    axios.post( '/api/auth/logout' ).then( () => {
      ws.close();
      setId( null );
      setUsername( null );
    });
  };

  const sendMessage = async ( e, file = null ) => {
    if ( e ) e.preventDefault();
    if ( !file && newMessageText === '' ) return;
    ws.send( JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
      file
    }));
    
    if ( file ) {
        console.log('Sent')
          axios.get( 'api/events/messages/' + selectedUserId ).then( res => {
            setMessages( res.data );
          });
    } else {
      console.log('Sent without file')
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
    console.log(e.target.files[0])
    reader.onload = () => {
      sendMessage( null, { 
        name: e.target.files[0].name,
        data: reader.result 
      })
      e.target.value = null;
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
  useEffect( () => {
    console.log(messagesWithoutDupes)
  }, [messages])


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
              onClick={() => setSelectedUserId(userId)}
              username={offlinePeople[userId].username}
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
          {!!selectedUserId &&  
            (<div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                <ChatMessages messagesWithoutDupes={ messagesWithoutDupes } id={ id } />
                <div ref={divUnderMessages}></div>
              </div>
            </div> 
          )}
          {!!selectedUserId && (
            <form className="flex gap-2" onSubmit={sendMessage}>
              <Form newMessageText={ newMessageText } setNewMessageText={ setNewMessageText } sendFile={ sendFile } />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
