import { rule, shield } from 'graphql-shield'
import {decodeToken} from "../utils";
import {Context} from "../context";

const rules = {
    isAuthenticatedUser: rule()((_parent, _args, context: Context) => {
        const userId = decodeToken(context)
        return Boolean(userId)
    })
}

export const permissions = shield({
    Query: {
        getAllEmployees: rules.isAuthenticatedUser,
        getTeams: rules.isAuthenticatedUser,
        getCompanyTeams: rules.isAuthenticatedUser,
        getAllCompanies: rules.isAuthenticatedUser,
        getEmployeeById: rules.isAuthenticatedUser,
        getTeamMembers: rules.isAuthenticatedUser,
    },
    Mutation: {
        addEmployee: rules.isAuthenticatedUser,
        addCompany: rules.isAuthenticatedUser,
        addTeam: rules.isAuthenticatedUser,
        changeEmployeeRole: rules.isAuthenticatedUser,
        deleteEmployee: rules.isAuthenticatedUser
    }
})