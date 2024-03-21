import Model from "react-modal";
import PostForm from "../components/PostForm";
import { useState } from "react";

const PostModal = (props) => {
  const [visible, setVisible] = useState(false);
  const { userPosts, setUserPosts, allPosts, setAllPosts } = props;
  return (
    <div className="container display: flex ms-48 w-full md:w-auto mt-24">
      <input
        className="container relative top-0 md:left-80 w-full md:w-auto px-5 py-1 mt-10 bg-white border rounded-xl border-gray-400 shadow-md outline-yellow-200 ms-80"
        style={{ position: "sticky", width: "1300px" }}
        placeholder="Write a post"
        onClick={() => setVisible(true)}
      ></input>
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
          className="pb-1 text-sm font-semibold border rounded-md bg-red-500 px-2 hover:bg-red-700 text-white mt-2 me-7 position: absolute end-0"
          onClick={() => setVisible(false)}
        >
          x
        </button>
        <PostForm
          userPosts={userPosts}
          setUserPosts={setUserPosts}
          allPosts={allPosts}
          setAllPosts={setAllPosts}
        />
      </Model>
    </div>
  );
};

export default PostModal;
