import { Button, TextField } from '@material-ui/core';
import React from 'react';
import { Socket,io } from 'socket.io-client';

const socket = io('127.0.0.1:8000');
const SockComponent = () => {
    const [messages, setMessages] = React.useState<string[]>([]);
    const [messageInput, setMessageInput] = React.useState<string>('');
  
    React.useEffect(() => {
      // Connect to the server
      socket.connect();
  
      // Listen for incoming messages
      socket.on('message', (msg: string) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
  
      return () => {
        // Disconnect when the component unmounts
        socket.disconnect();
      };
    }, []);
  
    const sendMessage = () => {
      if (messageInput.trim() !== '') {
        // Send a message to the server
        socket.emit('message', messageInput);
        setMessageInput('');
      }
    };
    return (
        <div style={{ fontFamily: '"Ubuntu Mono", monospace', justifyContent: 'center', width: "100%", height: "100vh", display: 'flex', flexDirection: "row", backgroundColor: '#333',  }}>
            <div style={{ justifyContent: 'center', width: "100%", height: "100%", display: 'flex', flexDirection: "row", backgroundColor: '#111' }} >
                <div style={{ gap: 20,  padding:"10%", justifyContent: 'center',height: "100%", width: "100%", display: 'flex', flexDirection: "column", backgroundColor: '#999' }}>
                    <h1>
                       MESSAGE TO SERVER
                    </h1>
                    <TextField type="text"
                        value={messageInput}
                        onKeyDown={(e)=>{ e.key == 'Enter' ? sendMessage(): ():void => {} }}
                        onChange={(e) => setMessageInput(e.target.value)} 
                        autoComplete="off" style={{ width: "50%" }} variant={'outlined'}></TextField>
                
                </div>
            </div>
            <div style={{ justifyContent: 'center', width: "100%", height: "100%", display: 'flex', flexDirection: "row", backgroundColor: '#111' }} >
                <div style={{ overflow:"hidden",color:"#fff",gap: 20 ,height: "100%",justifyContent: 'center', width: "100%", display: 'flex',padding:"10%",  flexDirection: "column", backgroundColor: '#666' }}>
                    <h1>
                       MESSAGE FROM SERVER
                    </h1>
                    <div style={{ overflow:'scroll',backgroundColor:"#000", borderColor:"#fff",borderWidth:"1px",borderStyle:"solid",borderRadius:'10px'}}>
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index}>{msg}</li>
                        ))}
                    </ul>
                    </div>
                </div>
            </div>
        </div>
    );


}

export default SockComponent;