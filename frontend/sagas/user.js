import axios from "axios";

import { all, call, fork, takeEvery, put } from "redux-saga/effects";

import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_FAILURE,
  LOAD_USER_SUCCESS,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  FOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_REQUEST,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_SUCCESS,
  EDIT_NICKNAME_SUCCESS,
  EDIT_NICKNAME_FAILURE,
  EDIT_NICKNAME_REQUEST,
} from "../reducers/user";

function loginAPI(loginData) {
  return axios.post("/user/login", loginData, {
    withCredentials: true,
  });
}

function* login(action) {
  try {
    const result = yield call(loginAPI, action.data);
    yield put({
      // put은 dispatch와 동일
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    //  loginAPI 실패
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
      reason: e.response && e.response.data,
    });
  }
}

function* watchLogIn() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

// 회원가입
function signUpAPI(signUpData) {
  return axios.post("/user", signUpData);
}

function* signUp(action) {
  try {
    // yield call(signUpAPI);
    yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: SIGN_UP_FAILURE,
      error: e,
    });
  }
}

function* watchSignup() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

// ----------------- 로그 아웃-----------------------

function logOutAPI() {
  return axios.post(
    "/user/logout",
    {},
    {
      withCredentials: true,
    }
  );
}

function* logOut(action) {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_OUT_FAILURE,
      error: e,
    });
  }
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

// -----------------END 로그 아웃-----------------------

// ----------------- 사용자 정보 가져오기-----------------------
function loadUserAPI(userId) {
  return axios.get(userId ? `/user/${userId}` : "/user/", {
    withCredentials: true, // 클라이언트에서 요청 보낼 때는 브라우저가 쿠키를 같이 동봉함
  }); // 서버사이드 렌더링일때는 브라우저가 없다. 그렇기 때문에 쿠키를 넣어주는 장치가 없음, 그래서 개발자가 직접 넣어줘야함
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

// -----------------END 로그 아웃-----------------------

// ----------------- 팔로우-----------------------
function followAPI(userId) {
  return axios.post(
    `/user/${userId}/follow`,
    {},
    {
      withCredentials: true,
    }
  );
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_USER_SUCCESS,
      data: result.data,
      me: !action.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: FOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchFollow() {
  yield takeEvery(FOLLOW_USER_REQUEST, follow);
}

// -----------------END 팔로우-----------------------

// ----------------- 언팔로우 -----------------------
function unfollowAPI(userId) {
  return axios.delete(`/user/${userId}/follow`, {
    withCredentials: true,
  });
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data,
      me: !action.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error: e,
    });
  }
}

function* watchUnFollow() {
  yield takeEvery(UNFOLLOW_USER_REQUEST, unfollow);
}
// -----------------END 언팔로우-----------------------

// ----------------- watchLoadFollowers -----------------------
function loadFollowersAPI(userId, offset = 0, limit = 3) {
  return axios.get(
    `/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`,
    {
      withCredentials: true,
    }
  );
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadFollowers() {
  yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}
// -----------------END watchLoadFollowers-----------------------

// ----------------- watchLoadFolloings -----------------------
function loadFollowingsAPI(userId, offset = 0, limit = 3) {
  return axios.get(
    `/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`,
    {
      withCredentials: true,
    }
  );
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}
// -----------------END watchLoadFolloings-----------------------

// ----------------- watchLoadFolloings -----------------------
function removeFollowerAPI(userId) {
  return axios.delete(`/user/${userId}/follower`, {
    withCredentials: true,
  });
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: e,
    });
  }
}

function* watchRemoveFollower() {
  yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}
// -----------------END watchRemoveFollower-----------------------

// ----------------- watchEditNickname -----------------------
function editNicknameAPI(nickname) {
  return axios.patch(
    `/user/nickname`,
    { nickname },
    {
      withCredentials: true,
    }
  );
}

function* editNickname(action) {
  try {
    const result = yield call(editNicknameAPI, action.data);
    yield put({
      type: EDIT_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: EDIT_NICKNAME_FAILURE,
      error: e,
    });
  }
}

function* watchEditNickname() {
  yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}
// -----------------END watchEditNickname-----------------------

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignup),
    fork(watchFollow),
    fork(watchUnFollow),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
    fork(watchEditNickname),
  ]);
}
