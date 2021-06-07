const initialState = {
  payments: [],
  reportPayments: [],
};

const paymentReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'PAYMENT/FETCH':
      console.log(payload, '<<<<< DI STORE PAYMENT');
      return { ...state, payments: payload };
    case 'PAYMENTREPORT/FETCH':
      return { ...state, reportPayments: payload };
    default:
      return state;
  }
};

export default paymentReducer;
