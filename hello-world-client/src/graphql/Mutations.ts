import {gql} from "@apollo/client";

export const REGISTER_USER = gql`
mutation RegisterMutation($name: String, $email: String!, $password: String!){
    register(name: $name, email: $email, password:$password){
        token
        user{
            email
        }
    }  
}
`;

export const LOGIN_USER = gql`
mutation LoginMutation($email: String!, $password: String!){
    login(email: $email, password:$password){
        token
        user{
            email
        }
    }  
}
`;

export const CREATE_EMPLOYEE = gql`
mutation createEmployee($name: String!, $age: Int!, $role: Roles!, $teamId: Int!) {
  addEmployee(data:{name: $name, role: $role, age: $age, teamId: $teamId}){
    name
    age
    role
    id
  }
}
`;

export const REMOVE_EMPLOYEE = gql`
mutation removeEmployee($id: Int!) {
  deleteEmployee(id: $id){
    name
    age
    role
    id
  }
}
`;