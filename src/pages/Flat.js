import { useParams } from "react-router-dom";
import Header from "../components/Header";
import FlatForm from "../components/FlatForm";
import { getUserLogged } from "../services/users";
import { useEffect, useState, useRef } from "react";
import flatsImage from "../Imagenes/flats2.jpeg";
import Api from "../services/api";

export default function Flat() {
  let { id } = useParams();
  const [userId, setUserId] = useState(null);
  const [flatOwnerId, setFlatOwnerId] = useState(null); // This will be set via props
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageInput = useRef("");
  const messagesContainerRef = useRef(null);
  const api = new Api();

  useEffect(() => {
    const checkUserLogged = async () => {
      const userLogged = await getUserLogged();
      if (!userLogged) {
        window.location.href = "/";
      } else {
        setUserId(userLogged.id);
      }
    };

    checkUserLogged();
  }, []);

  const getMessages = async () => {
    try {
      const response = await api.get(`messages?flatId=${id}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (id) {
      getMessages();
    }

    const intervalId = setInterval(() => {
      getMessages();
    }, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(intervalId);
  }, [id]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = messageInput.current.value;

    try {
      const response = await api.post('messages', {
        message: message,
        flatId: id
      });

      if (response.data.status === 'success') {
        messageInput.current.value = "";
        await getMessages();
      } else {
        console.error('Error sending message:', response.data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center"
      style={{
        backgroundImage: `url(${flatsImage})`,
      }}
    >
      <div className="relative z-10 w-full">
        <Header />
      </div>
      <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gray-800 bg-opacity-50">
        <div className="container mx-auto mt-10 mb-10 ">
          <div className="grid grid-cols-1">
            <div className="  rounded-lg shadow-md ">
              <FlatForm type={"view"} id={id} setOwnerId={setFlatOwnerId} />
            </div>
          </div>
        </div>
      </div>
      <button className="fixed bottom-4 right-4 bg-purple-600 text-white p-2 rounded-full shadow-lg" onClick={() => setChatOpen(!chatOpen)}>
        <svg height="1.6em" fill="white" xmlSpace="preserve" viewBox="0 0 1000 1000" y="0px" x="0px" version="1.1">
          <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"></path>
        </svg>
      </button>
      {chatOpen && (
        <div className="fixed bottom-16 right-4 bg-white rounded-lg shadow-lg w-80 max-h-96 overflow-hidden flex flex-col">
          <div className="bg-purple-600 text-white p-4">
            <h2 className="text-lg">Flat finder</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto" ref={messagesContainerRef}>
            {messages.map((item) => {
              const messageTime = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isCurrentUser = item.userID && item.userID._id === userId;
              const isOwner = item.userID && item.userID._id === flatOwnerId; // Comparison with flatOwnerId

              let messageClass = "";
              if (isCurrentUser) {
                messageClass = "bg-purple-500";
              } else if (isOwner) {
                messageClass = "bg-purple-400";
              } else {
                messageClass = "bg-purple-400";
              }

              return (
                <div
                  key={item._id}
                  className={`message mb-2 p-2 rounded-lg ${messageClass} text-white`}
                >
                  <p>{item.message}</p>
                  <div className="text-xs mt-1 flex justify-between">
                    <span>{isOwner ? 'Owner' : item.userID ? item.userID.firstName : 'Unknown'}</span>
                    <span>{messageTime}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesContainerRef} />
          </div>
          <div className="p-4 bg-gray-100 flex items-center">
            <input
              className="flex-1 p-2 border rounded-lg"
              placeholder="Type your message"
              type="text"
              ref={messageInput}
              onKeyDown={handleKeyDown}
            />
            <button className="ml-2 bg-purple-600 text-white p-2 rounded-lg" onClick={handleSubmit}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
