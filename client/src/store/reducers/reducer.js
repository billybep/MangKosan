import { combineReducers } from 'redux';
import revenueReducer from './revenue.reducer';
import roomReducer from './room.reducer';
import tenantReducer from './tenant.reducer';
import expenseReducer from './expense.reducer';
import propertyReducer from './properties.reducer';
import paymentReducer from './payment.reducer';

const rootReducer = combineReducers({
  revenue: revenueReducer,
  room: roomReducer,
  tenant: tenantReducer,
  expense: expenseReducer,
  property: propertyReducer,
  payment: paymentReducer,
});

export default rootReducer;
