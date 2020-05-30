import Head from "next/head";
import PropTypes from "prop-types";
import { createStore, compose, applyMiddleware } from "redux";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import createSagaMiddlewrae from "redux-saga";

import rootReducer from "../reducers";
import rootSaga from "../sagas";

import AppLayout from "../components/AppLayout";

import "antd/dist/antd.css";

const NodeBird = ({ Component, store }) => {
  return (
    <Provider store={store}>
      <Head>
        <title>NodeBird</title>
      </Head>
      <AppLayout>
        <Component />
      </AppLayout>
    </Provider>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
};

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddlewrae();
  const middlewares = [sagaMiddleware];

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
  sagaMiddleware.run(rootSaga);

  return store;
};

export default withRedux(configureStore)(NodeBird);
