import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import { _, Grid } from 'gridjs-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTenant,
  createTenant,
  updateTenant,
  deleteTenant,
} from '../store/actions/actions';
import { dateOnly } from '../helpers/helpers';
import Swal from 'sweetalert2';
import styles from './styling/tenant.module.css';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import {
  Container,
  Row,
  Col,
  Button,
  Navbar,
  Nav,
  NavDropdown,
  Modal,
  Form,
} from 'react-bootstrap';
import { FaPhoneSquareAlt } from 'react-icons/fa';

function TenantPage() {
  const dispatch = useDispatch();

  const tenantData = useSelector((state) => state.tenant.tenantsData);

  useEffect(() => {
    dispatch(fetchTenant());
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showEditForm, setShowEditForm] = useState(false);
  const handleCloseEditForm = () => setShowEditForm(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  const [editId, setEditId] = useState('');

  const handleShowEditForm = (e) => {
    setEditName(e.name);
    setEditEmail(e.email);
    setEditPhone(e.phone);
    setEditCheckIn(e.checkIn);
    setEditCheckOut(e.checkOut);
    setEditId(e.id);
    setShowEditForm(true);
  };

  const handleAddTenant = () => {
    const newTenant = { name, email, phone, checkIn };

    setName('');
    setEmail('');
    setPhone('');
    setCheckIn('');

    dispatch(createTenant(newTenant));
    handleClose();
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'Tenant Added',
    });
  };

  const handleUpdateTenant = () => {
    const updateDataTenant = {
      name: editName,
      email: editEmail,
      phone: editPhone,
      checkIn: editCheckIn,
      checkOut: editCheckOut,
    };
    dispatch(updateTenant(editId, updateDataTenant));
    handleCloseEditForm();
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'Updated Successfully',
    });
  };

  const handleDeleteTenant = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteTenant(id));
        console.log(id, '<<<<<<<<<<<<<<<< DELETE ID');
        const Toast = Swal.mixin({
          toast: true,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: 'top-end',
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'Tenant sucessfully deleted.',
        });
      }
    });
  };

  const handleExportToPdf = () => {
    const doc = new jsPDF();

    doc.text('List of Tenant', 85, 10);
    doc.autoTable({
      headStyles: { fillColor: '#343F56' },
      head: [['Id', 'Name', 'Email', 'Phone', 'Check In']],
      footStyles: { fillColor: '#343F56' },
      foot: [{ fillColor: '#343F56' }],
      body: tenantData.map((t) => {
        return [t.id, t.name, t.email, t.phone, dateOnly(t.checkIn)];
      }),
    });

    doc.save('table.pdf');
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={2}>
            <Sidebar />
          </Col>
          <Col xs={10} style={{ padding: '20px' }}>
            <Row className='justify-content-md-center'>
              <h1
                style={{
                  fontWeight: 'bold',
                  fontSize: '50px',
                  color: '#343F56',
                }}
              >
                Tenants
              </h1>
            </Row>
            <Row
              className='m-5 flex-column'
              style={{
                backgroundColor: 'white',
                borderRadius: 30,
                padding: '10px',
              }}
            >
              <Col
                className='m-2 d-flex align-items-center'
                style={{
                  flexDirection: 'column',
                  padding: '20px',
                }}
              >
                <h2
                  className='text-center mb-3'
                  style={{
                    // border: 'solid',
                    // borderColor: 'red',
                    padding: '10px',
                    fontWeight: 'bold',
                    color: '#343F56',
                  }}
                >
                  Tenants Table
                </h2>
                <div style={{ alignSelf: 'flex-center' }}>
                  <Button
                    className='mr-2'
                    variant='primary shadow'
                    onClick={() => {
                      console.log('clicked');
                      handleShow();
                    }}
                    style={{
                      // alignSelf: 'flex-end',
                      color: '#FFF',
                      // fontSize: '1.2rem',
                    }}
                  >
                    <MdIcons.MdPersonAdd
                      style={{
                        fontSize: '1.3rem',
                        color: '#fff',
                        alignItems: 'center',
                        marginRight: '3px',
                      }}
                    />{' '}
                    Add New Tenant
                  </Button>

                  <Button
                    onClick={() => {
                      console.log('clicked');
                      handleExportToPdf();
                    }}
                    variant='info shadow'
                  >
                    <MdIcons.MdFileDownload
                      style={{
                        fontSize: '1.3rem',
                        color: '#fff',
                        alignItems: 'center',
                        marginRight: '3px',
                      }}
                    />
                    Export To PDF
                  </Button>
                </div>

                <Grid
                  data={tenantData.map((e) => {
                    return [
                      // e.id,
                      e.name,
                      e.email,
                      e.phone,
                      new Date(e.checkIn).toDateString(),
                      e.checkOut && new Date(e.checkOut).toDateString(),
                      _(
                        <>
                          {' '}
                          <Button
                            // style={{
                            //   fontSize: '1.2rem',
                            //   color: '#343F56',
                            //   alignItems: 'center',
                            // }}
                            variant={'info'}
                            size='sm'
                            onClick={() => {
                              handleShowEditForm(e);
                            }}
                          >
                            <FaIcons.FaEdit />
                          </Button>{' '}
                          <Button
                            // style={{ fontSize: '1.2rem', color: '#f54748' }}
                            variant={'danger'}
                            size='sm'
                            onClick={() => handleDeleteTenant(e.id)}
                          >
                            <MdIcons.MdDelete />
                          </Button>{' '}
                        </>
                      ),
                    ];
                  })}
                  columns={[
                    // 'Id',
                    'Name',
                    'Email',
                    'Phone',
                    'In',
                    'Out',
                    'Action',
                  ]}
                  sort={true}
                  search={true}
                  pagination={{
                    enabled: true,
                    limit: 10,
                    summary: false,
                  }}
                  style={{
                    table: {
                      color: '#343f56',
                    },
                    th: {
                      'background-color': '#343F56',
                      color: '#FFF',
                      'text-align': 'center',
                    },
                    td: {
                      'background-color': '##EEF3F8',
                    },
                    footer: {
                      'background-color': '#343F56',
                    },
                  }}
                ></Grid>
              </Col>

              {}

              {/* Modal Add Tenant */}
              <Modal
                style={{ color: '#343F56' }}
                show={show}
                onHide={handleClose}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Add Tenant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='full name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type='text'
                        min={1}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Check In</Form.Label>
                      <Form.Control
                        type='date'
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='secondary' onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant='primary' onClick={handleAddTenant}>
                    Add
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Modal Edii Tenant */}
              <Modal show={showEditForm} onHide={handleCloseEditForm}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Tenant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='full name'
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type='email'
                        placeholder='Enter email'
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type='text'
                        min={1}
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Check In</Form.Label>
                      <Form.Control
                        type='date'
                        value={dateOnly(editCheckIn)}
                        onChange={(e) => setEditCheckIn(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Check Out</Form.Label>
                      <Form.Control
                        type='date'
                        // value={dateOnly(editCheckOut)}
                        onChange={(e) => setEditCheckOut(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='secondary' onClick={handleCloseEditForm}>
                    Close
                  </Button>
                  <Button variant='primary' onClick={handleUpdateTenant}>
                    Update
                  </Button>
                </Modal.Footer>
              </Modal>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TenantPage;
