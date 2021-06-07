import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import { dateOnly } from '../helpers/helpers';
import { _, Grid } from 'gridjs-react';
import { useDispatch, useSelector } from 'react-redux';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
// import * as AiIcons from 'react-icons/ai';
import styles from './styling/payment.module.css';
import {
  fetchPayment,
  fetchTenant,
  fetchRoom,
  createPayment,
  deletePayment,
  changeRoomStatus,
  updatePayment,
} from '../store/actions/actions';

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
import { month } from '../helpers/helpers';

function PaymentPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [idEdit, setIdEdit] = useState(0);
  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState(0);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [nextDueDate, setNextDueDate] = useState('');
  const [paidCash, setPaidCash] = useState(0);

  const [nameEdit, setNameEdit] = useState('');
  const [roomNumberEdit, setRoomNumberEdit] = useState(0);
  const [monthEdit, setMonthEdit] = useState(0);
  const [yearEdit, setYearEdit] = useState(0);
  const [nextDueDateEdit, setNextDueDateEdit] = useState('');
  const [paidCashEdit, setPaidCashEdit] = useState(0);

  const tenantData = useSelector((state) => state.tenant.tenantsData);

  const dispatch = useDispatch();

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const paymentData = useSelector((state) => state.payment.payments);
  const roomData = useSelector((state) => state.room.rooms);
  // console.log(paymentData, '<< Data Payment');
  // console.log(roomNumber, '<< Id Room');
  // console.log(nameEdit, '<< Name');

  let newDataPayment = [...paymentData];

  function handleSubmitButtonAdd() {
    const newPaymentData = {
      month: +month,
      year: +year,
      nextDueDate,
      paidCash: +paidCash,
      roomId: +roomNumber,
      tenanId: +name,
    };

    dispatch(createPayment(newPaymentData));
    // dispatch(changeRoomStatus(statusUpdate));
    dispatch(fetchRoom());
    dispatch(fetchPayment());
    handleCloseAdd();
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
      title: 'Payment Added',
    });
  }

  function handleSubmitButtonEdit(event) {
    const newDataEditPayment = {
      id: +idEdit,
      month: +monthEdit,
      year: +yearEdit,
      nextDueDate: nextDueDateEdit,
      paidCash: +paidCashEdit,
      // roomId: +roomNumberEdit,
      // tenanId: +nameEdit,
    };
    console.log(newDataEditPayment, '<<<<<<<<<<<<<<<< DI PAYMENT PAGE');

    dispatch(updatePayment(newDataEditPayment));
    handleCloseEdit();
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
      title: 'Updeted Successfully',
    });

    console.log(newDataEditPayment, '<< New Data Edit Payment');
  }

  function handleDeletePayment(id) {
    console.log(id);
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
        dispatch(deletePayment(id));
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
          title: 'Payment sucessfully deleted.',
        });
      }
    });
  }

  function handleEditButton(e) {
    setIdEdit(e.id);
    setNameEdit(e.Tenant.id);
    setRoomNumberEdit(e.Room.id);
    setMonthEdit(e.month);
    setYearEdit(e.year);
    setNextDueDateEdit(e.nextDueDate);
    setPaidCashEdit(e.paidCash);
    handleShowEdit();
  }

  useEffect(() => {
    dispatch(fetchPayment());
  }, []);

  useEffect(() => {
    dispatch(fetchTenant());
  }, []);

  useEffect(() => {
    dispatch(fetchRoom());
  }, []);

  const handleExportToPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(25);
    doc.setTextColor(52, 63, 86);
    doc.text('Mangkosan', 34, 10, {
      lineHeightFactor: 5,
    });
    doc.setFontSize(15);
    doc.text('Logo |', 15, 10, {
      lineHeightFactor: 5,
    });
    doc.setFontSize(10);
    doc.text('Alamat : Jl. Nama Jalan, Jakarta Barat', 35, 16);
    doc.setLineWidth(20);

    doc.setFontSize(20);
    doc.text('List of Payments', 85, 35);
    doc.autoTable({
      margin: { top: 40 },
      headStyles: { fillColor: '#343F56', halign: 'center' },
      head: [['No.', 'Name', 'Month', 'Year', 'Next Due Date', 'Paid Cash']],
      columnStyles: {
        1: { minCellWidth: 30 },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { cellWidth: 30, halign: 'center' },
        5: { halign: 'right', margin: { right: 30 } },
      },
      foot: [{ fillColor: '#343F56' }],
      footStyles: { fillColor: '#343F56' },
      bodyStyles: { lineColor: '#343F56', lineWidth: 0 },
      body: paymentData.map((e) => {
        return [
          e.id,
          e.Tenant.name,
          monthFormat(e.month),
          e.year,
          dateOnly(e.nextDueDate),
          `Rp. ${e.paidCash?.toLocaleString()}`,
        ];
      }),
    });

    doc.save('Payments_Tabel.pdf');
  };

  const monthFormat = (date) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return monthNames[date - 1];
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
                // className={styles.title}
                style={{
                  fontWeight: 'bold',
                  fontSize: '50px',
                  color: '#343F56',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                Payments
              </h1>
            </Row>
            <Row
              className='m-5 flex-column'
              style={{
                backgroundColor: 'white',
                borderRadius: 30,
                padding: '20px',
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
                  Payments Table
                </h2>
                <div style={{ alignSelf: 'flex-center' }}>
                  <Button
                    className='mr-2'
                    variant='primary shadow'
                    onClick={() => {
                      console.log('clicked');
                      handleShowAdd();
                    }}
                    style={{
                      color: '77acf1',
                    }}
                  >
                    <MdIcons.MdAdd
                      style={{
                        fontSize: '1.3rem',
                        color: '#fff',
                        alignItems: 'center',
                        marginRight: '3px',
                      }}
                    />
                    Add Payment
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
                  data={newDataPayment.map((e, index) => {
                    const monthYear = `${monthFormat(e.month)} ${e.year}`;
                    const yearPaid = `Rp. ${e.paidCash?.toLocaleString()}`;
                    return [
                      index + 1,
                      e.Tenant.name,
                      monthYear,
                      new Date(e.nextDueDate).toDateString(),
                      yearPaid,
                      e.Room.number,
                      _(
                        <>
                          {' '}
                          <Button
                            variant={'info'}
                            size='sm'
                            onClick={() => handleEditButton(e)}
                          >
                            <FaIcons.FaEdit />
                          </Button>{' '}
                          <Button
                            variant={'danger'}
                            size='sm'
                            onClick={() => handleDeletePayment(e.id)}
                          >
                            <MdIcons.MdDelete />
                          </Button>{' '}
                        </>
                      ),
                    ];
                  })}
                  columns={[
                    'No',
                    'Name',
                    'Month',
                    'Due Date',
                    'Paid Cash',
                    'No.Room',
                    'Action',
                  ]}
                  sort={true}
                  search={true}
                  pagination={{
                    enabled: true,
                    limit: 5,
                    summary: false,
                  }}
                  style={{
                    table: {
                      color: '#343f56',
                      'justify-content': 'center',
                      'text-align': 'center',
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
            </Row>
          </Col>
        </Row>
        <Modal show={showAdd} onHide={handleCloseAdd}>
          <Modal.Header closeButton>
            <Modal.Title>Add Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='container p-3'>
              <Form>
                <Form.Group className='mb-3'>
                  <Form.Label>Name:</Form.Label>
                  <select
                    className='custom-select'
                    onChange={(e) => setName(e.target.value)}
                  >
                    <option selected disabled>
                      Open this select Name
                    </option>
                    {tenantData.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Room Number:</Form.Label>
                  <select
                    className='custom-select'
                    onChange={(e) => setRoomNumber(e.target.value)}
                  >
                    <option selected disabled>
                      Open this select Room
                    </option>
                    {roomData.map((e) => {
                      return (
                        <option key={e.id} value={e.id}>
                          {e.number} - {e.status}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Month:</Form.Label>
                  <Form.Control
                    type='number'
                    // defaultValue={property[0]?.address}
                    onChange={(e) => setMonth(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Year:</Form.Label>
                  <Form.Control
                    type='number'
                    // defaultValue={property[0]?.image}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Next DueDate:</Form.Label>
                  <Form.Control
                    type='date'
                    // defaultValue={property[0]?.phone}
                    onChange={(e) => setNextDueDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Paid Cash:</Form.Label>
                  <Form.Control
                    type='number'
                    // defaultValue={property[0]?.image}
                    onChange={(e) => setPaidCash(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseAdd}>
              Close
            </Button>
            <Button
              variant='primary'
              onClick={(event) => {
                handleSubmitButtonAdd(event);
              }}
            >
              Add Payment
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='container p-3'>
              <Form>
                {/* <Form.Group className='mb-3'>
                  <Form.Label>Name:</Form.Label>
                  <select
                    className='custom-select'
                    selected={nameEdit}
                    onChange={(e) => setNameEdit(e.target.value)}
                  >
                    <option disabled>Open this select Name</option>
                    {tenantData.map((e) => {
                      console.log(e, ' <<<<<<<<<<<<<<<<<<<<<<<<<<<<');
                      return (
                        <option
                          key={e.id}
                          value={e.id}
                          selected={
                            nameEdit ? (nameEdit == e.id ? true : false) : false
                          }
                        >
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Room Number:</Form.Label>
                  <select
                    className='custom-select'
                    selected={roomNumberEdit}
                    onChange={(e) => setRoomNumber(e.target.value)}
                  >
                    {roomData?.map((e) => {
                      return (
                        <option
                          key={e.id}
                          defaultValue={e.id}
                          selected={
                            roomNumberEdit
                              ? roomNumberEdit == e.id
                                ? true
                                : false
                              : false
                          }
                        >
                          {e.number}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group> */}
                <Form.Group className='mb-3'>
                  <Form.Label>Month:</Form.Label>
                  <Form.Control
                    type='number'
                    defaultValue={monthEdit}
                    onChange={(e) => setMonthEdit(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Year:</Form.Label>
                  <Form.Control
                    type='number'
                    defaultValue={yearEdit}
                    onChange={(e) => setYearEdit(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Next DueDate:</Form.Label>
                  <Form.Control
                    type='date'
                    defaultValue={dateOnly(nextDueDateEdit)}
                    onChange={(e) => setNextDueDateEdit(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Paid Cash:</Form.Label>
                  <Form.Control
                    type='number'
                    defaultValue={paidCashEdit}
                    onChange={(e) => setPaidCashEdit(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseEdit}>
              Close
            </Button>
            <Button
              variant='primary'
              onClick={(event) => {
                handleSubmitButtonEdit(event);
              }}
            >
              Edit Payment
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default PaymentPage;
