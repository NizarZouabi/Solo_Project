import { createContext } from 'react';

const postContext = createContext({
  userPosts: [],
  setUserPosts: () => {},
});

export default postContext;