const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../models");
const { isLoggedin } = require("./middleware");
const { route } = require("./user");

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads"); // done(serverError, whenSuccess);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext); // 제로초.png, ext === png, basename === 제로초
      cb(null, basename + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// upload.none() :
// 폼데이터 파일 -> req.file(s)
// 폼데이터 일반 값 -> req.body
// 게시글 작성
router.post("/", isLoggedin, upload.none(), async (req, res, next) => {
  // POST /api/post
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content, // ex) '제로초 파이팅 #구독 #좋아요 눌러주세요'
      UserId: req.user.id,
    });

    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          db.Hashtag.findOrCreate({
            where: {
              name: tag.slice(1).toLowerCase(),
            },
          })
        )
      );

      await newPost.addHashtags(result.map((r) => r[0]));
    }

    if (req.body.image) {
      // 이미지 주소를 여러개 올리면 image: [주소1, 주소2 ...]
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          req.body.image.map((image) => {
            return db.Image.create({
              src: image,
            });
          })
        );
        await newPost.addImages(images);
      } else {
        // 이미지를 하나만 올리면 image: 주소1
        const image = await db.Image.create({ src: req.body.image });
        await newPost.addImage(image);
      }
    }

    // 시퀄라이즈에서 자동으로 getUser와같은 메소드를 생성해 주기 때문에
    // 아래와 같은 방법으로도 사용가능
    // const User = await newPost.getUser();
    // newPost.User = User;
    // res.json(newPost);
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [
        {
          model: db.User,
        },
        {
          model: db.Image,
        },
      ],
    });
    res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/images", upload.array("image"), (req, res) => {
  // upload.single(), upload.fields(), upload.array(), upload.none()
  console.log(req.files);
  res.json(req.files.map((v) => v.filename)); // single 일때는 file
});

router.get("/:id/comments", async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }

    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id,
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    return res.json(comments);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"],
        },
        {
          model: db.Image,
        },
      ],
    });
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id", isLoggedin, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }

    await db.Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/:id/comment", isLoggedin, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }

    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });

    await post.addComment(newComment.id);

    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    return res.json(comment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post("/:id/like", isLoggedin, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    await post.addLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id/like", isLoggedin, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    await post.removeLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/:id/retweet", isLoggedin, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: db.Post,
          as: "Retweet",
        },
      ],
    });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }

    // 자기의 게시글은 리트윗하지 못하게함
    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("자신의 글은 리트윗할 수  없습니다.");
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await db.Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });

    if (exPost) {
      return res.status(403).send("이미 리트윗했습니다.");
    }

    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });

    const retweetWithPrevPost = await db.Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: db.User,
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
    });
    res.json(retweetWithPrevPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
