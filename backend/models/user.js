module.exports = (sequalize, DataTypes) => {
  const User = sequalize.define(
    "User",
    {
      nickname: {
        type: DataTypes.STRING(20), // 20글자 이하
        allowNull: false, // 필수
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true, // 고유한 값
      },
      password: {
        type: DataTypes.STRING(100), // 100글자 이하
        allowNull: false,
      },
    },
    {
      charset: "utf8", // 한글이 될 수 있도록 설정
      collate: "utf8_general_ci", // 한글이 될 수 있도록 설정
    }
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post, { as: "Posts" });
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "followingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "follwerId",
    });
  };
  return User;
};
