import React from "react";
import {useQuery} from "@apollo/client";
import {GET_COMPANIES} from "../graphql/Queries";
import {Card} from "antd";
import {Link} from "react-router-dom";
import styled from "styled-components";

const PageWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

const CompanyListWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

function Home() {
    const { data} = useQuery(GET_COMPANIES)
    // @ts-ignore
    return (
        <PageWrapper>
            <h1>Companies</h1>
            <CompanyListWrapper>
                {data?.getAllCompanies.length > 0 && data?.getAllCompanies.map((company: any) =>
                    <Card title={company.name} style={{width: 300}} extra={<Link to={`/company/${company.id}`}>More</Link>}>
                       <p>Little description</p>
                    </Card>
                )}
            </CompanyListWrapper>
        </PageWrapper>
    )
}

export default Home;