import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const PostCardContent = ({ postData }) => {
  return (
    <div>
      {postData.split(/(#[^\s]+)/g).map((word, index) => {
        if (word.match(/#[^\s]+/)) {
          return (
            <Link
              href={{
                pathname: "/hashtag",
                query: { tag: word.slice(1) },
              }}
              as={`/hashtag/${word.slice(1)}`}
              key={`${word}_${index}`}
            >
              <a>{word}</a>
            </Link>
          );
        }
        return word;
      })}
    </div>
  );
};

PostCardContent.protoTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
