import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_BASE_URL } from 'configs/AppConfig';
import AxiosClient from 'services/AxiosClient';

export const initialState = {
  users: {
    loading: false,
    success: false,
    data: [],
  },
  user: {
    loading: false,
    success: false,
    data: [],
  },
};

export const getUsers = createAsyncThunk(
  'customers',
  async ({ pageNumber = 1, rows = 10, cId = 1, email = '', mobile = '', policyNumber = '' }) => {
    try {
      console.log("user search", policyNumber);
      const client = await AxiosClient(false);
      const res = await client
        .get(
          `${API_BASE_URL}customers/?PageNumber=${pageNumber}&RowsSizePerPage=${rows}&CompanyId=${cId}&Phone=${mobile}&Email=${email}&PolicyNumber=${policyNumber}`
        )
        .then((res) => res.data);
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const getUser = createAsyncThunk(
  'users/getUser',
  async (id, thunkApi) => {
    try {
      const { users: usersState } = thunkApi.getState();
      const { users } = usersState;
      const [user] = users.data.Data.filter((user) => user.ID == id);
      localStorage.setItem('HH-user', JSON.stringify(user));
      return user;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducer: {},
  extraReducers: {
    [getUsers.pending]: (state) => {
      state.users.loading = true;
    },
    [getUsers.fulfilled]: (state, { payload }) => {
      state.users.loading = false;
      state.users.success = true;
      state.users.status = payload?.status;
      state.users.message = payload?.message;
      state.users.data = payload?.data;
    },
    [getUsers.rejected]: (state, { payload }) => {
      state.users.loading = false;
      state.users.success = false;
      state.users.error = payload;
    },
    [getUser.pending]: (state) => {
      state.user.loading = true;
    },
    [getUser.fulfilled]: (state, { payload }) => {
      state.user.loading = false;
      state.user.success = true;
      state.user.status = 'OK';
      state.user.message = 'success';
      state.user.data = payload;
    },
    [getUser.rejected]: (state, { payload }) => {
      state.user.loading = false;
      state.user.success = false;
      state.user.error = payload;
    },
  },
});
