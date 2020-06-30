import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

import { createStore, compose, applyMiddleware } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { Provider } from "react-redux";
import createSagaMiddlewrae from "redux-saga";
import axios from "axios";

import rootReducer from "../reducers";
import rootSaga from "../sagas";
import AppLayout from "../components/AppLayout";
import { LOAD_USER_REQUEST } from "../reducers/user";

import "antd/dist/antd.css";

const NodeBird = ({ Component, store, pageProps }) => {
  return (
    <Provider store={store}>
      <Helmet
        title={"NodeBird"}
        htmlAttributes={{ lang: "ko" }}
        meta={[
          {
            charset: "UTF-8",
          },
          {
            name: "viewport",
            content:
              "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=yes, viewport-fit=cover",
          },
          {
            "http-equiv": "X-UA-Compatible",
            content: "IE=edge",
          },
          { name: "description", content: "제로초의 NodeBird SNS" },
          { name: "og:title", content: "NodeBird" },
          { name: "og:description", content: "제로초의 NodeBird SNS" },
          { property: "og:type", content: "website" },
        ]}
        link={[
          {},
          {
            rel: "stylesheet",
            href:
              "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css",
          },
          {
            rel: "stylesheet",
            href:
              "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css",
          },
          {
            rel: "stylesheet",
            href: "https://cdnjs.cloudflare.com/ajax/libs/antd/4.2.0/antd.css",
          },
        ]}
        // script={[
        //   {
        //     src: "https://cdnjs.cloudflare.com/ajax/libs/antd/4.2.0/antd.js",
        //   },
        // ]}
      />
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </Provider>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object,
};

// 1. NodeBird.getInitialProps
// 2. 그 안에 있는 하위 컴포넌트 (ex) HashTag GetinitialProps 실행
// 값을 리턴 받은 값이 pageProps = await Component.getInitialProps(ctx);
// pageProps을 다시 리턴하면
// const NodeBird = ({ Component, store, pageProps }) << 여기로 와서
// 다시 <Component {...pageProps} /> 로 넣어줌
// 그러면 마지막에 컴포넌트 props에서 받을 수 있음

NodeBird.getInitialProps = async (context) => {
  const { ctx, Component } = context;
  let pageProps = {};

  const state = ctx.store.getState();

  const cookie = ctx.isServer ? ctx.req.headers.cookie : "";
  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
  }

  if (Component.getInitialProps) {
    pageProps = (await Component.getInitialProps(ctx)) || {};
  }

  return { pageProps };
};

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddlewrae();
  // const middlewares = [sagaMiddleware];
  const middlewares = [
    sagaMiddleware,
    (store) => (next) => (action) => {
      // console.log(action);
      next(action);
    },
  ];

  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : compose(
          applyMiddleware(...middlewares),
          !options.isServer &&
            window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : (f) => f
        );
  const store = createStore(rootReducer, initialState, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export default withRedux(configureStore)(withReduxSaga(NodeBird));
