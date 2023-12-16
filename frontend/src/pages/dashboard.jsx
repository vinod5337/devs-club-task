import React, { useState, useEffect, useContext } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Container,
    Row,
    Col,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GlobalContext } from "../context/globalState";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { token, API_URL } = useContext(GlobalContext);
    const router = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [items, setItems] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        _id: null,
        name: "",
        price: "",
        quantity: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        if (!token) {
            router('/');
        }
    });

    const handleDashboardData = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);

        const raw = JSON.stringify({
            startDate: startDate,
            endDate: endDate,
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        const response = await fetch(
            API_URL + "items/list",
            requestOptions
        );
        const result = await response.json(); // Assuming the response is JSON

        // Do something with the result if needed
        setItems(result);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setNewItem({ _id: null, name: "", price: "", quantity: "" });
        setIsEditing(false);
    };

    const handleAddItem = (values) => {
        if (isEditing) {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + token);

            let raw = JSON.stringify({
                "name": values.name,
                "price": values.price,
                "quantity": values.quantity
            });

            let requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(`${API_URL}items/update/${values._id}`, requestOptions)
                .then(response => response.json())
                .then(result => handleDashboardData())
        } else {
            // Add a new item
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + token);

            let raw = JSON.stringify({
                "name": values.name,
                "price": values.price,
                "quantity": values.quantity
            });

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(API_URL + "items/add", requestOptions)
                .then(response => response.json())
                .then(result => handleDashboardData())
        }
        handleCloseModal();
    };

    const handleEditItem = (item) => {
        setShowModal(true);
        setNewItem(item);
        setIsEditing(true);
    };

    const handleDeleteItem = (_id) => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${API_URL}items/delete/${_id}`, requestOptions)
            .then(response => response.json())
            .then(result => handleDashboardData())
    };

    useEffect(() => {
        handleDashboardData();
    }, [startDate, endDate]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Item Name is required"),
        price: Yup.number()
            .typeError("Price must be a number")
            .positive("Price must be positive")
            .required("Price is required"),
        quantity: Yup.number()
            .typeError("Quantity must be a number")
            .positive("Quantity must be positive")
            .required("Quantity is required"),
    });

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col md={6} className="mb-3 mb-md-0">
                    <label className="me-2">Start Date:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Select Start Date"
                        className="form-control"
                    />
                </Col>
                <Col md={6}>
                    <label className="me-2">End Date:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Select End Date"
                        className="form-control"
                    />
                </Col>
            </Row>

            <Button letiant="primary" onClick={() => setShowModal(true)}>
                Add Item
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 && items?.map((item) => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <Button
                                    letiant="info"
                                    className="me-2"
                                    onClick={() => handleEditItem(item)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    letiant="danger"
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteItem(item._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Formik
                    initialValues={{
                        _id: newItem._id || null,
                        name: newItem.name || "",
                        price: newItem.price || "",
                        quantity: newItem.quantity || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleAddItem(values);
                        setSubmitting(false);
                    }}
                >
                    {({ handleSubmit, handleChange, values, errors, touched }) => (
                        <Form onSubmit={handleSubmit}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {isEditing ? "Edit Item" : "Add New Item"}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="name">
                                    <Form.Label>Item Name</Form.Label>
                                    <Field
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        className={`form-control ${touched.name && errors.name ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </Form.Group>
                                <Form.Group controlId="price">
                                    <Form.Label>Price</Form.Label>
                                    <Field
                                        type="number"
                                        name="price"
                                        value={values.price}
                                        onChange={handleChange}
                                        className={`form-control ${touched.price && errors.price ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        name="price"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </Form.Group>
                                <Form.Group controlId="quantity">
                                    <Form.Label>Quantity</Form.Label>
                                    <Field
                                        type="number"
                                        name="quantity"
                                        value={values.quantity}
                                        onChange={handleChange}
                                        className={`form-control ${touched.quantity && errors.quantity ? "is-invalid" : ""
                                            }`}
                                    />
                                    <ErrorMessage
                                        name="quantity"
                                        component="div"
                                        className="invalid-feedback"
                                    />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button letiant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                                <Button letiant="primary" type="submit">
                                    {isEditing ? "Save Changes" : "Add"}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </Container>
    );
};

export default Dashboard;
