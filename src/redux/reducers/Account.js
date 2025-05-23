import {
  SETACCOUNT,
} from '../constants';

const initState = {};

const Account = (state = initState, action) => {
  switch (action.type) {
    case SETACCOUNT:
      return {
        ...state,
        ...action.payload
      };
    
    default:
      return state;
  }
};

export default Account;