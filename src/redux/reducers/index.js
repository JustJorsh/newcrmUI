import { combineReducers } from 'redux';
import { authSlice } from 'redux/features/authSlice';
import Theme from './Theme';
import Account from './Account';
import { themeSlice } from 'redux/features/themeSlice';
import { accountSlice } from 'redux/features/accountSlice';
import { userSlice } from 'redux/features/userSlice';

const reducers = combineReducers({
  theme: Theme,
  users: userSlice.reducer,
  auth: authSlice.reducer,
  account: accountSlice.reducer,
});

export default reducers;
