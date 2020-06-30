import React, { useCallback, useEffect } from "react";
import Proptypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { LOAD_HASHTAG_POSTS_REQUEST } from "../reducers/post";
import PostCard from "../components/PostCard";

const Hashtag = ({ tag }) => {
  const dispatch = useDispatch();

  const { mainPosts, hasMorePost } = useSelector((state) => state.post);

  const onScroll = useCallback(() => {
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (window.scrollY + clientHeight > scrollHeight - 300) {
      if (mainPosts.length > 0 && hasMorePost) {
        dispatch({
          type: LOAD_HASHTAG_POSTS_REQUEST,
          lastId: mainPosts[mainPosts.length - 1].id,
          data: tag,
        });
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
      type: LOAD_HASHTAG_POSTS_REQUEST,
      lastId: 0,
      data: tag,
    });
  }, []);

  return (
    <div>
      {mainPosts.map((c, i) => {
        return <PostCard key={`${c.createdAt}_${i}`} post={c} />;
      })}
    </div>
  );
};

Hashtag.propTypes = {
  tag: Proptypes.string.isRequired,
};

Hashtag.getInitialProps = async (context) => {
  const tag = context.query.tag;
  context.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: tag,
  });

  return { tag };
};

export default Hashtag;
