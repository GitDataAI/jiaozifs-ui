import {   Form, Row } from "react-bootstrap"
import React from "react";
import { NavTree } from "./tree";


const Commitsnav = () =>{
    
   
    return(
        <Row className="sidebar">
        <Form className='flex Fast-navb'>
        <NavTree></NavTree>  
        </Form>
        </Row>
    );
  }

  
export default Commitsnav