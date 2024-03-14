import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const authToken = window.localStorage.getItem('userToken');
  const id = localStorage.getItem('userId');

  useEffect(() => {
    if (!loading && id) {
      axios.get(`http://localhost:5000/posts/user/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        withCredentials: true
      })
      .then(res => {
        setUserPosts(res.data.userPosts);
        setLoading(false);
        console.log(res.data.userPosts);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
    }
  }, [loading, id, authToken]);
  
  return (
    <PostContext.Provider value={{ userPosts, setUserPosts, loading }}>
      {children}
    </PostContext.Provider>
  );
}

PostProvider.propTypes = {
  children: PropTypes.node.isRequired
};
