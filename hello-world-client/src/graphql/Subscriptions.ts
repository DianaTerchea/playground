import {gql} from "@apollo/client";

export const ON_ADD_EMPLOYEE = gql`
subscription newEmployee{
    newEmployee{
      id
      name
      age
      role
    }
  }
`; 

export const ON_DELETE_EMPLOYEE = gql`
subscription deleteEmployee{
    deleteEmployee{
      id
      name
      age
      role
    }
  }
`; 