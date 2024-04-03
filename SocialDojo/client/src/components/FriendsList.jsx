import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";

const FriendsList = (props) => {
  const { socket } = props;
  const { loggedInUser } = useContext(UserContext);
  const authToken = window.localStorage.getItem("userToken");
  const [user, setUser] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (loggedInUser && loggedInUser._id) {
      axios
        .get(`http://localhost:5000/user/${loggedInUser._id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          setUser(res.data.user);
          console.log(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedInUser._id]);

  const handleSearch = () => {
    if (user && user.friends) {
      return user.friends.filter((friend) => {
        const fullName = `${friend.firstName} ${friend.lastName}`;
        return fullName.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    return [];
  };

  // const joinChatRoom = (e) => {
  //   e.preventDefault();

  //   socket.emit(
  //     "connection",
  //     loggedInUser.firstName + " " + loggedInUser.lastName
  //   );
  // };

  return (
    <div>
      <div
        className="border-r border-black p-2 bg-gray-300 z-10"
        style={{ position: "fixed", top: "0", left: "0", overflowX: "hidden" }}
      >
        <div>
          <img
            src="https://cdn3.iconfinder.com/data/icons/star-glyph/64/Star-search-find-investigate-512.png"
            className="position: absolute mt-3.5 ms-4"
            style={{ height: "20px", width: "20px" }}
          />
          <input
            className="ps-7 p-0.5 border rounded-lg border-gray-400 m-2 outline-none"
            style={{ width: "95%" }}
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div
          className="p-2 bg-gray-50 border border-gray-400 overflow-auto mx-2"
          style={{ height: "88vh" }}
        >
          <ul className="" style={{ height: "92vh" }}>
            {user.friends && user.friends.length > 0 && handleSearch().map((friend, idx) => (
              <li
                key={idx}
                className="font-bold display: flex flex-row gap-3 w-60 border-b py-3"
              >
                {friend.profilePic ? (
                  <span
                    className="rounded-full position: relative"
                    style={{ width: "52px", height: "45px" }}
                  >
                    <img
                      className="rounded-full"
                      src={`http://localhost:5000/public/images/${friend.profilePic}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                      }}
                      alt={`Profile of ${friend.firstName} ${friend.lastName}`}
                    />
                  </span>
                ) : (
                  <span
                    className="rounded-full position: relative"
                    style={{ width: "52px", height: "45px" }}
                  >
                    <img
                      className="rounded-full"
                      src="https://avatarfiles.alphacoders.com/239/239030.jpg"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                      }}
                      alt={`Profile of ${friend.firstName} ${friend.lastName}`}
                    />
                  </span>
                )}
                <Link
                  className="text-black hover:underline hover:text-green-500 overflow-hidden whitespace-nowrap overflow-ellipsis text-xl my-1 w-5/6"
                  to={`/user/${loggedInUser._id}/conversation/${friend.userId}/messages/show`}
                >
                  {`${friend.firstName} ${friend.lastName}`}
                </Link>
              </li>
            ))}
            {handleSearch().length === 0 && (
              <div className="m-3">
                <p className="text-center">No friends found.</p>
              </div>
            )}
          </ul>
        </div>
        <div className="display: flex flex-row gap-2 mx-10 mb-1 p-3 bottom-0">
          <img
            src="https://static.thenounproject.com/png/4306405-200.png"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "80%",
              cursor: "pointer",
            }}
          />
          <Link
            to={`/user/${loggedInUser._id}/find`}
            className="bg-gray-500 shadow-md hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full"
          >
            Invite Someone
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
