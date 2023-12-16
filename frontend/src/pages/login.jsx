// Login.js
import React, { useContext } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { GlobalContext } from "../context/globalState";

const Login = () => {
  const { setToken, API_URL } = useContext(GlobalContext);
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is Required"),
    password: Yup.string().required("Password is Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: values.email,
        password: values.password,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        API_URL + "auth/login",
        requestOptions
      );
      const result = await response.json(); // Assuming the response is JSON

      // Do something with the result if needed
      console.log(result);
      if (result.message != 'Invalid Credentials!') {
        setToken(result.token);
        navigate("/dashboard");
      } else {
        alert(user.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={6}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <h2 className="mb-4">Login</h2>

                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    as={Form.Control}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    as={Form.Control}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
