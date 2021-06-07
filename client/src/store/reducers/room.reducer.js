const initialState = {
  rooms: [],
};

const roomReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'ROOM/FETCH':
      console.log(payload, '<<<<< DI STORE ROOM');
      return { ...state, rooms: payload };
    default:
      return state;
  }
};

export default roomReducer;
