import {gql} from "@apollo/client";

export const ON_ADD_EMPLOYEE = gql`
subscription newEmployee($teamId: Int!){
    newEmployee(teamId: $teamId){
      id
      name
      age
      role
    }
  }
`; 

export const ON_DELETE_EMPLOYEE = gql`
subscription deleteEmployee($teamId: Int!){
    deleteEmployee(teamId: $teamId){
      id
      name
      age
      role
    }
  }
`; 