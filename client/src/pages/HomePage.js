import React, { useEffect, useState } from 'react';
import './styling/home.module.css';
import Sidebar from './components/Sidebar';
import * as MdIcons from 'react-icons/md';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { newMonth, numberMonth, month } from '../helpers/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Doughnut, Bar, defaults } from 'react-chartjs-2';
import {
  fetchRevenue,
  fetchRoom,
  fetchExpenses,
  createExpenses,
  updateExpenses,
  deleteExpense,
  fetchPayment,
  fetchReportPayment,
  fetchReportExpenses,
} from '../store/actions/actions';

defaults.plugins.legend.position = 'right';

function HomePage({ component: Component, ...rest }) {
  const dispatch = useDispatch();
  const revenueData = useSelector((state) => state.revenue.revenues);
  const expenseData = useSelector((state) => state.expense.expenses);
  const reportExpenseData = useSelector(
    (state) => state.expense.reportExpenses
  );
  const reportPaymentData = useSelector(
    (state) => state.payment.reportPayments
  );
  const roomData = useSelector((state) => state.room.rooms);

  let newDataRevenue = [];
  for (let i = 0; i < revenueData.length; i++) {
    const revenue = revenueData[i].total;
    newDataRevenue.push(revenue);
  }

  let newDataPayment = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  reportPaymentData.map((data) => {
    newDataPayment[data.month - 1] = data.totalPaid;
  });

  let dataExpenseReport = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  reportExpenseData.map((data) => {
    dataExpenseReport[data.month - 1] = data.totalExpense;
  });

  let newDataExpense = [...expenseData];

  // Kebutuhan Room ===========================================================
  let emptyStatus = 0;
  let maintenaceStatus = 0;
  let occupiedStatus = 0;

  for (let i = 0; i < roomData.length; i++) {
    const statusRoom = roomData[i].status;

    if (statusRoom === 'empty') {
      emptyStatus++;
    } else if (statusRoom === 'maintenance') {
      maintenaceStatus++;
    } else {
      occupiedStatus++;
    }
  }

  const dataGraph = {
    labels: [
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
    ],
    datasets: [
      {
        label: 'Income',
        data: newDataPayment,
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1,
      },
      {
        label: 'Expense',
        data: dataExpenseReport,
        fill: false,
        backgroundColor: 'rgba(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
    ],
  };

  const dataPie = {
    labels: ['Empty', 'Maintenance', 'Occupied'],
    datasets: [
      {
        label: '# of Votes',
        data: [emptyStatus, maintenaceStatus, occupiedStatus],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235)',
          'rgba(255, 206, 86)',
        ],
        borderWidth: 1,
        hoverOffset: 10,
        radius: '90%',
      },
    ],
  };
  console.log(rest, 'INI REST DI HOME');

  const handleExportToPdf = () => {
    const doc = new jsPDF();

    doc.text('Revenues Report', 85, 10);
    doc.autoTable({
      head: [['Id', 'Month', 'Year', 'Total']],
      body: reportPaymentData.map((t, index) => {
        return [
          index + 1,
          month(t.month),
          t.year,
          `Rp. ${t.totalPaid?.toLocaleString()}`,
        ];
      }),
    });
    doc.addPage();
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

    doc.save('general_report.pdf');
  };

  useEffect(() => {
    dispatch(fetchRevenue());
    dispatch(fetchRoom());
    dispatch(fetchExpenses());
    dispatch(fetchPayment());
    dispatch(fetchReportPayment());
    dispatch(fetchReportExpenses());
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={2}>
            <Sidebar />
          </Col>
          <Col xs={10} style={{ padding: '20px' }}>
            <Row className='justify-content-md-center'>
              <Col>
                <h1
                  className='text-center'
                  style={{
                    fontWeight: 'bold',
                    fontSize: '50px',
                    color: '#343F56',
                  }}
                >
                  Dashboard
                </h1>
              </Col>
            </Row>
            <Row className='justify-content-md-centen m-5'>
              <Col
                className='text-center shadow '
                style={{
                  padding: '20px',
                  backgroundColor: 'rgb(255,216,120)',
                  borderRadius: 20,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '30px',
                }}
              >
                {newMonth(new Date())}
              </Col>
            </Row>
            <Row className='justify-content-md-centen m-5'>
              <Col
                className='text-center shadow '
                style={{
                  padding: '20px',
                  backgroundColor: 'rgb(54, 162, 235)',
                  borderRadius: 20,
                  color: 'white',
                  fontSize: '20px',
                }}
              >
                Income
                <div>Rp. {newDataPayment[numberMonth()]?.toLocaleString()}</div>
              </Col>
              <Col
                className='text-center shadow mr-4 ml-4'
                style={{
                  padding: '20px',
                  backgroundColor: 'rgba(255, 99, 132)',
                  borderRadius: 20,
                  color: 'white',
                  fontSize: '20px',
                }}
              >
                Expense
                <div>
                  Rp. {dataExpenseReport[numberMonth()]?.toLocaleString()}
                </div>
              </Col>
              <Col
                className='text-center shadow '
                style={{
                  padding: '20px',
                  backgroundColor: 'rgba(75, 192, 192)',
                  borderRadius: 20,
                  color: 'white',
                  fontSize: '20px',
                }}
              >
                Profit
                <div style={{ fontWeight: 'bold' }}>
                  Rp.
                  {Number(
                    newDataPayment[numberMonth()] -
                      dataExpenseReport[numberMonth()]
                  )?.toLocaleString()}
                </div>
              </Col>
            </Row>
            <Row
              className='shadow m-5 border border-3'
              style={{
                backgroundColor: 'white',
                borderRadius: 30,
              }}
            >
              <Col
                className='m-2'
                style={{
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
                  Income & Outcome
                </h2>
                <div className='d-flex justify-content-lg-center mb-3'>
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

                <Row style={{ padding: '20px' }}>
                  <Col className='text-center'>
                    <Bar data={dataGraph} />
                  </Col>
                </Row>
              </Col>
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
                  All Room Status
                </h2>
                <div
                  style={{
                    borderWidth: '10rem',
                    width: '50%',
                    padding: '5px',
                  }}
                >
                  <Doughnut data={dataPie} />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HomePage;
