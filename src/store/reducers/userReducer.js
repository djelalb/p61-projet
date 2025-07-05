const initialState = {
  user: null,
  isLoggedIn: false,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    case 'USER_LOGOUT':
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    case 'USER_SET_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
}
