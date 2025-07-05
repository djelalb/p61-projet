const initialState = {
  users: [],
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case 'USERS_CREATE':
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case 'USERS_DELETE':
      return {
        ...state,
        users: [...state.users.filter((user) => user.id !== action.payload)],
      };
    case 'USER_UPDATE_PROFILE':
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        ),
      };
    default:
      return state;
  }
}
