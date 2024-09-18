
import { SET_USER, LOGOUT_USER, SET_BLOGS } from './actions';

const initialState = {
  user: null,
  blogs: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload, 
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: null, 
      };
    case SET_BLOGS:
      return {
        ...state,
        blogs: action.payload, 
      };
    default:
      return state;
  }
};

export default rootReducer;
