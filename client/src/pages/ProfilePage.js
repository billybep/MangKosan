import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProperties,
  fetchRoom,
  editPropertyData,
} from '../store/actions/actions';
import Sidebar from './components/Sidebar';
import styles from './styling/profileProperty.module.css';
import Swal from 'sweetalert2';

import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Table,
  Modal,
  Form,
} from 'react-bootstrap';

function ProfilePage() {
  const [property, setProperty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState('');
  const [phone, setPhone] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  const propertiesData = useSelector((state) => state.property.properties);
  const roomData = useSelector((state) => state.room.rooms);

  console.log(propertiesData, '<<<<<<');

  useEffect(() => {
    setLoading(true);
    dispatch(fetchProperties(loading, setLoading, property, setProperty));
    // setProperty(propertiesData);
    setName(propertiesData[0]?.name);
    setFullName(propertiesData[0]?.fullName);
    setAddress(propertiesData[0]?.address);
    setImage(propertiesData[0]?.image);
    setPhone(propertiesData[0]?.phone);
  }, []);

  useEffect(() => {
    dispatch(fetchRoom());
  }, []);

  function handleSubmitButton() {
    const newData = {
      id: property[0].id,
      name,
      address,
      image,
      phone,
    };
    console.log(newData);
    dispatch(
      editPropertyData(newData, loading, setLoading, property, setProperty)
    );
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
      title: 'Updated Successfully',
    });
  }
  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={2}>
            <Sidebar />
          </Col>
          {loading ? (
            <Col
              xs={10}
              style={{ padding: '20px' }}
              className='align-self-center'
            >
              <Row className='justify-content-md-center align-content-center mb-2'>
                <h1>Loading..</h1>
              </Row>
            </Col>
          ) : (
            <Col xs={10} style={{ padding: '20px' }}>
              <Row
                className='justify-content-md-center mb-2'
                // style={{ padding: '20px' }}
              >
                <h1
                  style={{
                    fontWeight: 'bold',
                    fontSize: '50px',
                    color: '#343F56',
                  }}
                >
                  Property Profile
                </h1>
              </Row>
              <div style={{ padding: '20px' }}>
                <Row
                  className='mb-4 mt-2 shadow'
                  style={{
                    padding: '20px',
                    backgroundColor: '#f54748',
                    // borderTopRightRadius: '30px',
                    // borderBottomLeftRadius: '30px',
                    borderRadius: '30px',
                  }}
                >
                  <Col>
                    <h3 className='text-center' style={{ color: 'white' }}>
                      {property[0]?.name}
                    </h3>
                  </Col>
                </Row>
                <Row
                  className='shadow'
                  style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: 30,
                  }}
                >
                  <Col
                    style={{
                      padding: '20px',
                    }}
                  >
                    <div className='text-center shadow mt-3'>
                      <Image
                        src={property[0]?.image}
                        className='rounded'
                        alt='Kamar Kosan'
                        style={{ width: '100%' }}
                        rounded
                      />
                    </div>
                  </Col>
                  <Col
                    className='align-items-center justify-content-center'
                    style={{
                      padding: '20px',
                    }}
                  >
                    <Table bordered hover>
                      <tbody>
                        <tr>
                          <td>Name Owner:</td>
                          <td>{property[0]?.fullname}</td>
                        </tr>
                      </tbody>
                      <tbody>
                        <tr>
                          <td className={styles.column}>Address:</td>
                          <td>{property[0]?.address}</td>
                        </tr>
                      </tbody>
                      <tbody>
                        <tr>
                          <td>Phone Number:</td>
                          <td>{property[0]?.phone}</td>
                        </tr>
                      </tbody>
                      <tbody>
                        <tr>
                          <td>Email:</td>
                          <td>{property[0]?.email}</td>
                        </tr>
                      </tbody>
                      <tbody>
                        <tr>
                          <td>Quantity Room:</td>
                          <td>{roomData.length} Room</td>
                        </tr>
                      </tbody>
                    </Table>
                    <Button
                      variant='info'
                      className='mr-5'
                      onClick={handleShow}
                    >
                      Edit data
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          )}
        </Row>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Properties</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className='mb-3'>
                <Form.Label>Name Property:</Form.Label>
                <Form.Control
                  type='text'
                  defaultValue={property[0]?.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Address:</Form.Label>
                <Form.Control
                  type='text'
                  defaultValue={property[0]?.address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Image:</Form.Label>
                <Form.Control
                  type='text'
                  defaultValue={property[0]?.image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Phone:</Form.Label>
                <Form.Control
                  type='text'
                  defaultValue={property[0]?.phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button
              variant='primary'
              onClick={(event) => {
                handleSubmitButton(event);
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default ProfilePage;
