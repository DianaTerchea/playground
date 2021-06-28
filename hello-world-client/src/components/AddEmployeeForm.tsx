import React, {useState} from "react";
import {Button, Input} from "antd";
import styled from "styled-components";
import {useMutation} from "@apollo/client";
import {CREATE_EMPLOYEE} from "../graphql/Mutations";
const FormWrapper = styled.div`
  width: 300px;
  > * {
    margin-bottom: 10px;
  }
`;
// @ts-ignore
function AddEmployeeForm({teamId, setAddFormInvisible}) {
    const [formValues, setFormValues] = useState({name: "", age: "", role: ""})
    const {name, age, role} = formValues

    const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
        update(proxy, {data}) {
            // const getExistingTeamEmployees: any = proxy.readQuery({query: GET_TEAM_MEMBERS, variables: {id: teamId}})
            // const existingTeamEmployees = getExistingTeamEmployees ? getExistingTeamEmployees.getTeamMembers : []
            // const newEmployee = data.addEmployee
            // proxy.writeQuery({query: GET_TEAM_MEMBERS,variables: {id: teamId}, data: {getTeamMembers: [...existingTeamEmployees, newEmployee]}})
            setAddFormInvisible(false)
        },
        variables: {
            name: name,
            age: parseInt(age),
            role: role,
            teamId: teamId
        }
    })

    const onChange = (e: any) => {
        setFormValues({...formValues, [e.target.name]: e.target.value})
    }
    const onSubmit = (e: any) => {
        e.preventDefault()
        createEmployee()
    }
    return (
        <FormWrapper>
            <Input name="name" placeholder="name" value={name} onChange={onChange}/>
            <Input name="age" placeholder="age" value={age} onChange={onChange}/>
            <Input name="role" placeholder="role" value={role} onChange={onChange}/>
            <Button type="primary" onClick={onSubmit}>Submit</Button>
        </FormWrapper>
    )
}

export default AddEmployeeForm;