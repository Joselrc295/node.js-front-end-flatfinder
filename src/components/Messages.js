import { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { Box, Button, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import Api from "../services/api";
import whatsapp from "../Imagenes/1_qR2E0Ic0gtspweMcUr6WWw_batcheditor_fotor.jpg"

export default function Messages({ flatId }) {
  const ref = doc(db, "flats", flatId);
  // const refMessages = collection(db, "messages");
  const api = new Api();

  const [flat, setFlat] = useState({});
  const [messages, setMessages] = useState([]);
  const [responseInput, setResponseInput] = useState("");
  const messageInput = useRef("");
  const userId = JSON.parse(localStorage.getItem("user_data_logged")).id;
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const getMessages = async () => {
    try {
      const response = await api.get(`messages?flatId=${flatId}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const getFlat = async () => {
    const dataFlat = await getDoc(ref);
    const responseFlat = { ...dataFlat.data() };
    setFlat(responseFlat);
    await getMessages();
  };

  useEffect(() => {
    if (flatId) {
      getFlat();
    }

    const intervalId = setInterval(() => {
      getMessages();
    }, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(intervalId);
  }, [flatId]);

  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = messageInput.current.value;

    try {
      const response = await api.post('messages', {
        message: message,
        flatId: flatId
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

  const handleResponseSubmit = async () => {
    const responseMessage = responseInput.trim();
    if (responseMessage) {
      try {
        await api.post('messages', {
          message: responseMessage,
          flatId: flatId,
          userId: userId,
          timestamp: new Date(),
          isResponse: true
        });
        setResponseInput("");
        await getMessages();
      } catch (error) {
        console.error('Error sending response message:', error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-4xl h-[80vh] p-4 bg-white bg-opacity-90 rounded-lg flex flex-col">
        <h1 className="text-center text-2xl font-bold mb-4 text-gray-800">Messenger</h1>
        <div
          className="flex-grow overflow-auto p-4  rounded-lg mb-4"
          ref={messagesContainerRef}
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #EDF2F7',backgroundImage: `url(${whatsapp})`, backgroundSize: 'cover' }}
         
        >
          {messages.map((item) => {
            const messageTime = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const messageDate = new Date(item.createdAt).toLocaleDateString();
            let isCurrentUser = false;
            if (item.userID) {
              isCurrentUser = item.userID._id === userId;
            }
            console.log("aqui", item, isCurrentUser, userId);
            return (
              <div
                key={item._id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                  <div className={`
                    rounded-lg p-3 
                    ${isCurrentUser
                      ? 'bg-[#DCF8C6] text-black rounded-tr-none shadow-md'
                      : 'bg-white text-black rounded-tl-none shadow-md'
                    }
                    relative
                  `}>
                    <p className="text-sm break-words whitespace-pre-wrap">{item.message}</p>
                    <div className={`
                      absolute w-4 h-4 
                      ${isCurrentUser
                        ? 'right-0 -mr-2 top-0 bg-[#DCF8C6] shadow-md'
                        : 'left-0 -ml-2 top-0 bg-white shadow-md'
                      }
                      transform rotate-45
                    `}></div>
                  </div>
                  <div className={`text-xs mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                    <span className="text-white font-semibold mr-2">{item.userID ? item.userID.firstName : 'Unknown'}</span>
                    <span className="text-white font-semibold">{messageTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="flex items-end space-x-2 bg-gray-100 p-3 rounded-lg"
        >
          <TextField
            type="text"
            placeholder="Type a message..."
            inputRef={messageInput}
            multiline
            maxRows={4}
            className="flex-grow"
            variant="outlined"
            size="small"
            InputProps={{
              className: "bg-white rounded-md",
              style: { fontSize: '0.9rem' }
            }}
            onKeyDown={handleKeyDown}
          />
          {flat.user !== userId ? (
            <Button
              type="submit"
              className="bg-[#128C7E] hover:bg-[#075E54] text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out"
              variant="contained"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          ) : (
            <Button
              onClick={handleResponseSubmit}
              className="bg-[#128C7E] hover:bg-[#075E54] text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out"
              variant="contained"
              endIcon={<SendIcon />}
            >
              Reply
            </Button>
          )}
        </Box>
      </div>
    </div>
  );
}
