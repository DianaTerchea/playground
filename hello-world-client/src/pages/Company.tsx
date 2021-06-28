import React from "react";
import {useQuery} from "@apollo/client";
import { GET_COMPANY_BY_ID} from "../graphql/Queries";
import { useParams} from "react-router-dom";
import styled from "styled-components";
import {Typography} from "antd";
import EmployeesTable from "../components/EmployeesTable";
const { Title } = Typography;

const PageWrapper = styled.div`
  width: 100%;
  padding: 20px;
`
function Company() {
    const { id } = useParams<{ id: string }>();
    const { data} = useQuery(GET_COMPANY_BY_ID, {variables: {id: parseInt(id)}})

    // @ts-ignore
    return (
        <PageWrapper>
            <h1>Company Name: {data?.getCompanyById?.name}</h1>
                {data?.getCompanyById?.teams.length > 0 && data?.getCompanyById?.teams.map((team: any) =>
                    <div key={team.id}>
                        <Title level={3} type="danger">{team.name}</Title>
                        <Title level={4}>Members</Title>
                        <EmployeesTable teamId={team.id}/>
                    </div>
                )}
        </PageWrapper>
    )
}

export default Company;