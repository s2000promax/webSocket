import React, { useEffect, useState } from 'react';

export type ChatMessageType = {
  message: string,
  photo: string,
  userId: number,
  userName: string
}

const ChatPage: React.FC = () => {
  return (
    <div>
      <Chat/>
    </div>
  );
}

const Chat: React.FC = () => {
  const [wsChannel, setWsChannel] = useState<WebSocket | null>(null);

  useEffect(() => {

    function creatChannel() {
      setWsChannel(new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx'))
    }

    creatChannel();
  }, []);

  useEffect(() => {
    wsChannel?.addEventListener('close', () => {
      console.log('close ws');
    });
  }, [wsChannel]);

  return (
    <div>
      <Messages wsChannel={wsChannel}/>
      <AddMessageForm wsChannel={wsChannel}/>
    </div>
  )
}

const Messages: React.FC<{ wsChannel: WebSocket | null } > = ({ wsChannel }) => {

  const [messages, setMessages] = useState<ChatMessageType[]>([]);

  useEffect(() => {
    wsChannel?.addEventListener('message', (e) => {
      setMessages(prevState => [...prevState, ...JSON.parse(e.data)])
    });
  }, [wsChannel]);

  return (
    <div style={{ height: '400px', overflowY: 'auto' }}>
      {messages.map((m: any, index: number) => (
        <Message message={m} key={index}/>
      ))}
    </div>
  )
}

const Message: React.FC<{ message: ChatMessageType, key: number }> = ({ message, key }) => {
  return (
    <div key={key}>
      <img src={message.photo} alt='img'/> <b>{message.userName}</b>
      <br/>
      {message.message}
      <hr/>
    </div>
  )
}

const AddMessageForm: React.FC<{ wsChannel: WebSocket | null }> = ({ wsChannel }) => {
  const [message, setMessage] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    wsChannel?.addEventListener('open', () => {
      setIsReady(true);
    });
  }, [wsChannel]);

  const sendMessage = () => {
    if (!message) {
      return;
    }

    wsChannel?.send(message);
    setMessage('');
  }

  const handleChane = (e: any) => {
    setMessage(e.target.value);
  }

  return (
    <div>
      <div>
        <textarea onChange={handleChane} value={message}></textarea>
      </div>
      <div>
        <button disabled={!isReady} onClick={sendMessage}>Send</button>
      </div>

    </div>
  )
}

export default ChatPage;
