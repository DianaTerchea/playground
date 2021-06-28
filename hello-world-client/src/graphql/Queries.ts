import {gql} from "@apollo/client";

export const GET_COMPANIES = gql`
{
getAllCompanies{
    id
    name
    teams {
      name
      members{
        name
        role
      }
    }
  }
}
`;

export const GET_COMPANY_BY_ID = gql`
query getCompanyById($id: Int!){
    getCompanyById(id: $id){
        name
        teams {
            name
            id
        }
    }
}
`;

export const GET_TEAM_MEMBERS = gql`
query getTeamMembers($id: Int!){
     getTeamMembers(id: $id){
        name
        age
        role
        id
     }
}
`;
