import { useParams } from "react-router-dom";
import Header from "../components/Header";
import FlatForm from "../components/FlatForm";
import { getUserLogged } from "../services/users";
import { useEffect, useState, useRef } from "react";
import { Box, Container, Grid } from "@mui/material";
import flatsImage from "../Imagenes/flats2.jpeg";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
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
      style={{
        backgroundImage: `url(${flatsImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        zIndex: -2,
      }}
    >
      <div style={{ position: "relative", zIndex: 1301, alignSelf: "stretch" }}>
        <Header />
      </div>
      <Box sx={{ minHeight: "100vh", width: "100%" }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <FlatForm type={"view"} id={id} setOwnerId={setFlatOwnerId} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Botón para abrir el chat */}
      <button className="chatBtn" onClick={() => setChatOpen(!chatOpen)}>
        <svg height="1.6em" fill="white" xmlSpace="preserve" viewBox="0 0 1000 1000" y="0px" x="0px" version="1.1">
          <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"></path>
        </svg>
     
      </button>
      {chatOpen && (
        <div className="chat-card">
          <div className="chat-header">
            <div className="h2">Flat finder</div>
          </div>
          <div className="chat-body" ref={messagesContainerRef}>
            {messages.map((item) => {
              const messageTime = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isCurrentUser = item.userID && item.userID._id === userId;
              const isOwner = item.userID && item.userID._id === flatOwnerId; // Comparison with flatOwnerId

              return (
                <div
                  key={item._id}
                  className={`message ${isCurrentUser ? 'outgoing' : 'incoming'}`}
                  style={{ backgroundColor: isCurrentUser ? '#7B2CBF' : '#3A0CA3', color: 'white' }}
                >
                  <p>{item.message}</p>
                  <div className="message-details">
                    <span>{isOwner ? 'Owner' : item.userID ? item.userID.firstName : 'Unknown'}</span>
                    <span>{messageTime}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesContainerRef} />
          </div>
          <div className="chat-footer">
            <input
              placeholder="Type your message"
              type="text"
              ref={messageInput}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSubmit}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
