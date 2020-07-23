import React, { useCallback } from "react";
import { Button, Card, List } from "antd";
import { StopOutlined } from "@ant-design/icons";
import NicknameEditForm from "../components/NicknameEditForm";
import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
  UNFOLLOW_USER_REQUEST,
} from "../reducers/user";
import { LOAD_USER_POSTS_REQUEST } from "../reducers/post";
import PostCard from "../components/PostCard";
import FollowList from "../components/FollowList";

const Profile = () => {
  const dispatch = useDispatch();
  const {
    followingList,
    followerList,
    hasMoreFollower,
    hasMoreFollowing,
  } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);

  const onUnfollow = useCallback(
    (userId) => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    []
  );

  const onRemoveFollower = useCallback(
    (userId) => () => {
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: userId,
      });
    },
    []
  );

  const loadMoreFollowings = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
      offset: followingList.length,
    });
  }, [followingList.length]);

  const loadMoreFollowers = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
      offset: followerList.length,
    });
  }, [followerList.length]);

  return (
    <div>
      <NicknameEditForm />
      <FollowList
        header={"팔로잉 목록"}
        hasMore={hasMoreFollowing}
        onClickMore={loadMoreFollowings}
        data={followingList}
        onClickStop={onUnfollow}
      />
      <FollowList
        header={"팔로워 목록"}
        hasMore={hasMoreFollower}
        onClickMore={loadMoreFollowers}
        data={followerList}
        onClickStop={onRemoveFollower}
      />
      <div>
        {mainPosts.map((c, i) => {
          return <PostCard key={`${c.createdAt}_${i}`} post={c} />;
        })}
      </div>
    </div>
  );
};

Profile.getInitialProps = async (context) => {
  const state = context.store.getState();

  // 이 직전에 _app.js에서 LOAD_USERS_REQUEST가 먼저 실행됨
  // LOAD_USERS_REQUEST 이게 끝나야지만, state.user.me가 생김
  context.store.dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_FOLLOWINGS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: state.user.me && state.user.me.id,
  });

  // 여기서 LOAD_USERS_SUCCESS돼서 me가 생김
  // 그렇기 때문에 state.user.me가 null이기 때문에 null경우 me로 간주해버리는 식의 코딩 필요
  // saga에서 userId가 null 경우 api를 0으로 호출하고
  // server 0 일경우 me로 간주시키는 로직 추가
};

export default Profile;
