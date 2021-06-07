import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import { _, Grid } from 'gridjs-react';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { newMonth, numberMonth, month } from '../helpers/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import {
  fetchRevenue,
  fetchExpenses,
  createExpenses,
  updateExpenses,
  deleteExpense,
  fetchReportPayment,
  fetchReportExpenses,
} from '../store/actions/actions';

function HistoryPage() {
  const dispatch = useDispatch();

  const expenseData = useSelector((state) => state.expense.expenses);
  const reportExpenseData = useSelector(
    (state) => state.expense.reportExpenses
  );
  const reportPaymentData = useSelector(
    (state) => state.payment.reportPayments
  );

  // Kebutuhan Expense ======================================================
  // ? >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> HOME Expense
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  let newDataExpense = [...expenseData];

  const [expenseAddTitle, setExpenseAddTitle] = useState('');
  const [expenseAddMonth, setExpenseAddMonth] = useState('');
  const [expenseAddYear, setExpenseAddYear] = useState(0);
  const [expenseAddTotal, setExpenseAddTotal] = useState(0);

  const [expenseUpdateTitle, setExpenseUpdateTitle] = useState('');
  const [expenseUpdateMonth, setExpenseUpdateMonth] = useState('');
  const [expenseUpdateYear, setExpenseUpdateYear] = useState(0);
  const [expenseUpdateTotal, setExpenseUpdateTotal] = useState(0);
  const [expenseUpdateId, setExpenseUpdateId] = useState('');

  const handleCloseAddForm = () => setShowAddForm(false);
  const handleShowAddForm = () => setShowAddForm(true);
  const handleCloseUpdateForm = () => setShowUpdateForm(false);
  const handleShowUpdateForm = (payload) => {
    setExpenseUpdateTitle(payload.title);
    setExpenseUpdateMonth(payload.month);
    setExpenseUpdateYear(payload.year);
    setExpenseUpdateTotal(payload.total);
    setExpenseUpdateId(payload.id);
    setShowUpdateForm(true);
  };

  const addExpenseTransaction = () => {
    const newDataExpense = {
      title: expenseAddTitle,
      month: +expenseAddMonth,
      year: expenseAddYear,
      total: expenseAddTotal,
    };
    dispatch(createExpenses(newDataExpense));
    handleCloseAddForm();
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
      title: 'Add is Successfully',
    });
    setExpenseAddTitle('');
    setExpenseAddMonth('');
    setExpenseAddYear('');
    setExpenseAddTotal('');
  };

  const updateExpenseTransaction = () => {
    const updateDataExpense = {
      title: expenseUpdateTitle,
      month: +expenseUpdateMonth,
      year: expenseUpdateYear,
      total: expenseUpdateTotal,
    };
    dispatch(updateExpenses(expenseUpdateId, updateDataExpense));
    handleCloseUpdateForm();
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
  };

  const handelDeleteExpense = (id) => {
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
        dispatch(deleteExpense(id));
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
          title: 'Expense sucessfully deleted.',
        });
      }
    });
  };

  let newDataExpenseBar = [];
  for (let i = 0; i < expenseData.length; i++) {
    const expense = expenseData[i].total;
    newDataExpenseBar.push(expense);
  }

  // ? <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< End Expense

  useEffect(() => {
    dispatch(fetchRevenue());
    dispatch(fetchExpenses());
    dispatch(fetchReportPayment());
    dispatch(fetchReportExpenses());
  }, []);

  const handleExportToPdf = () => {
    const doc = new jsPDF();

    doc.text('Expenses Report', 85, 10);
    doc.autoTable({
      head: [['Id', 'Description', 'Month', 'Year', 'Total Expense']],
      body: newDataExpense.map((t, index) => {
        return [
          index + 1,
          t.title,
          month(t.month),
          t.year,
          `Rp. ${t.total?.toLocaleString()}`,
        ];
      }),
    });

    doc.save('expense_report.pdf');
  };

  const handleExportPaymentToPdf = () => {
    const doc = new jsPDF();

    doc.text('Revenue Report', 85, 10);
    doc.autoTable({
      head: [['Id', 'Month', 'Year', 'Total Revenue']],
      body: reportPaymentData.map((t, index) => {
        return [
          index + 1,
          month(t.month),
          t.year,
          `Rp. ${t.totalPaid?.toLocaleString()}`,
        ];
      }),
    });

    doc.save('revenue_report.pdf');
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
                className='text-center'
                style={{
                  fontWeight: 'bold',
                  fontSize: '50px',
                  color: '#343F56',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                History
              </h1>
            </Row>
            <Row
              className='shadow m-5 border border-3'
              style={{
                backgroundColor: 'white',
                borderRadius: 30,
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
                    padding: '10px',
                    fontWeight: 'bold',
                    color: '#343F56',
                  }}
                >
                  Expense Table
                </h2>

                <div style={{ alignSelf: 'flex-center' }}>
                  <Button
                    className='mr-2'
                    variant='primary shadow'
                    onClick={() => {
                      handleShowAddForm();
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
                    Input Expense
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
                  data={newDataExpense.map((e, index) => {
                    return [
                      index + 1,
                      e.title,
                      month(e.month),
                      e.year,
                      `Rp. ${e.total?.toLocaleString()}`,
                      _(
                        <>
                          {' '}
                          <Button
                            variant={'info'}
                            size='sm'
                            onClick={() => handleShowUpdateForm(e)}
                          >
                            <FaIcons.FaEdit />
                          </Button>{' '}
                          <Button
                            variant={'danger'}
                            size='sm'
                            onClick={() => handelDeleteExpense(e.id)}
                          >
                            <MdIcons.MdDelete />
                          </Button>{' '}
                        </>
                      ),
                    ];
                  })}
                  columns={['Id', 'Title', 'Month', 'Year', 'Total', 'Action']}
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

                <Modal show={showAddForm} onHide={handleCloseAddForm}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Expense</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Expense description'
                          value={expenseAddTitle}
                          onChange={(e) => setExpenseAddTitle(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Month</Form.Label>
                        <select
                          className='custom-select'
                          value={expenseAddMonth}
                          onChange={(e) => setExpenseAddMonth(e.target.value)}
                        >
                          <option selected disabled>
                            Select Month
                          </option>
                          <option value='1'>January</option>
                          <option value='2'>February</option>
                          <option value='3'>March</option>
                          <option value='4'>April</option>
                          <option value='5'>May</option>
                          <option value='6'>June</option>
                          <option value='7'>July</option>
                          <option value='8'>August</option>
                          <option value='9'>September</option>
                          <option value='10'>October</option>
                          <option value='11'>November</option>
                          <option value='12'>December</option>
                        </select>
                        {/* <Form.Control
                          type='number'
                          placeholder='Month ( 1-12 )'
                          min={1}
                          max={12}
                          value={expenseAddMonth}
                          onChange={(e) => setExpenseAddMonth(e.target.value)}
                        /> */}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Year</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Year ex:2021'
                          min={1}
                          value={expenseAddYear}
                          onChange={(e) => setExpenseAddYear(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Total</Form.Label>
                        <Form.Control
                          placeholder='Total expenses'
                          type='number'
                          min={1}
                          value={expenseAddTotal}
                          onChange={(e) => setExpenseAddTotal(e.target.value)}
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseAddForm}>
                      Close
                    </Button>
                    <Button variant='primary' onClick={addExpenseTransaction}>
                      Add
                    </Button>
                  </Modal.Footer>
                </Modal>

                {/* Update */}
                <Modal show={showUpdateForm} onHide={handleCloseUpdateForm}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Expense</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='expense description'
                          value={expenseUpdateTitle}
                          onChange={(e) =>
                            setExpenseUpdateTitle(e.target.value)
                          }
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Month</Form.Label>
                        <select
                          className='custom-select'
                          value={expenseUpdateMonth}
                          onChange={(e) =>
                            setExpenseUpdateMonth(e.target.value)
                          }
                        >
                          <option selected disabled>
                            Select Month
                          </option>
                          <option value='1'>January</option>
                          <option value='2'>February</option>
                          <option value='3'>March</option>
                          <option value='4'>April</option>
                          <option value='5'>May</option>
                          <option value='6'>June</option>
                          <option value='7'>July</option>
                          <option value='8'>August</option>
                          <option value='9'>September</option>
                          <option value='10'>October</option>
                          <option value='11'>November</option>
                          <option value='12'>December</option>
                        </select>
                        {/* <Form.Control
                          type='number'
                          placeholder='Input Month ( 1-12 )'
                          min={1}
                          max={12}
                          value={expenseUpdateMonth}
                          onChange={(e) =>
                            setExpenseUpdateMonth(e.target.value)
                          }
                        /> */}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Year</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Input year ex:2021'
                          min={1}
                          value={expenseUpdateYear}
                          onChange={(e) => setExpenseUpdateYear(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Total</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Input total'
                          min={1}
                          value={expenseUpdateTotal}
                          onChange={(e) =>
                            setExpenseUpdateTotal(e.target.value)
                          }
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseUpdateForm}>
                      Close
                    </Button>
                    <Button
                      variant='primary'
                      onClick={updateExpenseTransaction}
                    >
                      Update
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Col>
            </Row>

            {/* ======================== PROFIT =========================== */}

            <Row
              className='shadow m-5 border border-3'
              style={{
                backgroundColor: 'white',
                borderRadius: 30,
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
                  }}
                >
                  Income Table
                </h2>

                <div style={{ alignSelf: 'flex-center' }}>
                  <Button
                    onClick={() => {
                      console.log('clicked');
                      handleExportPaymentToPdf();
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
                  data={reportPaymentData.map((e, index) => {
                    return [
                      index + 1,
                      month(e.month),
                      e.year,
                      `Rp. ${e.totalPaid?.toLocaleString()}`,
                    ];
                  })}
                  columns={[
                    { name: 'Id', width: '20%' },
                    { name: 'Month', width: '30%' },
                    { name: 'Year', width: '30%' },
                    { name: 'Total', width: '40%' },
                  ]}
                  sort={true}
                  search={true}
                  pagination={{
                    enabled: true,
                    // limit: 5,
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
                    width: 100,
                  }}
                ></Grid>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HistoryPage;
