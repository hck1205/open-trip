module.exports = (sequalize, DataTypes) => {
  const Hashtag = sequalize.define(
    "Hashtag",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );

  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.User, { through: "PostHashtag" });
  };

  return Hashtag;
};
