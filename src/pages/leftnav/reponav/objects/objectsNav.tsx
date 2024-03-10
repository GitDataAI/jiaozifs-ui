import {   Form, Row } from "react-bootstrap"
import React from "react";
import { NavTree } from "./tree";


const RepositoryObjectsNav = () =>{
    
    return(
        <Row className="sidebar">
        <Form className='flex Fast-navb'>
        <NavTree></NavTree>  
        </Form>
        </Row>
    );
  }

  
export default RepositoryObjectsNav