import { Route, Routes, useNavigate } from "react-router-dom"
import Register from "./views/Register"
import Login from "./views/Login"
import Feed from "./views/Feed"
import Profile from "./views/Profile"
import AddFriends from "./views/AddFriends"
import Conversation from "./views/Conversation"
import io from "socket.io-client"
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { UserContext } from "./context/userContext"
import './App.css'

function App() {
  const authToken = window.localStorage.getItem("userToken");
  const [socket] = useState(() => io(":5000"))
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [userPosts, setUserPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const { loggedInUser } = useContext(UserContext);
  const Nav = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected")
      setIsConnected(true)
    })
    socket.on("disconnect", () => {
      console.log("disconnected")
      setIsConnected(false)
    })
  }, [socket])

  useEffect(() => {
    if (!loggedInUser) {
      Nav("/login");
    }
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/posts/user/${id}/all`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          setAllPosts(res.data.userAndFriendsPosts);
          console.log(res.data.userAndFriendsPosts);
          setUserPosts(res.data.userPosts);
          console.log(res.data.userPosts);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [id, authToken, setUserPosts, setAllPosts]);

  return (
    <Routes>
      <Route path="/" element={<Register />} default />

      <Route path="/login" element={<Login />} />
      
      <Route path="/posts/user/:userId/feed" element={<Feed userPosts={userPosts} setUserPosts={setUserPosts} allPosts={allPosts} setAllPosts={setAllPosts} setId={setId} loading={loading}
      />} />

      <Route path="/user/:userId" element={<Profile userPosts={userPosts} setUserPosts={setUserPosts} setId={setId} loading={loading}
      />} />

      <Route path="/user/:userId/find" element={<AddFriends />} />

      <Route path="/user/:userId/conversation/:friendId/messages/show" element={<Conversation socket={socket} />} />
    </Routes>
  )
}

export default App