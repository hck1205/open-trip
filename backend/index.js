const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");

const passportConfig = require("./passport");
const db = require("./models");

const userAPIRouter = require("./routes/user");
const postAPIRouter = require("./routes/post");
const postsAPIRouter = require("./routes/posts");
const hashtagAPIRouter = require("./routes/hashtag");

db.sequelize.sync();
dotenv.config();
const app = express();
passportConfig();

app.use(express.json()); // json 형식의 본문을 처리
app.use(express.urlencoded({ extended: true })); // form으로 들어오는 데이터를 처리
app.use(morgan("dev"));
app.use("/", express.static("uploads")); // express 에서 제공하는 middleware로 지정을하면 외부에서 폴더를 노출시켜 접근 가능하게 해준다
app.use(
  cors({
    origin: true,
    credentials: true, // cors && axios 둘다 설정을 해줘야함
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false, // 매번 세션 강제 저장
    saveUninitialized: false, // 빈 값도 저장
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true, // javscript로 쿠키에 접근하지 못하도록 하는 secure방식
      secure: false, // https를 쓸 때 true
    },
    name: "rnbck",
    // store: RedisStore // 서버가 재시작되면 메모리에 있는 데이터가 없어지기 때문에 유저들의 로그인이 풀림 그렇기 때문에 store옵셥을 넣어서 레디스같은 memcached db를 이용해 그것을 방지함
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/user", userAPIRouter);
app.use("/api/post", postAPIRouter);
app.use("/api/posts", postsAPIRouter);
app.use("/api/hashtag", hashtagAPIRouter);

app.listen(3065, () => {
  console.log("server is running on localhost:3065");
});
