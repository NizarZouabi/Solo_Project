import { Link, useParams, useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";

const AddFriends = () => {
  const authToken = window.localStorage.getItem("userToken");
  const Nav = useNavigate();
  const { loggedInUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    if (loggedInUser && loggedInUser._id && userId) {
      axios
        .get(
          `http://localhost:5000/user/${userId}/find`,{
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res.data.users);
          setUsers(res.data.users);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [loggedInUser, userId]);

  if (!authToken) {
    return (<p className="m-5 font-bold text-red-500">Please login to view this page.</p>)
  }

  if (loading) {
    return (
      <div className="display: flex justify-center mt-80 font-semibold">
        Loading Data...
      </div>
    );
  }

  return (
    <div>
      <div className="container-2xl w-full shadow-lg pt-5 border-solid border-black border-b pb-3 px-20 bg-gray-300 display: flex flex-row justify-between">
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
          />
        </div>
        <div className="display: flex gap-2 my-1">
          <Link
            to={`/user/${loggedInUser._id}`}
            className="bg-gray-500 shadow-md hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full"
          >
            Profile
          </Link>
          <Link
            to={`/feed`}
            className="bg-gray-500 shadow-md hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full"
          >
            Your feed
          </Link>
          <Logout />
        </div>
      </div>
      <div
        className="container border-2 border-gray-400 display:flex align-center overflow-x-auto overflow-y-hidden bg-gray-50 shadow-lg"
        style={{
          position: "absolute",
          top: "15%",
          left: "11%",
          width: "80%",
          height: "80%",
        }}
      >
        <div className="display: grid grid-cols-3 overflow-auto w-full h-full">
          {loggedInUser && users.length > 0 ? (
            users.map((user, idx) => (
              <div
                key={idx}
                className="container m-24 p-2 display: flex flex-row border rounded-full w-1/6 gap-5 bg-white hover:bg-blue-500 shadow text-gray-500 hover:text-white" style={{ width: "250px", height: "68px" }}
              >
                {user.profilePic &&
                user.profilePic !==
                  "https://avatarfiles.alphacoders.com/239/239030.jpg" ? (
                  <img
                    className="border border-solid border-gray-400 rounded-full"
                    src={`http://localhost:5000/public/images/${user.profilePic}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "fill",
                    }}
                  />
                ) : (
                  <img
                    className="border border-solid border-gray-400 rounded-full"
                    src="https://avatarfiles.alphacoders.com/239/239030.jpg"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "fill",
                    }}
                  />
                )}
                <Link
                  to={`/user/${user._id}`}
                  className="font-semibold text-xl mt-2 hover:underline overflow-hidden whitespace-nowrap overflow-ellipsis"
                >
                  <span className="me-2">{user.firstName}</span>
                  <span className="">{user.lastName}</span>
                </Link>
              </div>
            ))
          ) : (
            <div>
              <p>No other users available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFriends;
