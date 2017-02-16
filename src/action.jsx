
// action
const INCREMENT = 'INCREMENT';
const RESET = 'RESET';

// action creators
export const increment = () => ({
  type: INCREMENT,
});

export const reset = () => ({
  type: RESET,
});

// reducer
const initialState = {
  minutes: 0.0,
  timer: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      {
        if (state.minutes >= 30) {
          return state;
        }
        return {
          ...state,
          minutes: state.minutes + 1,
        };
      }
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
