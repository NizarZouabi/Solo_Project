import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";

const CommentForm = (props) => {
  const { postId, userPosts, setUserPosts } = props;
  const { loggedInUser } = useContext(UserContext);
  const [content, setContent] = useState("");

  useEffect(() => {
    console.log("Post ID: ", postId)
  },[postId])
  const commentHandler = (e) => {
    e.preventDefault();

    const reload = () => window.location.reload();

    const newComment = {
      content: content,
      author: loggedInUser._id,
      pfp: loggedInUser.profilePic,
      authorName: loggedInUser.firstName + " " + loggedInUser.lastName
    }
    
    axios.patch(`http://localhost:5000/posts/user/${postId}/comment`, newComment)
    .then((res) => {
      setUserPosts([...userPosts, res.data])
      reload()
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return (
    <div className="border bg-gray-50" style={{ borderRadius: "16px" }}>
      <div className="display: flex justify-center">
        <form className="text-center text-xl py-5" style={{ width: "80%" }} onSubmit={commentHandler}>
          <div className="display: flex flex-col mb-2">
            <label className="font-bold text-gray-600">Comment:</label>
            <textarea
              type="text"
              cols={40}
              rows={20}
              className="p-4 m-1 border border-gray-400 rounded-lg h-24"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button className="shadow-md bg-blue-400 hover:bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-full">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentForm;
