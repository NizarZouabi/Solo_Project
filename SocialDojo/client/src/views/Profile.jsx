// import { useContext, useState } from 'react';
// import { UserContext } from '../context/userContext';
import Model from "react-modal";
import Logout from "../components/Logout";
import PostModal from "../components/PostModal";
import FriendsList from "../components/FriendsList";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import Post from "../components/Post";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Profile = (props) => {
  const { userId } = useParams();
  const [visiblePfp, setVisiblePfp] = useState(false);
  const [visibleBanner, setVisibleBanner] = useState(false);
  const [setErrors] = useState([]);
  // const { sharedPosts, setSharedPosts } = props
  const authToken = window.localStorage.getItem("userToken");
  const { loggedInUser } = useContext(UserContext);
  const [user, setUser] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const { userPosts, setUserPosts } = props;
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const sortedPosts = userPosts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const reload = () => window.location.reload();

  const pfpSubmitHandler = (e) => {
    e.preventDefault();

    const profileFormData = new FormData();
    profileFormData.append("file", profilePic);

    axios
      .patch(`http://localhost:5000/user/${userId}/pfp/upload`, profileFormData)
      .then((res) => {
        console.log(res.data);
        reload();
      })
      .catch((err) => {
        setErrors(err);
        console.log(err);
      });
  };

  const bannerSubmitHandler = (e) => {
    e.preventDefault();

    const profileFormData = new FormData();
    profileFormData.append("file", coverPic);
    profileFormData.append("imageType", "CoverPic");

    axios
      .patch(
        `http://localhost:5000/user/${userId}/banner/upload`,
        profileFormData
      )
      .then((res) => {
        console.log(res.data);
        reload();
      })
      .catch((err) => {
        setErrors(err);
        console.log(err);
      });
  };

  useEffect(() => {
    if (loggedInUser && loggedInUser._id) {
      axios
        .get(`http://localhost:5000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data.user);
          setUser(res.data.user);
          setProfilePic(res.data.user.profilePic);
          setCoverPic(res.data.user.coverPic);
          console.log(res.data.user.coverPic);
          console.log(res.data.user.profilePic);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedInUser, userId, authToken]);

  const inviteFriend = (e) => {
    e.preventDefault();

    axios.post(`http://localhost:5000/user/${loggedInUser._id}/invite/${userId}`)
    .then((res) => {
      setPendingRequests([...pendingRequests, res.data]);
    })
  }

  const addFriend = (e) => {
    e.preventDefault();

    axios.post(`http://localhost:5000/user/${loggedInUser._id}/friend/${userId}`)
    .then((res) => {
      setUserFriends([...userFriends, res.data]);
    })
  }

  useEffect(() => {
    if (!loading && userId) {
      axios
        .get(`http://localhost:5000/posts/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          setUserPosts(res.data.userPosts);
          setLoading(false);
          console.log(res.data.userPosts);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [setUserPosts, loading, authToken, userId]);

  if (loading) {
    return (
      <div className="display: flex justify-center mt-80 font-semibold">
        Loading Data...
      </div>
    );
  }

  return (
    <div className="">
      <div
        className="shadow-lg pt-5 border-solid border-black border-b pb-3 px-20 bg-gray-300"
        style={{ height: "21vh", marginLeft: "15%" }}
      >
        {coverPic &&
        coverPic !==
          "https://cdn3.f-cdn.com/contestentries/1683544/29258875/5de652e07bf20_thumb900.jpg" ? (
          <img
            className="bg-center"
            src={`http://localhost:5000/public/images/${coverPic}`}
            alt=""
            style={{
              marginLeft: "15%",
              position: "absolute",
              top: "0",
              right: "0",
              left: "0",
              width: "85%",
              height: "20.9vh",
              objectFit: "cover",
            }}
          />
        ) : (
          <img
            className="bg-center"
            src="https://cdn3.f-cdn.com/contestentries/1683544/29258875/5de652e07bf20_thumb900.jpg"
            alt=""
            style={{
              marginLeft: "15%",
              position: "absolute",
              top: "0",
              right: "0",
              left: "0",
              width: "85%",
              height: "20.9vh",
              objectFit: "cover",
            }}
          />
        )}
        <div className="position: absolute ms-24 mt-6 ">
          <h2
            className="text-gray-50 text-7xl font-bold"
            style={{
              WebkitTextStroke: "1px black",
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: "-1%", height: "1%" },
              textShadowRadius: "5%",
            }}
          >
            {user.firstName} {user.lastName}
          </h2>
        </div>
        <div className="">
          <div className="display: flex justify-end gap-5 position: sticky">
            {loggedInUser._id !== user._id ? (
              <Link
                to={`/user/${loggedInUser._id}`}
                className="bg-gray-500 shadow-md hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full"
              >
                Profile
              </Link>
            ) : null}
            <a
              className="bg-gray-500 shadow-md hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full"
              href="/feed"
            >
              Your feed
            </a>
            <Logout />
          </div>
          <div className="display: flex justify-end">
            {loggedInUser._id == user._id ? (
              <button
                className="bg-gray-500 shadow-md hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-full position: absolute mt-20"
                onClick={() => setVisibleBanner(true)}
              >
                Change banner picture
              </button>
            ) : (<button
            className="bg-gray-500 shadow-md hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-full position: absolute mt-20 me-32"
            onClick={() => setVisibleBanner(true)}
          >
            Add
          </button>)}
            <Model
              ariaHideApp={false}
              isOpen={visibleBanner}
              onRequestClose={() => setVisibleBanner(false)}
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(2px)",
                  WebkitBackdropfilter: "blur(2px)",
                },
                content: {
                  top: "50%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  marginRight: "-50%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "16px",
                },
              }}
            >
              <button
                className="pb-1 text-sm font-semibold border rounded-md bg-red-500 px-2 hover:bg-red-700 text-white me-7 position: absolute end-0"
                onClick={() => setVisibleBanner(false)}
              >
                x
              </button>
              <label className="text-sm">Upload banner</label>
              <div className="display:flex justify-center flex-col my-2">
                <form onSubmit={bannerSubmitHandler}>
                  <input
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    type="file"
                    name="coverPic"
                    onChange={(e) => setCoverPic(e.target.files[0])}
                  />
                  <button className="shadow-md bg-green-400 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-full position: sticky mt-5 ms-24">
                    Done
                  </button>
                </form>
              </div>
            </Model>
          </div>
        </div>

        <div className="display: flex justify-center gap-1">
          <span
            className="shadow-md rounded-full mt-24"
            style={{ position: "absolute", top: "0", padding: "100.5px" }}
          >
            {profilePic &&
            profilePic !==
              "https://avatarfiles.alphacoders.com/239/239030.jpg" ? (
              <img
                className="rounded-full"
                src={`http://localhost:5000/public/images/${profilePic}`}
                alt=""
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  left: "0",
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
                  position: "absolute",
                  top: "0",
                  right: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  objectFit: "fill",
                }}
              />
            )}
          </span>
          {loggedInUser._id == user._id ? (
            <button
              className="bg-transparent shadow-md hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full position: sticky mt-52"
              onClick={() => setVisiblePfp(true)}
            >
              +
            </button>
          ) : null}
          <Model
            ariaHideApp={false}
            isOpen={visiblePfp}
            onRequestClose={() => setVisiblePfp(false)}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(2px)",
                WebkitBackdropfilter: "blur(2px)",
              },
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                borderRadius: "16px",
              },
            }}
          >
            <button
              className="pb-1 text-sm font-semibold border rounded-md bg-red-500 px-2 hover:bg-red-700 text-white me-7 position: absolute end-0"
              onClick={() => setVisiblePfp(false)}
            >
              x
            </button>
            <label className="text-sm">Upload profile picture </label>
            <div className="display:flex justify-center flex-col my-2">
              <form onSubmit={pfpSubmitHandler}>
                <input
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  type="file"
                  name="profilePic"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
                <button className="shadow-md bg-green-400 hover:bg-green-500 text-white text-sm font-bold py-2 px-4 rounded-full position: sticky mt-5 ms-24">
                  Done
                </button>
              </form>
            </div>
          </Model>
        </div>
      </div>

      <div className="position absolute top-24">
        {loggedInUser._id == user._id ? (
          <PostModal userPosts={userPosts} setUserPosts={setUserPosts} />
        ) : null}
        <FriendsList />
      </div>

      {loggedInUser && sortedPosts.length > 0 ? (
        sortedPosts.map((post, idx) => (
          <Post key={idx} post={post} user={user} profilePic={profilePic} userPosts={userPosts} setUserPosts={setUserPosts} />))
      ) : (
        <div>
          <p
            className="text-center"
            style={{ position: "absolute", top: "50%", left: "55%" }}
          >
            No posts yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
