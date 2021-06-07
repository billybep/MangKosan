import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from '../API/axios';
import { userRegister } from '../store/actions/actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function Register() {
  const History = useHistory();

  const dispatch = useDispatch();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [fullName, setFullName] = useState();
  const [bankAccount, setBankAccount] = useState();

  async function registerHandler(e) {
    e.preventDefault();
    dispatch(userRegister(email, username, password, fullName, bankAccount));
    History.push('/login');
  }
  return (
    <div className="d-flex" style={{ 
      minHeight: "100vh",
      background: "linear-gradient( 90.5deg,  rgba(255,207,139,0.50) 1.1%, rgba(255,207,139,1) 81.3% )"
    }}>
      <div className="container shadow align-items-center justify-content-around d-flex flex-column mx-auto my-auto bg-white" style={{ height: "75vh", maxWidth: "55vw", borderRadius: "30px" }}>
        <div claassName="row">
          <h1>Register</h1>
        </div>

        <form onSubmit={registerHandler} className="d-flex justify-content-center" style={{ width: "90%" }}>
          <div className="row" style={{ width: "90%" }}>
            <Col>
              <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">Username</label>
                <input onChange={(e) => { setUsername(e.target.value) }} placeholder="Username" type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
              </div>
              <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">Email address</label>
                <input onChange={(e) => { setEmail(e.target.value) }} placeholder="Email Address" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
              </div>
              <div className="mb-3">
                <label for="exampleInputPassword1" className="form-label">Password</label>
                <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="form-control" id="exampleInputPassword1" />
              </div>

            </Col>
            <Col>
              <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">Full Name</label>
                <input onChange={(e) => { setFullName(e.target.value) }} placeholder="Full Name" type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
              </div>
              <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">Bank Account</label>
                <input onChange={(e) => { setBankAccount(e.target.value) }} placeholder="Bank Account" type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
              </div>
            </Col>
            <div className="d-flex justify-content-center">
              <Button rounded variant={""} size={"lg"} type="submit" style={{
                color: "black",
                minWidth: "60%",
                maxWidth: "80%",
                background: "##00DBDE",
                background: "linear-gradient(270deg, #00DBDE 19%, #FC00FF 100%)"
              }}
              >Register</Button>
            </div>
          </div>
        </form>

      <div className="row">
        <h6>
          Already have an account?{' '}
          <Link to='/login'>
            <span>Login Here</span>
          </Link>
        </h6>
      </div>
      </div>
    </div>
  );
}
