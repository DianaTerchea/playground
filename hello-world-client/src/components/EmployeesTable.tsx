import React, {useState} from "react";
import {useMutation, useQuery, useSubscription} from "@apollo/client";
import {GET_TEAM_MEMBERS} from "../graphql/Queries";
import {Button, Space, Table} from "antd";
import AddEmployeeForm from "./AddEmployeeForm";
import {REMOVE_EMPLOYEE} from "../graphql/Mutations";
import { ON_ADD_EMPLOYEE, ON_DELETE_EMPLOYEE } from "../graphql/Subscriptions";

// @ts-ignore
function EmployeesTable({teamId}) {
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const {data} = useQuery(GET_TEAM_MEMBERS, {
        variables: {id: parseInt(teamId)},
        fetchPolicy: "network-first" as any
    },)
    const [deleteEmployee] = useMutation(REMOVE_EMPLOYEE, {
            /*CACHE VERSION */
            // update(cache, {data}) {
            //     const existingTeamEmployees: any = cache.readQuery({query: GET_TEAM_MEMBERS, variables: {id: teamId}});
            //     const newTeamEmployees = existingTeamEmployees!.getTeamMembers.filter((e: any) => (e.id !== data.deleteEmployee.id));
            //     cache.writeQuery({
            //         query: GET_TEAM_MEMBERS,
            //         data: {getTeamMembers: newTeamEmployees},
            //         variables: {id: teamId}
            //     });
            // }
        }
    )
    useSubscription(ON_ADD_EMPLOYEE)
    useSubscription(ON_DELETE_EMPLOYEE)
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        }, {
            title: "Age",
            dataIndex: "age",
            key: "age"
        }, {
            title: "Role",
            dataIndex: "role",
            key: "role"
        }, {
            title: 'Actions',
            key: 'actions',
            render(text: any, record: any) {
                return <Space size="middle">
                    <Button onClick={() => deleteEmployee({variables: {id: record.id}})}>Delete</Button>
                </Space>;

            },
        },]
    // @ts-ignore
    return (
        <div>
            {isAddFormVisible ? (<AddEmployeeForm teamId={teamId} setAddFormInvisible={setIsAddFormVisible}/>) :
                <Button onClick={() => setIsAddFormVisible(true)} type="primary" style={{marginBottom: 16}}>
                    Add member
                </Button>}
            <Table columns={columns} dataSource={data?.getTeamMembers.map((member: any) => {
                return {
                    id: member.id,
                    name: member.name,
                    age: member.age,
                    role: member.role,
                    key: member.id
                }
            })}/>
        </div>
    )
}

export default EmployeesTable;