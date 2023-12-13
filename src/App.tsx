import { Table } from "./components";
import styled from "styled-components";

const Container = styled.div`
  padding: 3% 5%;
`;

const Heading1 = styled.h1`
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 48px; /* 120% */
  letter-spacing: -0.8px;
`;

const App = () => {
  return (
    <Container>
      <Heading1>Payouts</Heading1>
      <Table />
    </Container>
  );
};

export default App;
