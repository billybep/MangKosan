const initialState = {
  tenantsData: [],
};

const tenantReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'TENANT/FETCH':
      return { ...state, tenantsData: payload };
    default:
      return state;
  }
};

export default tenantReducer;
