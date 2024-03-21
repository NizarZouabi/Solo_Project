// import { useContext} from 'react';
// import { UserContext } from '../context/userContext';
import Logout from "../components/Logout";
import FriendsList from "../components/FriendsList";
import PostModal from "../components/PostModal";
import { UserContext } from "../context/userContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Post from "../components/Post";

const Feed = (props) => {
  const Nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const authToken = window.localStorage.getItem("userToken");
  const { userPosts, setUserPosts } = props;
  const reload = () => window.location.reload();
  const [allPosts, setAllPosts] = useState([]);
  const sortedPosts = allPosts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => {
    if (!loggedInUser) {
      Nav("/login");
    }
    if (!loading && loggedInUser && loggedInUser._id) {
      axios
        .get(`http://localhost:5000/posts/user/${loggedInUser._id}/feed`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          setAllPosts(res.data.allPosts);
          console.log(sortedPosts);
          setUserPosts(res.data.userPosts);
          console.log(res.data.userPosts);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [loggedInUser, setUserPosts, loading, authToken]);

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
      <div className="container-2xl w-full shadow-lg pt-5 border-solid border-black border-b pb-3 px-20 bg-gray-300 display: flex flex-row justify-end gap-2 position: fixed top-0 z-10">
        <Link
          to={`/user/${loggedInUser._id}`}
          className="bg-gray-500 shadow-md hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full"
        >
          Profile
        </Link>
        <Logout />
      </div>
      <div style={{ position: "relative" }}>
        <PostModal
          allPosts={allPosts}
          setAllPosts={setAllPosts}
          userPosts={userPosts}
          setUserPosts={setUserPosts}
        />
      </div>
      <div>
        <FriendsList />
      </div>
      <div>
        {sortedPosts && sortedPosts.length > 0 ? (
          sortedPosts.map((feedPost, idx) => (
            <Post
              key={idx}
              post={feedPost}
              user={
                feedPost.author
                  ? {
                      firstName: feedPost.author.firstName,
                      lastName: feedPost.author.lastName,
                      profilePic: feedPost.author.profilePic,
                    }
                  : null
              }
              allPosts={allPosts}
              setAllPosts={setAllPosts}
              userPosts={userPosts}
              setUserPosts={setUserPosts}
            />
          ))
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
    </div>
  );
};

export default Feed;
