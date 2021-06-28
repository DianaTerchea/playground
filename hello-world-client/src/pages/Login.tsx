import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {LOGIN_USER} from "../graphql/Mutations";
import {Button, Input, Typography} from "antd";
import { useHistory } from "react-router-dom";

const {Text, Title} = Typography;

function Login() {
    const history = useHistory();
    const [errors, setErrors] = useState({message: ""})
    const [formValues, setFormValues] = useState({email: "", password: ""})
    const {email, password} = formValues

    const [loginUser] = useMutation(LOGIN_USER, {
        update(proxy, result) {
            localStorage.setItem("token", result.data.login.token)
            localStorage.setItem("userEmail", result.data.login.user.email)
            history.push("/")
        },
        onError(err) {
            setErrors({message: "Invalid credentials!"})
        },
        variables: formValues
    })
    const onChange = (e: any) => {
        setFormValues({...formValues, [e.target.name]: e.target.value})
    }
    const onSubmit = (e: any) => {
        e.preventDefault()
        loginUser()
    }
    return (
        <>
            <Title level={2}>Login</Title>
            <Text type="danger">{errors.message}</Text>
            <Input type="email" name="email" placeholder="email" value={email} onChange={onChange}/>
            <Input type="password" name="password" placeholder="password" value={password} onChange={onChange}/>
            <Button type="primary" onClick={onSubmit}>Submit</Button>
        </>
    )
}

export default Login;