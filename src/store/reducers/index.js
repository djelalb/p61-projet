import { combineReducers } from 'redux';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import tasksReducer from './tasksReducer';
import categoriesReducer from './categoriesReducer';

const rootReducer = combineReducers({
  user: userReducer,
  users: usersReducer,
  tasks: tasksReducer,
  categories: categoriesReducer,
});

export default rootReducer;
