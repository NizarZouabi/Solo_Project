import { formatDistanceToNow } from "date-fns";
import { UserContext } from "../context/userContext";
import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Model from "react-modal";
import axios from "axios";

const Post = (props) => {
  const { post, userPosts, setUserPosts, allPosts, setAllPosts } = props;
  const { loggedInUser, authToken } = useContext(UserContext);
  const formattedDate =
    post &&
    post.createdAt &&
    formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
    });
  const [errors, setErrors] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [isError, setIsError] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [author] = useState(loggedInUser._id);
  const [file, setFile] = useState(post.file);
  const [stars, setStars] = useState(post.stars);
  const [comments, setComments] = useState(post.comments);
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  // const reload = () => window.location.reload();

  const addStarToComment = (commentId) => {
    axios
      .patch(
        `http://localhost:5000/posts/user/${post._id}/${loggedInUser._id}/add/star/comment/${commentId}`,
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
        const updatedPost = res.data.post;
        const updatedComments = updatedPost.comments;
        const updatedUserPosts = userPosts.map((prevPost) =>
          prevPost._id === updatedPost._id ? { ...prevPost, comments: updatedComments } : prevPost
        );
        setUserPosts(updatedUserPosts);
        const updatedAllPosts = allPosts.map((prevPost) =>
          prevPost._id === updatedPost._id ? { ...prevPost, comments: updatedComments } : prevPost
        );
        setAllPosts(updatedAllPosts);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const removeStarFromComment = (commentId) => {
    axios
      .patch(
        `http://localhost:5000/posts/user/${post._id}/${loggedInUser._id}/remove/star/comment/${commentId}`,
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
        const updatedPost = res.data.post;
        const updatedComments = updatedPost.comments;
        const updatedUserPosts = userPosts.map((prevPost) =>
          prevPost._id === updatedPost._id ? { ...prevPost, comments: updatedComments } : prevPost
        );
        setUserPosts(updatedUserPosts);
        const updatedAllPosts = allPosts.map((prevPost) =>
          prevPost._id === updatedPost._id ? { ...prevPost, comments: updatedComments } : prevPost
        );
        setAllPosts(updatedAllPosts);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const commentHandler = (e) => {
    e.preventDefault();

    const newComment = {
      comment: comment,
      author: loggedInUser._id,
      pfp: loggedInUser.profilePic,
      authorName: loggedInUser.firstName + " " + loggedInUser.lastName,
    };

    axios
      .patch(`http://localhost:5000/posts/${post._id}/comment`, newComment, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        const updatedPost = res.data.post;
        setCommentVisible(false)
        if (updatedPost) {
          setUserPosts((prevUserPosts) =>
            prevUserPosts.map((prevPost) =>
              prevPost._id === updatedPost._id
                ? { ...prevPost, comments: updatedPost.comments }
                : prevPost
            )
          );
          setAllPosts((prevAllPosts) =>
            prevAllPosts.map((prevPost) =>
              prevPost._id === updatedPost._id
                ? { ...prevPost, comments: updatedPost.comments }
                : prevPost
            )
          );
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        setCommentErrors(err.response.data);
        setIsError(true);
      });
  };

  const removeFromDom = (postId) => {
    setUserPosts(userPosts.filter((post) => post._id !== postId));
    setAllPosts(allPosts.filter((post) => post._id !== postId));
  };

  const addStar = (postId) => {
    if (loggedInUser && loggedInUser._id && post && postId) {
      axios
        .patch(
          `http://localhost:5000/posts/user/${loggedInUser._id}/add/star/${postId}`
        )
        .then((res) => {
          console.log(res);
          const updatedPost = res.data.post;
          setUserPosts((prevUserPosts) =>
            prevUserPosts.map((prevPost) =>
              prevPost._id === updatedPost._id
                ? { ...prevPost, stars: updatedPost.stars }
                : prevPost
            )
          );
          setAllPosts((prevAllPosts) =>
            prevAllPosts.map((prevPost) =>
              prevPost._id === updatedPost._id
                ? { ...prevPost, stars: updatedPost.stars }
                : prevPost
            )
          );
        })
        .catch((err) => console.log(err));
    }
  };

  const removeStar = (postId) => {
    if (loggedInUser && loggedInUser._id && post && postId) {
      axios
        .patch(
          `http://localhost:5000/posts/user/${loggedInUser._id}/remove/star/${postId}`
        )
        .then((res) => {
          const updatedPost = res.data.post;
          setUserPosts((prevUserPosts) =>
            prevUserPosts.map((prevPost) =>
              prevPost._id === updatedPost._id
                ? { ...prevPost, stars: updatedPost.stars }
                : prevPost
            )
          );
          setAllPosts((prevAllPosts) =>
            prevAllPosts.map((prevPost) =>
              prevPost._id === updatedPost._id
                ? { ...prevPost, stars: updatedPost.stars }
                : prevPost
            )
          );
        })
        .catch((err) => console.log(err));
    }
  };

  const removePost = () => {
    axios
      .delete(`http://localhost:5000/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        removeFromDom(post._id);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const deleteComment = (commentId) => {
    axios
      .delete(
        `http://localhost:5000/posts/${post._id}/remove/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setUserPosts((prevUserPosts) => {
          return prevUserPosts.map((prevPost) => {
            if (prevPost._id === post._id) {
              return {
                ...prevPost,
                comments: prevPost.comments.filter(
                  (comment) => comment._id !== commentId
                ),
              };
            }
            return prevPost;
          });
        });
        setAllPosts((prevPosts) => {
          return prevPosts.map((prevPost) => {
            if (prevPost._id === post._id) {
              return {
                ...prevPost,
                comments: prevPost.comments.filter(
                  (comment) => comment._id !== commentId
                ),
              };
            }
            return prevPost;
          });
        });
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const reload = () => window.location.reload();

    const updatedFormData = new FormData();
    updatedFormData.append("title", title);
    updatedFormData.append("content", content);
    updatedFormData.append("author", author);
    updatedFormData.append("file", file);

    axios
      .patch(
        `http://localhost:5000/posts/${post._id}/update`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data.updatedPost);
        setUserPosts([...userPosts, res.data.updatedPost]);
        reload();
        setAllPosts([...allPosts, res.data.updatedPost]);
        reload();
      })
      .catch((err) => {
        setErrors(err.response.data);
        console.log(err.response.data);
      });
  };

  return (
    <div>
      <div>
        <div
          className="bg-gray-50 mt-28 mb-10 shadow-md border border-solid border-gray-400 rounded-lg position: sticky"
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "29%",
            width: "60%",
          }}
        >
          <div className="bg-gray-200 shadow border-b border-solid border-gray-400 display: flex flex-column align-items-center">
            <span className="border-b border-solid border-gray-400 w-full text-transparent position: absolute top-14 left-0"></span>
            {post?.author &&
            post?.author.profilePic &&
            post?.author.profilePic !==
              "https://avatarfiles.alphacoders.com/239/239030.jpg" ? (
              <img
                className="border border-solid border-gray-400 rounded-full"
                src={`http://localhost:5000/public/images/${post.author.profilePic}`}
                style={{
                  position: "sticky",
                  top: "0.1%",
                  left: "0.1%",
                  width: "100px",
                  height: "100px",
                  objectFit: "fill",
                }}
              />
            ) : (
              <img
                className="border border-solid border-gray-400 rounded-full"
                src="https://avatarfiles.alphacoders.com/239/239030.jpg"
                style={{
                  position: "sticky",
                  top: "0.1%",
                  left: "0.1%",
                  width: "100px",
                  height: "100px",
                  objectFit: "fill",
                }}
              />
            )}
            <div className="text-center m-3">
              {post && post?.author && (
                <h1 className="position: absolute left-32 text-2xl font-bold">
                  <Link to={`/user/${post.author._id}`}>
                    {post.author.firstName} {post.author.lastName}
                  </Link>
                </h1>
              )}
              <div className="">
                <div className="position: absolute right-52">
                  {post?.author && loggedInUser._id === post.author._id ? (
                    <div>
                      <button
                        className="hover:underline text-sm text-green-600 me-1"
                        onClick={() => setVisible(true)}
                      >
                        Edit
                      </button>
                      <Model
                        ariaHideApp={false}
                        isOpen={visible}
                        onRequestClose={() => setVisible(false)}
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
                          className="pb-1 mt-2 text-sm font-semibold border rounded-md bg-red-500 px-2 hover:bg-red-700 text-white me-7 position: absolute end-0"
                          onClick={() => setVisible(false)}
                        >
                          x
                        </button>
                        <div
                          className="border bg-gray-50"
                          style={{ borderRadius: "16px" }}
                        >
                          <div className="display: flex justify-center">
                            <form
                              className="text-center text-xl py-5"
                              style={{ width: "80%" }}
                              onSubmit={submitHandler}
                            >
                              <div className="display: flex flex-col mb-2">
                                <label className="font-bold text-gray-600">
                                  Title:
                                </label>
                                <input
                                  className="p-1 m-1 border border-gray-400 rounded-lg"
                                  name="title"
                                  value={title}
                                  type="text"
                                  onChange={(e) => setTitle(e.target.value)}
                                />
                                {errors.title ? (
                                  <p className=" text-red-500">
                                    {errors.title.message}
                                  </p>
                                ) : null}
                              </div>
                              <div className="display: flex flex-col mb-2">
                                <label className="font-bold text-gray-600">
                                  Content:
                                </label>
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
                                  <p className=" text-red-500">
                                    {errors.content.message}
                                  </p>
                                ) : null}
                              </div>
                              <div className="mb-2">
                                <label className="text-sm">
                                  Include an image or a video?{" "}
                                </label>
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
                      </Model>
                      <span className="cursor-default">|</span>{" "}
                      <button
                        className="hover:underline text-sm text-red-600"
                        onClick={removePost}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
                <label className="position: absolute right-5 text-gray-500 text-sm italic">
                  {formattedDate}
                </label>
              </div>
              <h3
                className="font-bold"
                style={{ position: "absolute", top: "70px", left: "50%" }}
              >
                {post?.title}
              </h3>
            </div>
          </div>
          <div className="bg-gray-50" style={{ height: "100%" }}>
            <div className="">
              <div className="container display: flex flex-row gap-1">
                <div className="container display: flex flex-col">
                  <p
                    className="container w-auto bg-white m-2 p-2 px-4 border border-gray-400 overflow-auto font-semibold"
                    style={{ width: "98.6%", height: "100%" }}
                  >
                    {post?.content}
                  </p>
                  <div
                    className="container mt-4 bg-white overflow-x-hidden w-auto m-2 p-2 px-4"
                    style={{ height: "50%" }}
                  >
                    {post?.comments && post?.comments.length > 0 ? (
                      post.comments.map((comment, idx) => (
                        <div key={idx} className="display: flex flex-row gap-2">
                          {comment?.pfp && !comment?.pfp ? (
                            <img
                              className="border border-solid border-gray-400 rounded-full my-1"
                              src="https://avatarfiles.alphacoders.com/239/239030.jpg"
                              style={{ width: "40px", height: "40px" }}
                            ></img>
                          ) : (
                            <img
                              className="border border-solid border-gray-400 rounded-full my-1"
                              src={`http://localhost:5000/public/images/${comment?.pfp}`}
                              style={{ width: "40px", height: "40px" }}
                            ></img>
                          )}
                          <div
                            className=" dislpay: flex flex-col position: sticky left-12"
                            style={{ width: "100%", height: "auto" }}
                          >
                            <h5 className="text-lg font-semibold">
                              <Link to={`/user/${comment?.author}`}>
                                {comment?.authorName}
                              </Link>
                            </h5>
                            <div className="display: flex flex-row">
                              {loggedInUser._id === comment?.author ? (
                                <div>
                                  <p
                                    className="container border rounded-lg px-3  bg-white"
                                    style={{
                                      height: "auto",
                                      minWidth: "50px",
                                      maxWidth: "400px",
                                      overflowWrap: "break-word",
                                    }}
                                  >
                                    {comment.comment}
                                  </p>
                                  <span
                                    className="text-red-500 hover:underline cursor-pointer"
                                    onClick={() => deleteComment(comment._id)}
                                  >
                                    Delete
                                  </span>
                                </div>
                              ) : (
                                <p
                                  className="container border rounded-lg px-3  bg-white"
                                  style={{
                                    height: "auto",
                                    minWidth: "50px",
                                    maxWidth: "400px",
                                    overflowWrap: "break-word",
                                  }}
                                >
                                  {comment?.comment}
                                </p>
                              )}
                              {comment && !comment?.stars.includes(loggedInUser._id) ? (<div className="display: flex flex-row">
                                <p className="ms-2">{comment?.stars.length}</p>
                                <button onClick={() => addStarToComment(comment._id)} className="mb-5">
                                  <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Star_empty.svg/2011px-Star_empty.svg.png"
                                    className="position: sticky ms-2"
                                    style={{ height: "30px", width: "30px" }}
                                  />
                                </button>
                              </div>) : (
                                <div className="display: flex flex-row">
                                <p className="ms-2">{comment?.stars.length}</p>
                                <button onClick={() => removeStarFromComment(comment._id)} className="mb-5">
                                  <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Star_full.svg/1005px-Star_full.svg.png"
                                    className="position: sticky ms-2"
                                    style={{ height: "30px", width: "30px" }}
                                  />
                                </button>
                              </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="position static bottom-24 left-52">
                        <p className="text-center">No comments yet.</p>
                      </div>
                    )}
                  </div>
                </div>
                {post?.file ? (
                  <div
                    className="border border-solid border-gray-400  m-2"
                    style={{
                      position: "sticky",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {post.file.endsWith(".mp4") ||
                    post.file.endsWith(".webm") ||
                    post.file.endsWith(".mov") ? (
                      <video
                        controls
                        src={`http://localhost:5000/public/uploads/${post.file}`}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={`http://localhost:5000/public/uploads/${post.file}`}
                        style={{ width: "100%", height: "100%" }}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            <span className="border-b border-solid border-gray-400 w-full text-transparent position: absolute bottom-50 left-0"></span>
          </div>
          <div className="display: flex justify-center">
            <div>
              <div className="display: flex flex-row gap-3 mt-4">
                <label className="font-bold text-xl text-gray-600">
                  Comment:
                </label>
                <input
                  className="shadow-md border border-solid border-gray-400 rounded-lg"
                  type="text"
                  style={{ height: "3.5vh" }}
                  onClick={() => setCommentVisible(true)}
                />
                <div className="display: flex flex-row">
                  {post && post.stars && (
                    <p className="ms-2">{post.stars.length}</p>
                  )}
                  {post?.stars && !post.stars.includes(loggedInUser._id) ? (
                    <button className="mb-5" onClick={() => addStar(post._id)}>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Star_empty.svg/2011px-Star_empty.svg.png"
                        className="position: sticky ms-2"
                        style={{ height: "30px", width: "30px" }}
                      />
                    </button>
                  ) : (
                    <button
                      className="mb-5"
                      onClick={() => removeStar(post._id)}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Star_full.svg/1005px-Star_full.svg.png"
                        className="position: sticky ms-2"
                        style={{ height: "30px", width: "30px" }}
                      />
                    </button>
                  )}
                </div>
                <Model
                  ariaHideApp={false}
                  isOpen={commentVisible}
                  onRequestClose={() => setCommentVisible(false)}
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
                    className="pb-1 text-sm font-semibold border rounded-md bg-red-500 px-2 hover:bg-red-700 text-white mt-2 me-7 position: absolute end-0"
                    onClick={() => setCommentVisible(false)}
                  >
                    x
                  </button>
                  <div
                    className="border bg-gray-50"
                    style={{ borderRadius: "16px" }}
                  >
                    <div className="display: flex justify-center">
                      <form
                        className="text-center text-xl py-5"
                        style={{ width: "80%" }}
                        onSubmit={commentHandler}
                      >
                        <div className="display: flex flex-col mb-2">
                          <label className="font-bold text-gray-600">
                            Comment:
                          </label>
                          <textarea
                            type="text"
                            cols={40}
                            rows={20}
                            className="p-4 m-1 border border-gray-400 rounded-lg h-24"
                            name="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          {isError ? (
                            <p className="text-red-500">
                              Comment can't be empty
                            </p>
                          ) : null}
                        </div>
                        <button className="shadow-md bg-blue-400 hover:bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-full">
                          Add
                        </button>
                      </form>
                    </div>
                  </div>
                </Model>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
