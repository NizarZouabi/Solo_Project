import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import FriendsList from "../components/FriendsList";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function Conversation(props) {
  const authToken = window.localStorage.getItem("userToken");
  const { loggedInUser } = useContext(UserContext);
  const [input, setInput] = useState("");
  const { socket } = props;
  const [messages, setMessages] = useState([]);
  const { friendId } = useParams();
  const [friend, setFriend] = useState({});

  useEffect(() => {
    socket.emit("userId", loggedInUser._id);

    const messageListener = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("message", messageListener);

    return () => {
      socket.off("message", messageListener);
    };
  }, [loggedInUser._id, socket]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/user/${friendId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        setFriend(res.data.user);
        console.log(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [friendId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    {
      loggedInUser &&
        loggedInUser._id &&
        axios
          .post(
            `http://localhost:5000/user/${loggedInUser._id}/conversation/${friendId}/messages`,
            {
              senderId: loggedInUser._id,
              receiverId: friendId,
              content: input,
            },
            {
              headers: { Authorization: `Bearer ${authToken}` },
              withCredentials: true,
            }
          )
          .then((res) => {
            console.log("Sent message content:", res.data);
            socket.emit("message", {
              senderId: loggedInUser._id,
              receiverId: friendId,
              content: input,
            });
            setInput("");
          })
          .catch((err) => {
            console.log(err);
          });
    }
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/user/${loggedInUser._id}/conversation/${friendId}/messages/show`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          withCredentials: true,
        }
      )
      .then((res) => {
        setMessages(res.data.messages);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [loggedInUser._id, friendId, messages]);

  return (
    <div>
      <FriendsList socket={socket} />
      <div
        className="container ms-80 position: absolute"
        style={{ width: "80%" }}
      >
        <div
          className="text-gray-500 text-2xl border border-gray-500 rounded-lg m-10 shadow-md bg-gray-300"
          style={{ height: "90vh" }}
        >
          <Link
            to={`/posts/user/${loggedInUser._id}/feed`}
            className="bg-gray-500 shadow-md text-sm hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full z-10"
            style={{ position: "absolute", top: "6%", right: "4%" }}
          >
            Your feed
          </Link>
          {friend.coverPic &&
          friend.coverPic !==
            "https://cdn3.f-cdn.com/contestentries/1683544/29258875/5de652e07bf20_thumb900.jpg" ? (
            <img
              className="bg-center "
              src={`http://localhost:5000/public/images/${friend.coverPic}`}
              alt=""
              style={{
                marginLeft: "41px",
                position: "absolute",
                top: "4.3%",
                right: "0",
                left: "0",
                width: "1448px",
                height: "15.2vh",
                objectFit: "cover",
                borderRadius: "5px 5px 0 0",
              }}
            />
          ) : (
            <img
              className="bg-center"
              src="https://cdn3.f-cdn.com/contestentries/1683544/29258875/5de652e07bf20_thumb900.jpg"
              alt=""
              style={{
                marginLeft: "41px",
                position: "absolute",
                top: "4.3%",
                right: "0",
                left: "0",
                width: "1448px",
                height: "15.2vh",
                objectFit: "cover",
                borderRadius: "5px 5px 0 0",
              }}
            />
          )}
          <div className="border-b border-gray-500 pt-36 shadow-md bg-gray-300 display: flex justify-center"></div>
          <span
            className="shadow-md rounded-full border border-gray-500"
            style={{
              position: "absolute",
              top: "12%",
              left: "45%",
              width: "150px",
              height: "150px",
            }}
          >
            {friend.profilePic &&
            friend.profilePic !==
              "https://avatarfiles.alphacoders.com/239/239030.jpg" ? (
              <img
                className="rounded-full"
                src={`http://localhost:5000/public/images/${friend.profilePic}`}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "fill",
                }}
              />
            ) : (
              <img
                className="rounded-full"
                src="https://avatarfiles.alphacoders.com/239/239030.jpg"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "fill",
                }}
              />
            )}
            <Link to={`/user/${friend._id}`}>
              <p className="hover:underline text-center font-semibold">
                {friend.firstName} {friend.lastName}
              </p>
            </Link>
          </span>

          <div
            className="mx-3 border-b border-e border-s border-gray-500 bg-gray-50 overflow-y-auto"
            style={{ height: "65vh" }}
          >
            <div className="mx-5 pt-28 overflow-y-auto display: flex flex-col">
              {messages.map((message, idx) => (
                <div key={idx} class="px-4 py-2">
                  {message.senderId === friend._id ? (
                    <div class="flex items-center mb-2">
                      <span
                        className="shadow-md rounded-full border border-gray-500"
                        style={{ width: "60px", height: "60px" }}
                      >
                        {friend.profilePic &&
                        friend.profilePic !==
                          "https://avatarfiles.alphacoders.com/239/239030.jpg" ? (
                          <img
                            className="rounded-full"
                            src={`http://localhost:5000/public/images/${friend.profilePic}`}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "fill",
                            }}
                          />
                        ) : (
                          <img
                            className="rounded-full"
                            src="https://avatarfiles.alphacoders.com/239/239030.jpg"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "fill",
                            }}
                          />
                        )}
                      </span>
                      <div className="display: flex flex-col">
                        <Link to={`/user/${friend._id}`}>
                          <p className="hover:underline font-semibold ms-1 mb-1">
                            {friend.firstName} {friend.lastName}
                          </p>
                        </Link>
                        <div class="bg-white  rounded-full px-5 py-2 shadow mb-2 max-w-sm ms-1">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div class="flex items-center justify-end">
                      <div class="bg-blue-500 text-white rounded-full px-5 py-2 shadow mr-2 max-w-sm">
                        {message.content}
                      </div>
                      <span
                        className="shadow-md rounded-full border border-gray-500"
                        style={{ width: "60px", height: "60px" }}
                      >
                        {loggedInUser.profilePic &&
                        loggedInUser.profilePic !==
                          "https://avatarfiles.alphacoders.com/239/239030.jpg" ? (
                          <img
                            className="rounded-full"
                            src={`http://localhost:5000/public/images/${loggedInUser.profilePic}`}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "fill",
                            }}
                          />
                        ) : (
                          <img
                            className="rounded-full"
                            src="https://avatarfiles.alphacoders.com/239/239030.jpg"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "fill",
                            }}
                          />
                        )}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={sendMessage}
            className="bg-white mx-3 border rounded-full py-2 px-5 mt-5 border-gray-400 display: flex flex-row justify-between shadow-md"
            style={{ height: "" }}
          >
            <input
              placeholder="Write a Message"
              className="outline-none w-full"
              type="text"
              name="message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold pb-1 px-4 rounded-full ms-1 shadow-md">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
