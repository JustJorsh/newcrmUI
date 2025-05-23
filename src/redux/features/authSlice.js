import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'configs/AppConfig';
import AxiosClient from 'services/AxiosClient';

const initialState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
};

export const doLogin = createAsyncThunk('auth/login',async ({ email, password }) => {
    try {
      const client = await AxiosClient(false);
      const res = await client
        .post(`${API_BASE_URL}auth/login`, {
          email,
          password,
        })
        .then((res) => res.data);
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const authorized = createAsyncThunk('auth/authorized',async ({ token }) => {
  try {
    const client = await AxiosClient(false);
    const res = await client
      .post(`${API_BASE_URL}auth/authorized`, {
       token,
      })
      .then((res) => res.data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}
);

export const signinuser = createAsyncThunk('auth/signin',async ({ token }) => {
  try {
    const client = await AxiosClient(false);
    const res = await client
      .post(`${API_BASE_URL}auth/signin`, {
       token,
      })
      .then((res) => res.data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: () => {},
  },
});
