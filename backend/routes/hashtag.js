const express = require("express");
const db = require("../models");

const router = express.Router();

router.get("/:tag", async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
      };
    }
    const posts = await db.Post.findAll({
      where,
      include: [
        {
          model: db.Hashtag,
          where: { name: decodeURIComponent(req.params.tag) }, // 특수문자 한글이 주소로 통해서 갈때는 URI 컴포넌트로 바뀌어 버리기 떄문에 서버쪽에서 제대로 처리하려면 다음과 같이 처리해야함
        },
        {
          model: db.User, // 게시글 작성자 정보
          attributes: ["id", "nickname"],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          through: "Like",
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: db.Post,
          as: "Retweet",
          include: [
            {
              model: db.User,
              attributes: ["id", "nickname"],
            },
            {
              model: db.Image,
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(req.query.limit, 10),
    });

    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
