module.exports = (sequalize, DataTypes) => {
  const Post = sequalize.define(
    "Post", // 테이블명은 posts 소문자로 변경됨
    {
      content: {
        type: DataTypes.TEXT, // 매우 긴 글
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4", // 한글 + 이모티콘
      collate: "utf8mb4_general_ci", // 한글이 될 수 있도록 설정
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // 포스트는 유저 테이블에 속해 있다 : belongsTo 가 있는 테이블에 다른 테이블의 id를 저장 post테이블에 userid를 저장
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // RetweetId 컬럼 생김
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
  };
  return Post;
};
