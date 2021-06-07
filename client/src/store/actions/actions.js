import axios from '../../API/axios'; // ganti pake axios
// import baseUrl from '../../API/baseUrl';
// const RevenueDB = 'http://localhost:4000/revenues';
// const expensesDB = 'http://localhost:4000/expenses';
// const RoomDB = 'http://localhost:4000/rooms';
// const TenantDB = 'http://localhost:4000/tenant';

// ACTION REVENUE ===========================================================

export const postLogin = (email, password) => {
  return axios({
    method: 'POST',
    url: `/login`,
    data: {
      email,
      password,
    },
  })
    .then((response) => {
      const access_token = response.data.access_token;
      console.log(access_token);
      localStorage.setItem('access_token', access_token);
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchRevenue = () => {
  return (dispatch) => {
    axios
      .get('/revenues', {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((response) => {
        console.log(response.data.revenues, '<<<< di Action Expenses');
        return dispatch({
          type: 'REVENUE/FETCH',
          payload: response.data.revenues,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// ACTION EXPENSES ===========================================================
export const fetchExpenses = () => {
  return (dispatch) => {
    axios
      .get('/expenses', {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((response) => {
        console.log(response.data, '<<<< di Action Expenses');
        return dispatch({ type: 'EXPENSES/FETCH', payload: response.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const createExpenses = (payload) => {
  return (dispatch) => {
    axios
      .post('/expenses', payload, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((_) => {
        console.log(payload, 'aaazz');
        dispatch(fetchReportExpenses());
        return dispatch(fetchExpenses());
      })
      .catch((err) => console.log(err));
  };
};

export const updateExpenses = (id, payload) => {
  return (dispatch) => {
    axios
      .put(`/expenses/${id}`, payload, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((_) => {
        dispatch(fetchReportExpenses());
        return dispatch(fetchExpenses());
      })
      .catch((err) => console.log(err));
  };
};

export const deleteExpense = (id) => {
  return (dispatch) => {
    axios
      .delete(`/expenses/${id}`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((_) => {
        dispatch(fetchReportExpenses());
        return dispatch(fetchExpenses());
      })
      .catch((err) => console.log(err));
  };
};

// ACTION PROPERTIES ===========================================================
export const fetchProperties = (loading, setLoading, property, setProperty) => {
  return (dispatch) => {
    axios
      .get('/properties', {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((response) => {
        console.log(response.data.properties, '<<<< di Action Properties');
        setProperty(response.data.properties);
        setLoading(false);
        return dispatch({
          type: 'PROPERTIES/FETCH',
          payload: response.data.properties,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const editPropertyData = (
  payload,
  loading,
  setLoading,
  property,
  setProperty
) => {
  return (dispatch) => {
    axios
      .put(`/properties/${payload.id}`, payload, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(() => {
        console.log(payload, '<<<< di Action Properties');
        // setProperty(response.data.properties);
        // setLoading(false);
        return dispatch(
          fetchProperties(loading, setLoading, property, setProperty)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// ACTION ROOM ===========================================================
export const fetchRoom = () => {
  return (dispatch) => {
    axios
      .get('/rooms', {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((room) => {
        console.log(room.data, '<<<< di Action Room');
        return dispatch({ type: 'ROOM/FETCH', payload: room.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const deleteRoom = (id) => {
  return (dispatch) => {
    axios
      .delete(`/rooms/${id}`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((_) => {
        return dispatch(fetchRoom());
      })
      .catch((err) => {
        console.log(err, 'error del room');
      });
  };
};

export const createRoom = (payload) => {
  return (dispatch) => {
    axios
      .post('/rooms', payload, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((response) => {
        console.log(response, 'action respon add romm');
        return dispatch(fetchRoom());
      })
      .catch((err) => {
        console.log(err, 'err di add actions room');
      });
  };
};

export const updateRoom = (payload, id) => {
  console.log(id, payload, ' id action rom update');
  return (dispatch) => {
    axios
      .put(`/rooms/${id}`, payload, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((_) => {
        return dispatch(fetchRoom());
      })
      .catch((err) => {
        console.log(err, 'err action edit room');
      });
  };
};

export const changeRoomStatus = (payload) => {
  const { roomId, status } = payload;
  console.log(payload);
  return (dispatch) => {
    axios
      .patch(`/rooms/${roomId}`, payload, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((response) => {
        console.log(response, '<<<< di Action Room INIIIIII');
        return dispatch(fetchRoom());
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// ACTION TENANT ===========================================================
export const fetchTenant = () => {
  return (dispatch) => {
    axios
      .get('/tenant', {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((tenant) => {
        return dispatch({ type: 'TENANT/FETCH', payload: tenant.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const createTenant = (payload) => {
  return (dispatch) => {
    axios
      .post('/tenant', payload, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((_) => {
        return dispatch(fetchTenant());
      })
      .catch((err) => console.log(err));
  };
};

export const updateTenant = (id, payload) => {
  return (dispatch) => {
    axios
      .put(`/tenant/${id}`, payload, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((_) => {
        return dispatch(fetchTenant());
      })
      .catch((err) => console.log(err));
  };
};

export const deleteTenant = (id) => {
  return (dispatch) => {
    axios
      .delete(`/tenant/${id}`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((_) => {
        console.log('berhasil Delete DI Action');
        return dispatch(fetchTenant());
      })
      .catch((err) => console.log(err));
  };
};

// POST REGISTER USER ========================================================
export const userRegister = (
  email,
  username,
  password,
  fullname,
  bankAccount
) => {
  // console.log(email, username, password, 'masyuk cuy')
  return (dispatch) => {
    axios
      .post('/register', {
        email,
        username,
        password,
        fullname,
        bankAccount,
      })
      .then((response) => {
        console.log(response, ' ini response register user');
      })
      .catch((err) => {
        console.log(err, 'err reg user fakk');
      });
  };
};

// ACTION PAYMENT ======================================================
export const fetchPayment = () => {
  return (dispatch) => {
    axios
      .get('/payments', {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((payment) => {
        console.log(payment.data, '<<<< di Action PAYMENT');
        return dispatch({ type: 'PAYMENT/FETCH', payload: payment.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const createPayment = (payload) => {
  const { month, year, nextDueDate, paidCash, roomId, tenanId } = payload;
  const newPayload = { month, year, nextDueDate, paidCash };

  return (dispatch) => {
    axios
      .post(`/payments/${roomId}/${tenanId}`, newPayload, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then(() => {
        console.log(payload, '<<<< di Action PAYMENT');
        return dispatch(fetchPayment());
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const deletePayment = (id) => {
  return (dispatch) => {
    axios
      .delete(`/payments/${id}`, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((_) => {
        return dispatch(fetchPayment());
      })
      .catch((err) => console.log(err));
  };
};

export const updatePayment = (payload) => {
  console.log(payload, '<<<<<<<<< Payload di action');
  return (dispatch) => {
    axios
      .put(`/payments/${payload.id}`, payload, {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((response) => {
        const updatedData = response.data.updatedData;
        console.log(updatedData, 'INI ACTION UPDATE PAYMENT');
        return dispatch(fetchPayment());
      })
      .catch((err) => console.log(err));
  };
};

export const fetchReportPayment = () => {
  return (dispatch) => {
    axios
      .get('payments/reportPayment', {
        headers: {
          access_token: localStorage.access_token,
        },
      })
      .then((response) => {
        console.log(response.data, 'DI ACTION >>>>>>>>>>');
        return dispatch({
          type: 'PAYMENTREPORT/FETCH',
          payload: response.data,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const fetchReportExpenses = () => {
  return (dispatch) => {
    axios
      .get(`expenses/reportExpense`, {
        headers: {
          access_token: localStorage.getItem('access_token'),
        },
      })
      .then((response) => {
        console.log(response, '+++++++++++++++++++++++ INI REPORT EXPENSES');
        let expenseReport = response.data;
        dispatch({ type: 'REPORTEXPENSES/FETCH', payload: expenseReport });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
