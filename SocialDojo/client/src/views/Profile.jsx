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
import Requests from "../components/Requests";

const Profile = (props) => {
  const { userId } = useParams();
  const [visiblePfp, setVisiblePfp] = useState(false);
  const [visibleBanner, setVisibleBanner] = useState(false);
  const [setErrors] = useState([]);
  // const { sharedPosts, setSharedPosts } = props
  const authToken = window.localStorage.getItem("userToken");
  const { loggedInUser } = useContext(UserContext);
  const { userPosts, setUserPosts } = props;
  const [user, setUser] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const sortedPosts = userPosts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const reload = () => window.location.reload();

  const getGenderPronoun = (gender) => {
    return gender === "Male" ? "his" : gender === "Female" ? "her" : null;
  };

  const pfpSubmitHandler = (e) => {
    e.preventDefault();

    const profileFormData = new FormData();
    profileFormData.append("file", profilePic);

    axios
      .patch(
        `http://localhost:5000/user/${loggedInUser._id}/pfp/upload`,
        profileFormData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
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

  const bannerSubmitHandler = (e) => {
    e.preventDefault();

    const profileFormData = new FormData();
    profileFormData.append("file", coverPic);
    profileFormData.append("imageType", "CoverPic");

    axios
      .patch(
        `http://localhost:5000/user/${userId}/banner/upload`,
        profileFormData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
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
          setPendingRequests(res.data.pendingRequests);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedInUser, userId, authToken]);

  const inviteFriend = (e) => {
    e.preventDefault();

    if (!loggedInUser || !loggedInUser._id) {
      console.error("User not logged in");
      return;
    }
    if (!loading && userId) {
      axios
        .patch(
          `http://localhost:5000/user/${loggedInUser._id}/invite/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res.data);
          reload();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const cancelRequest = (e) => {
    e.preventDefault();

    axios
      .patch(
        `http://localhost:5000/user/${loggedInUser._id}/friend/${userId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        reload();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const removeFriend = (e) => {
    e.preventDefault();

    axios.patch(`http://localhost:5000/user/${loggedInUser._id}/friend/${userId}/remove`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      withCredentials: true,
    }
  ).then((res) => {
    reload()
    console.log(res.data);
  }).catch((err) => {
    console.error(err);
  })
  }

  useEffect(() => {
    if (!loading && userId) {
      axios
        .get(`http://localhost:5000/posts/user/${userId}/feed`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          setUserPosts(res.data.userPosts);
          console.log(res.data.userPosts);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [loggedInUser, userId, authToken, loading, setUserPosts]);

  const birthdate = (date) => {
    let d = new Date(date);
    let options = { month: "long", day: "numeric", year: "numeric" };
    return d.toLocaleString("en-US", options);
  };

  if (loading) {
    return (
      <div className="display: flex justify-center mt-80 font-semibold">
        Loading Data...
      </div>
    );
  }

  if (!authToken) {
    return (
      <p className="m-5 font-bold text-red-500">
        Please login to view this page.
      </p>
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
            className="text-gray-50 text-7xl font-bold overflow-hidden whitespace-nowrap overflow-ellipsis"
            style={{
              maxWidth: "29vw",
              WebkitTextStroke: "1px black",
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: "-1%", height: "1%" },
              textShadowRadius: "5%",
            }}
          >{user.firstName} {user.lastName}
          </h2>
        </div>
        {loggedInUser._id == user._id && (
          <div className="position: absolute mt-28">
            <Requests />
          </div>
        )}
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
            <Link
              to={`/posts/user/${loggedInUser._id}/feed`}
              className="bg-gray-500 shadow-md hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full"
            >
              Your feed
            </Link>
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
            ) : null}

            {loggedInUser._id !== user._id &&
              user &&
              user.pendingRequests &&
              (user.pendingRequests.some(
                (request) => request.senderId === loggedInUser._id
              ) ? (
                <button
                  className="bg-gray-500 shadow-md hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-full position: absolute mt-20 me-32"
                  onClick={cancelRequest}
                >
                  Cancel
                </button>
              ) : user.friends &&
                user.friends.some(
                  (friend) => friend.userId === loggedInUser._id
                ) ? (
                <button
                  className="bg-red-500 shadow-md hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-full position: absolute mt-20 me-32"
                  onClick={removeFriend}
                >
                  Remove Friend
                </button>
              ) : (
                <button
                  className="bg-gray-500 shadow-md hover:bg-gray-400 text-white font-semibold py-2 px-4 rounded-full position: absolute mt-20 me-32"
                  onClick={inviteFriend}
                >
                  Add Friend
                </button>
              ))}

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

      <div className="" style={{ position: "relative", top: "0" }}>
        {loggedInUser._id == user._id ? (
          <PostModal userPosts={userPosts} setUserPosts={setUserPosts} />
        ) : null}
        <FriendsList />
      </div>

      {loggedInUser._id === user._id ? (
        <div>
          {sortedPosts.length > 0 ? (
            sortedPosts.map((profilePost, idx) => (
              <Post
                key={idx}
                post={profilePost}
                user={user}
                profilePic={profilePic}
                userPosts={userPosts}
                setUserPosts={setUserPosts}
              />
            ))
          ) : (
            <div>
              {userPosts.length === 0 && (
                <p
                  className="bg-gray-50 mt-48 mb-10 text-center position: sticky"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "27.5%",
                    width: "60%",
                  }}
                >
                  No posts yet.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          {user.friends &&
          !user.friends.some((friend) => friend.userId === loggedInUser._id) ? (
            <p
              className="bg-gray-50 mt-48 mb-10 text-center position: sticky"
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "27.5%",
                width: "60%",
              }}
            >
              Add this user as a friend to see {getGenderPronoun(user.gender)}{" "}
              posts.
            </p>
          ) : sortedPosts.length > 0 ? (
            sortedPosts.map((profilePost, idx) => (
              <Post
                key={idx}
                post={profilePost}
                user={user}
                profilePic={profilePic}
                userPosts={userPosts}
                setUserPosts={setUserPosts}
              />
            ))
          ) : (
            <p
              className="bg-gray-50 mt-48 mb-10 text-center position: sticky"
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "27.5%",
                width: "60%",
              }}
            >
              No posts yet.
            </p>
          )}
        </div>
      )}
      <div className="display: flex justify-center ms-72 mb-10 font-semibold text-xl text-gray-500">
        <p>
          {user.gender}, Born at {birthdate(user.birthdate)}
        </p>
      </div>
    </div>
  );
};

export default Profile;
