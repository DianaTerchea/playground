import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {REGISTER_USER} from "../graphql/Mutations";
import {Button, Input, Typography} from "antd";
import {useHistory} from "react-router-dom";
const { Text, Title } = Typography;

function Register() {
    const history = useHistory();
    const [formValues, setFormValues] = useState({name: "", email: "", password: ""})
    const [errors, setErrors] = useState({message: ""})
    const {email, name, password} = formValues
    const [addUser] = useMutation(REGISTER_USER, {
        update(proxy, result) {
            history.push("/login")
        },
        onError(err) {
            setErrors({message: "Invalid account details"})
        },
        variables: formValues
    })
    const onChange = (e: any) => {
        setFormValues({...formValues, [e.target.name]: e.target.value})
    }
    const onSubmit = (e: any) => {
        e.preventDefault()
        addUser()
    }
    return (
        <>
            <Title level={2}>Register</Title>
            <Text type="danger">{errors.message}</Text>
            <Input name="name" placeholder="name" value={name} onChange={onChange}/>
            <Input type="email" name="email" placeholder="email" value={email} onChange={onChange}/>
            <Input type="password" name="password" placeholder="password" value={password} onChange={onChange}/>
            <Button type="primary" onClick={onSubmit}>Submit</Button>
        </>
    )
}

export default Register;