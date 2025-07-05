const initialState = {
  tasks: [],
};

export default function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case 'TASK_ADD':
      return {
        tasks: [action.payload, ...state.tasks],
      };
    case 'TASK_CHANGE':
      return {
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id) {
            return action.payload;
          } else {
            return task;
          }
        }),
      };
    case 'TASK_REMOVE':
      return {
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'TASKS_IMPORT':
      console.log('TASKS_IMPORT action triggered', action.payload);
      return {
        ...state,
        tasks: action.payload,
      };
    default:
      return state;
  }
}
