import React, { useState, useCallback, useEffect, memo, useRef } from "react";
import PropTypes from "prop-types";
import moment from "moment";
moment.locale("ko");

import { Button, Card, Avatar, List, Comment, Popover } from "antd";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";

import {
  RetweetOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  EllipsisOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";

import styled from "styled-components";

import PostImages from "./Postimages";
import {
  LOAD_COMMENTS_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_REQUEST,
  RETWEET_REQUEST,
  REMOVE_POST_REQUEST,
} from "../reducers/post";
import PostCardContent from "./PostCardContent";
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from "../reducers/user";
import CommentForm from "./CommentForm";
import FollowButton from "./FollowButton";

const CardWrapper = styled.div`
  margin-bottom: 20px;
`;

const PostCard = memo(({ post }) => {
  const [commentFormOpened, setCommentFormOpend] = useState(false);

  const id = useSelector((state) => state.user.me && state.user.id);

  const liked = id && post.Likers && post.Likers.find((v) => v.id === id);

  const dispatch = useDispatch();
  const postMemory = useRef(id);

  useEffect(() => {}, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpend((prev) => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, []);

  const onToggleLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다");
    }

    // 좋아요를 누른상태
    if (liked) {
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else {
      // 좋아요를 누리지 않은 상태
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [id, post && post.id, liked]);

  const onRetweet = useCallback(() => {
    if (!me) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id, post && post.id]);

  const onFollow = useCallback(
    (userId) => () => {
      dispatch({
        type: FOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    []
  );

  const onUnfollow = useCallback(
    (userId) => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    []
  );

  const onRemovePost = useCallback(
    (postId) => () => {
      dispatch({
        type: REMOVE_POST_REQUEST,
        data: postId,
      });
    },
    []
  );

  return (
    <CardWrapper>
      <Card
        key={post.createdAt}
        cover={
          post.Images && post.Images.length > 0 ? (
            <PostImages images={post.Images} />
          ) : (
            <></>
          )
        }
        actions={[
          <RetweetOutlined onClick={onRetweet} />,
          liked ? (
            <HeartFilled onClick={onToggleLike} />
          ) : (
            <HeartOutlined onClick={onToggleLike} />
          ),

          <MessageOutlined onClick={onToggleComment} />,
          <Popover
            content={
              <>
                <Button>수정</Button>
                <Button type="danger" onClick={onRemovePost(post.id)}>
                  삭제
                </Button>
              </>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗 하셨습니다.` : null
        }
        extra={
          <FollowButton
            post={post}
            onUnfollow={onUnfollow}
            onFollow={onFollow}
          />
        }
      >
        {post.RetweetId && post.Retweet ? (
          // 리트윗한경우
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <Card.Meta
              avatar={
                <Link
                  href={{
                    pathname: "/user",
                    query: { id: post.Retweet.User.id },
                  }}
                  as={`/user/${post.Retweet.User.id}`}
                >
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
            {moment(post.createdAt).format("YYYY.MM.DD")}
          </Card>
        ) : (
          // 리트윗 하지 않은경우
          <Card.Meta
            avatar={
              <Link
                href={{ pathname: "/user", query: { id: post.User.id } }}
                as={`/user/${post.User.id}`}
              >
                <a>
                  <Avatar>{post.User.nickname[0]}</Avatar>
                </a>
              </Link>
            }
            title={post.User.nickname}
            description={<PostCardContent postData={post.content} />}
          />
        )}
      </Card>
      {commentFormOpened && (
        <>
          <CommentForm post={post} />
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={(item) => {
              return (
                <List.Item>
                  <Comment
                    author={item.User.nickname}
                    avatar={
                      <Link
                        href={{
                          pathname: "/user",
                          query: { id: item.User.id },
                        }}
                        as={`/user/${item.User.id}`}
                      >
                        <a>
                          <Avatar>{item.User.nickname[0]}</Avatar>
                        </a>
                      </Link>
                    }
                    content={item.content}
                    datatime={item.createdAt}
                  />
                </List.Item>
              );
            }}
          />
        </>
      )}
    </CardWrapper>
  );
});

PostCard.protoTypes = {
  post: PropTypes.shape({
    User: PropTypes.object,
    content: PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.string,
  }),
};

export default PostCard;
