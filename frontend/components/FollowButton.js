import React from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const FollowButton = ({ post, onUnfollow, onFollow }) => {
  const { me } = useSelector((state) => state.user);

  return (
    // 내가 로그인 안했거나 내 게시글을 보고있으면 Follow/UnFollow 필요없고 = null
    // 내 팔로우중에 유저 아이디가 있으면 버튼을 출력할건데 조건은 있냐 없냐에 따른 팔로우 언팔로우
    !me || post.User.id === me.id ? null : me.Followings &&
      me.Followings.find((v) => v.id === post.User.id) ? (
      <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
    ) : (
      <Button onClick={onFollow(post.User.id)}>팔로우</Button>
    )
  );
};

FollowButton.propTypes = {
  me: PropTypes.object,
  post: PropTypes.object.isRequired,
  onUnfollow: PropTypes.func.isRequired,
  onFollow: PropTypes.func.isRequired,
};

export default FollowButton;
