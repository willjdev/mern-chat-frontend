

export const connectToWs = ( handleMessage, setWs ) => {
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