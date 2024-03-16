import { useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";

const PostForm = (props) => {
  // const authToken = localStorage.getItem('userToken')
  const { loggedInUser } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author] = useState(loggedInUser._id);
  const [file, setFile] = useState(null);
  const { userPosts, setUserPosts } = props
  // const { sharedPosts, setSharedPosts } = props

  const submitHandler = (e) => {
    e.preventDefault();

    const reload = () => window.location.reload();

    const postFormData = new FormData();
    postFormData.append("title", title);
    postFormData.append("content", content);
    postFormData.append("author", author);
    postFormData.append("file", file);

    axios
      .post("http://localhost:5000/posts/new", postFormData)
      .then((res) => {
        console.log(res.data);
        setUserPosts([...userPosts, res.data.newPost]);
        setTitle("");
        setContent("");
        setFile(null);
        reload();
      })
      .catch((err) => {
        setErrors(err.response);
        console.log(err.response);
      });
  };

  return (
    <div className="border bg-gray-50" style={{ borderRadius: "16px" }}>
      <div className="display: flex justify-center">
        <form
          className="text-center text-xl py-5"
          style={{ width: "80%" }}
          onSubmit={submitHandler}
        >
          <div className="display: flex flex-col mb-2">
            <label className="font-bold text-gray-600">Title:</label>
            <input
              className="p-1 m-1 border border-gray-400 rounded-lg"
              name="title"
              value={title}
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title ? (
              <p className=" text-red-500">{errors.title.message}</p>
            ) : null}
          </div>
          <div className="display: flex flex-col mb-2">
            <label className="font-bold text-gray-600">Content:</label>
            <textarea
              className="p-1 m-1 border border-gray-400 rounded-lg"
              rows={4}
              cols={40}
              name="content"
              value={content}
              type="text"
              onChange={(e) => setContent(e.target.value)}
            />
            {errors.content ? (
              <p className=" text-red-500">{errors.content.message}</p>
            ) : null}
          </div>
          <div className="mb-2">
            <label className="text-sm">Include an image or a video? </label>
            <div className="display:flex flex row my-2">
              <input
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                type="file"
                name="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file ? (
                <p className="my-1 border-0 font-semibold block px-2 pt-1 rounded-md text-sm text-green-800 bg-green-200">
                  Done
                </p>
              ) : null}
            </div>
          </div>
          <button
            className="p-1 px-4 font-semibold text-white hover:bg-blue-600 m-1 bg-blue-500 rounded-full w-full shadow-md"
            type="submit"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
