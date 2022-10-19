import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";

const Profile = () => {
  let history = useHistory();

  useEffect(() => {
    document.title = "Profile";
  }, []);

  const handleClickBtn = () => {
    history.push("/");
  };
  return (
    <>
      {/* <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle
            title="User Profile"
            subtitle="Overview"
            md="12"
            className="ml-sm-auto mr-sm-auto"
          />
        </Row>
        <Row>
          <Col lg="4">
            <UserDetails />
          </Col>
          <Col lg="8">
            <UserAccountDetails />
          </Col>
        </Row>
      </Container> */}
    </>
  );
};
export default Profile;
