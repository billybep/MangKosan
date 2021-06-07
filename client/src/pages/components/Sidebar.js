import React from 'react';
import { Nav, Image } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';
import * as IoIcons from 'react-icons/io5';
import * as IoIcons4 from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import logo from '../components/Logo.png';
import './Sidebar.css';

const Side = (props, navigation) => {
  const History = useHistory();

  const handleLogout = () => {
    localStorage.clear();
    History.push('/login');
  };

  return (
    <>
      <Nav
        className='col-md-2 d-none d-md-block sidebar shadow'
        // className='flex-column'
        defaultActiveKey='/'
        variant='pills'
      >
        <div className='sidebar-sticky align-content-center text-center'>
          {/* <h3
            className='ml-2 mb-3 text-center'
            style={{ color: '#f54748', fontWeight: 'bold' }}
          >
            MangKosan
          </h3> */}
          <Image
            src={logo}
            className='rounded text-center'
            alt='mangkosan.png'
            style={{ width: '60%', alignItems: 'center' }}
            rounded
          />
        </div>
        <hr />
        <div className='navb'>
          <Nav.Item
            // className='nav '
            onClick={() => {
              History.push('/');
            }}
          >
            <Nav.Link style={{ color: 'white' }}>
              <RiIcons.RiLayoutMasonryFill size={20} className='icons' />
              <span>Dashboard</span>
            </Nav.Link>
          </Nav.Item>
        </div>
        <div className='navb'>
          <Nav.Item
            // className='nav'
            onClick={() => {
              History.push('/profile');
            }}
          >
            <Nav.Link style={{ color: 'white' }}>
              <IoIcons.IoHome size={20} />
              <span>Property Profile</span>
            </Nav.Link>
          </Nav.Item>
        </div>
        <div className='navb'>
          <Nav.Item
            // className='nav'
            onClick={() => {
              History.push('/rooms');
            }}
          >
            <Nav.Link style={{ color: 'white' }}>
              <RiIcons.RiProfileFill size={20} />
              <span>Your Rooms</span>
            </Nav.Link>
          </Nav.Item>
        </div>
        <div className='navb'>
          <Nav.Item
            // className='nav'
            onClick={() => {
              History.push('/tenant');
            }}
          >
            <Nav.Link style={{ color: 'white' }}>
              <BsIcons.BsFillPeopleFill size={20} />
              <span>Tenant</span>
            </Nav.Link>
          </Nav.Item>
        </div>
        <div className='navb'>
          <Nav.Item
            // className='nav'
            onClick={() => {
              History.push('/history');
            }}
          >
            <Nav.Link style={{ color: 'white' }}>
              <IoIcons.IoCalendar size={20} />
              <span>History</span>
            </Nav.Link>
          </Nav.Item>
        </div>
        <div className='navb'>
          <Nav.Item
            // className='nav'
            onClick={() => {
              History.push('/payments');
            }}
          >
            <Nav.Link style={{ color: 'white' }}>
              <MdIcons.MdPayment size={20} />
              <span>Payments</span>
            </Nav.Link>
          </Nav.Item>
        </div>
        <hr />

        <div className='navb'>
          <Nav.Item
            // className='nav'
            onClick={() => {
              handleLogout();
            }}
          >
            <Nav.Link style={{ color: 'white' }}>
              <IoIcons4.IoMdExit size={20} />
              <span>Logout</span>
            </Nav.Link>
          </Nav.Item>
        </div>
      </Nav>
    </>
  );
};
const Sidebar = withRouter(Side);
export default Sidebar;
