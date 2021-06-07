import React, { useState, useEffect } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Register from './pages/RegisterPage';
import Login from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import TenantPage from './pages/TenantPage';
import HistoryPage from './pages/HistoryPage';
import PaymentPage from './pages/PaymentPage';
import RoomPage from './pages/RoomPage';
import ProtectedRoute from './protectedRoute';

function App() {
  return (
    <>
      <div className='App'>
        <Switch>
          <Route exact path='/register'>
            <Register />
          </Route>
          <Route path='/login' component={Login} />
          <ProtectedRoute path='/payments' component={PaymentPage} />
          <ProtectedRoute path='/history' component={HistoryPage} />
          <ProtectedRoute path='/tenant' component={TenantPage} />
          <ProtectedRoute path='/profile' component={ProfilePage} />
          <ProtectedRoute path='/rooms' component={RoomPage} />
          <ProtectedRoute path='/' component={HomePage} />
        </Switch>
      </div>
    </>
  );
}

{
  /* <Route path='/login'>
<Login />
</Route>
<Route path='/payments'>
<PaymentPage />
</Route>
<Route path='/calendar'>
<CalendarPage />
</Route>
<Route path='/tenant'>
<TenantPage />
</Route>
<Route path='/profile'>
<ProfilePage />
</Route>
<Route path='/rooms'>
<RoomPage />
</Route>
<Route path='/'>
<HomePage />
</Route> */
}

export default App;
