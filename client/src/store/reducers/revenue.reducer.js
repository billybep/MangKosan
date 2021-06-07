const initialState = {
  revenues: [],
};

const revenueReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'REVENUE/FETCH':
      console.log(payload, '<<<<< DI STORE REVENUE');
      return { ...state, revenues: payload };
    default:
      return state;
  }
};

export default revenueReducer;
