const initialState = {
  categories: [],
};

export default function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case 'CATEGORY_ADD':
      return {
        categories: [action.payload, ...state.categories],
      };
    case 'CATEGORY_CHANGE':
      return {
        categories: state.categories.map((category) => {
          if (category.id === action.payload.id) {
            return action.payload;
          } else {
            return category;
          }
        }),
      };
    case 'CATEGORY_REMOVE':
      return {
        categories: state.categories.filter((category) => category.id !== action.payload),
      };
    default:
      return state;
  }
}
