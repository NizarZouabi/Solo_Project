import Logout from "../components/Logout";
import FriendsList from "../components/FriendsList";
import PostModal from "../components/PostModal";
import { UserContext } from "../context/userContext";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Post";

const Feed = (props) => {
  const authToken = window.localStorage.getItem("userToken");
  const { loggedInUser } = useContext(UserContext);
  const { userPosts, setUserPosts, allPosts, setAllPosts, loading } = props;
  const [user, setUser] = useState({});
  const { userId } = useParams();
  // const reload = () => window.location.reload();
  const sortedPosts = allPosts
  .slice()
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  useEffect(() => {
    props.setId(userId);
  }, [userId, props.setId]);

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
        {(user && allPosts && allPosts.length > 0) ? (
          sortedPosts.map((post, idx) => (
          <Post
              key={idx}
              post={post}
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
