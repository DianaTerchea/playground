// create Queries, mutations, subscriptions
import {
    makeSchema,
    objectType,
    list,
    scalarType, arg, nonNull, inputObjectType, stringArg, intArg, enumType, subscriptionField, subscriptionType,
} from 'nexus'
import {Context} from "./context";
import {Kind} from "graphql";
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import {APP_SECRET} from "./utils";
import { applyMiddleware } from 'graphql-middleware'
import {permissions} from "./permissions";
import {emitter} from "./sockets";

const DateScalar = scalarType({
    name: 'Date',
    asNexusMethod: 'date',
    description: 'Date custom scalar type',
    parseValue(value) {
        return new Date(value)
    },
    serialize(value) {
        return value.getTime()
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(ast.value)
        }
        return null
    },
})

const Query = objectType({
    name: 'Query',
    definition(t) {
        t.field("getAllEmployees", {
            type: list('Employee'),
            resolve: (_parent, _args, context: Context) => {
                return context.prisma.employee.findMany()
            }
        })
        t.field("getTeams", {
            type: list('Team'),
            resolve: (_parent, _args, context: Context) => {
                return context.prisma.team.findMany()
            }
        })
        t.field("getTeamMembers", {
            type: list('Employee'),
            args: {
                id: nonNull(intArg())
            },
            resolve: (parent, args, context) => {
                return context.prisma.team.findUnique({where: {id: args.id || undefined}}).members()
            }
        })
        t.field("getCompanyTeams", {
            type: list('Team'),
            args: {
                companyId: nonNull(intArg())
            },
            resolve: (_parent, _args, context: Context) => {
                return context.prisma.company.findUnique({where: {id: _args.companyId || undefined}}).teams()
            }
        })
        t.field("getAllCompanies", {
            type: list('Company'),
            resolve: (_parent, _args, context: Context) => {
                return context.prisma.company.findMany()
            }
        })
        t.field("getEmployeeById", {
            type: 'Employee',
            args: {
                id: nonNull(intArg())
            },
            resolve: (parent, args, context) => {
                return context.prisma.employee
                    .findUnique({where: {id: args.id || undefined}})
            }
        })
        t.field("getCompanyById", {
            type: 'Company',
            args: {
                id: nonNull(intArg())
            },
            resolve: (parent, args, context) => {
                return context.prisma.company
                    .findUnique({where: {id: args.id || undefined}})
            }
        })
    }
})

const Mutation = objectType({
    name: 'Mutation',
    definition(t) {
        t.field('register', {
            type: AuthPayload,
            args: {
                name: stringArg(),
                email: nonNull(stringArg()),
                password: nonNull(stringArg())
            },
            resolve: async (parent, args, context) => {
                const hashedPassword = await hash(args.password, 10)
                const admin = await context.prisma.admin.create({
                    data: {
                        name: args.name,
                        email: args.email,
                        password: hashedPassword
                    }
                })
                return{
                    token: sign({adminId: admin.id}, APP_SECRET),
                    user: admin
                }
            }
        })
        t.field('login', {
            type: AuthPayload,
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg())
            },
            resolve: async (parent, args, context) => {
                const admin = await context.prisma.admin.findUnique({where: {email: args.email}})
                if(!admin) {
                    throw new Error(`No admin with this found for email: ${args.email}`)
                }
                const isPasswordValid = await compare(args.password, admin.password)
                if(!isPasswordValid){
                    throw new Error(`Wrong password`)
                }
                return{
                    token: sign({adminId: admin.id}, APP_SECRET),
                    user: admin
                }
            }
        })
        t.nonNull.field('addEmployee', {
            type: 'Employee',
            args: {
                data: nonNull(
                    arg({
                        type: 'EmployeeCreateInput',
                    }),
                ),
            },
            resolve: async (_, args, context) => {
                const employee = await context.prisma.employee.create({
                    data: {
                        age: args.data.age,
                        name: args.data.name,
                        role: args.data.role,
                        team: {
                            connect: {
                                id: args.data.teamId || undefined
                            }
                        }
                    }
                })
                const employees = await context.prisma.team.findUnique({where: {id: args.data.teamId}}).members()
                emitter.publish("NEW_EMPLOYEE", employees)
                return employee
            }
        })
        t.field('addCompany', {
            type: 'Company',
            args: {
                name: nonNull(stringArg())
            },
            resolve: async (_, args, context) => {
                return context.prisma.company.create({
                    data: {
                        name: args.name,
                    }
                })
            }
        })
        t.field('addTeam', {
            type: 'Team',
            args: {
                name: nonNull(stringArg()),
                companyId: nonNull(intArg())
            },
            resolve: async (parent, args, context) => {
                const team = await context.prisma.team.create({
                    data: {
                        name: args.name,
                        company: {
                            connect: {
                                id: args.companyId || undefined
                            }
                        }
                    }
                })
                return team
            }
        })
        t.field('changeEmployeeRole', {
            type: 'Employee',
            args: {
                id: nonNull(intArg()),
                newRole: nonNull(Roles)
            },
            resolve: async (parent, args, context) => {
                return context.prisma.employee.update({where: {id: args.id || undefined }, data: {role: args.newRole}} )
            }
        })
        t.field('deleteEmployee', {
            type: 'Employee',
            args: {
                id: nonNull(intArg()),
            },
            resolve: async (_, args, context: Context) => {
                const employee = await context.prisma.employee.delete({
                    where: {id: args.id},
                })
                const employeeList = await context.prisma.team.findMany({where: {id: employee.teamId}}).members()
                emitter.publish("DELETE_EMPLOYEE", employeeList)
            },
        })
    }
})

const Employee = objectType({
    name: 'Employee',
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('name')
        t.nonNull.field('createdAt', {type: DateScalar})
        t.nonNull.field('updatedAt', {type: DateScalar})
        t.nonNull.int('age')
        t.nonNull.string('role')
        t.field('team', {
            type: 'Team',
            resolve: (parent, _, context: Context) => {
                return context.prisma.employee
                    .findUnique({where: {id: parent.id || undefined}})
                    .team()
            }
        })
    }
})

const Team = objectType({
    name: 'Team',
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('name')
        t.nonNull.list.nonNull.field('members', {
            type: 'Employee',
            resolve: (parent, _args, context) => {
                return context.prisma.team
                    .findUnique({where: {id: parent.id || undefined}})
                    .members()
            }
        })
    }
})

const Company = objectType({
    name: 'Company',
    definition(t){
        t.nonNull.int('id')
        t.nonNull.string('name')
        t.nonNull.list.nonNull.field('teams', {
            type: 'Team',
            resolve: (parent, _args, context: Context) => {
                return context.prisma.company
                    .findUnique({where: {id: parent.id || undefined}})
                    .teams()
            }
        })
    }
})

const Admin = objectType({
    name: 'Admin',
    definition(t) {
        t.nonNull.int('id')
        t.string('name')
        t.nonNull.string('email')
    }
})

const Roles = enumType({
    name: 'Roles',
    members: ["developer", "tester", "manager"]
})

const EmployeeCreateInput = inputObjectType({
    name: 'EmployeeCreateInput',
    definition(t) {
        t.nonNull.string('name')
        t.nonNull.field('role', {type: Roles})
        t.nonNull.int('age')
        t.nonNull.int('teamId')
    }
})


const AuthPayload = objectType({
    name: 'AuthPayload',
    definition(t) {
        t.string('token')
        t.field('user', { type: 'Admin' })
    },
})

const Subscription = subscriptionType({
    definition(t) {
        t.field("newEmployee", {
            type: list('Employee'),
            resolve(data){
                return data
            },
            subscribe: () => {
                return emitter.asyncIterator("NEW_EMPLOYEE")
            }
        })
        t.field("deleteEmployee", {
            type: list('Employee'),
            resolve(data){
                return data
            },
            subscribe: () => {
                return emitter.asyncIterator("DELETE_EMPLOYEE")
            }
        })
    }
})

const schema = makeSchema({
    types: [
        Query,
        Mutation,
        Employee,
        Team,
        Company,
        Admin,
        AuthPayload,
        EmployeeCreateInput,
        Roles,
        Subscription
    ],
    outputs: {
        schema: __dirname + '/../schema.graphql',
        typegen: __dirname + '/generated/nexus.ts',
    },
    contextType: {
        module: require.resolve('./context'),
        export: 'Context',
    },
    sourceTypes: {
        modules: [
            {
                module: '@prisma/client',
                alias: 'prisma',
            },
        ],
    },
})

export const securedSchema = applyMiddleware(schema, permissions)