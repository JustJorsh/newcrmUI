import { configureStore, createSlice } from '@reduxjs/toolkit';
import {
  AUTH_TOKEN,
  AUTHENTICATED,
  SHOW_AUTH_MESSAGE,
  HIDE_AUTH_MESSAGE,
  SIGNOUT_SUCCESS,
  SIGNUP_SUCCESS,
  SHOW_LOADING,
} from '../constants';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    message: '',
    showMessage: false,
    redirect: '',
  },
});

const initState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
};

const auth = (state = initState, action) => {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        loading: false,
        redirect: '/',
      };
    case SHOW_AUTH_MESSAGE:
      return {
        ...state,
        message: action.message,
        showMessage: true,
        loading: false,
      };
    case HIDE_AUTH_MESSAGE:
      return {
        ...state,
        message: '',
        showMessage: false,
      };
    case SIGNOUT_SUCCESS: {
      return {
        ...state,
        token: null,
        redirect: '/',
        loading: false,
      };
    }
    case SIGNUP_SUCCESS: {
      return {
        ...state,
        loading: false,
        token: action.token,
      };
    }
    case SHOW_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    default:
      return state;
  }
};

export default auth;
