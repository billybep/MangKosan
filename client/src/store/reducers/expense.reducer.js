const initialState = {
  expenses: [],
  reportExpenses: []
};

const expensesReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'EXPENSES/FETCH':
      return { ...state, expenses: payload };
    case 'REPORTEXPENSES/FETCH':
      return { ...state, reportExpenses: payload };
    default:
      return state;
  }
};

export default expensesReducer;
