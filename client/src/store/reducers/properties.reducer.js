const initialState = {
  properties: [],
};

const expensesReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'PROPERTIES/FETCH':
      console.log(payload, '<<<<< DI STORE PROPERTIES');
      return { ...state, properties: payload };
    default:
      return state;
  }
};

export default expensesReducer;
