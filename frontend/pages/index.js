import React, { useEffect, useCallback, useRef } from "react";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useSelector, useDispatch } from "react-redux";
import { LOAD_MAIN_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost } = useSelector((state) => state.post);

  const dispatch = useDispatch();
  const countRef = useRef([]);

  const onScroll = useCallback(() => {
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (window.scrollY + clientHeight > scrollHeight - 300) {
      if (mainPosts.length > 0 && hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1].id;

        if (!countRef.current.includes(lastId)) {
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1].id,
          });
        }

        countRef.current.push(lastId);
      }
    }
  }, [hasMorePost, mainPosts.length]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePost, mainPosts.length]);

  useEffect(() => {
    dispatch({
      type: LOAD_MAIN_POSTS_REQUEST,
      lastId: 0,
    });
  }, []);

  return (
    <div>
      {me && <PostForm />}
      {mainPosts.map((c, index) => {
        return <PostCard key={`${c.id}_${index}`} post={c} />;
      })}
    </div>
  );
};

Home.getInitialProps = async (context) => {
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST,
  });
};

export default Home;
