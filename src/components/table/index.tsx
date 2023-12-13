import  { ChangeEvent, useEffect, useState, useCallback } from "react";
import styled, { css } from "styled-components";
import { format } from "date-fns";

interface Payout {
  id: number;
  dateAndTime: string;
  status: string;
  value: string;
  username: string;
}

interface TableDataProps {
  status?: string;
}

const TableContainer = styled.div`
  padding: 3% 5%;
`;

const TableTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const InputBox = styled.input`
  padding: 16px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 300px;
`;

const TableHeadingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ColorBox = styled.div`
  width: 16px;
  height: 32px;
  margin-right: 20px;
  border-radius: 4px;
  background-color: #999dff;
`;

const Text = styled.p`
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: -0.4px;
`;
const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const TableRow = styled.tr`
  height: 60px;
  padding: 24px;
  &:nth-child(even) {
    background-color: #fcfcfc;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: -0.12px;
  color: #6f767e;
`;

const TableData = styled.td`
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 171.429% */
  letter-spacing: -0.14px;
  color: ${(props) => props.color};
`;

const TableDataLabel = styled.div<TableDataProps>`
  ${(props) =>
    props.status &&
    css`
      display: inline-flex;
      padding: 8px;
      border-radius: 7px;
      background-color: ${props.status === "Pending"
        ? "rgba(111, 118, 126, 0.40)"
        : "#60CA57"};
    `}
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  margin: 0 5px;
  background-color: #999dff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #6f6fca;
  }
`;

const PaginationText = styled.span`
  font-size: 16px;
`;

const StyledTable = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [page, setPage] = useState<number>(1); 
  const [searchTerm, setSearchTerm] = useState<string>("");
  const limit = 10; 

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const fetchPayouts = useCallback(async () => {
    try {
      const response = await fetch(
        `https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      console.log(data.data);
      setPayouts(data.data);
    } catch (error) {
      console.error("Error fetching payouts:", error);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/search?query=${searchTerm}`
        );
        const data = await response.json();
        console.log(data);
        setPayouts(data); 
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (searchTerm.trim() !== "") {
      fetchSearchResults();
    } else {
      fetchPayouts();
    }
  }, [fetchPayouts, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEE, MMM d, yyyy, HH:mm");
  };
  return (
    <TableContainer>
      <TableTop>
        <TableHeadingContainer>
          <ColorBox />
          <Text>Payout History</Text>
        </TableHeadingContainer>
        <InputBox
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </TableTop>

      <Table>
        <thead>
          <TableRow>
            <TableHeader>Date & Time</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Value</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {payouts.map((payout, index) => (
            <TableRow key={index}>
              <TableData color="#6F767E">
                {formatDate(payout.dateAndTime)}
              </TableData>
              <TableData color="#000">
                <TableDataLabel status={payout.status}>
                  {payout.status}
                </TableDataLabel>
              </TableData>
              <TableData color="#000">{payout.value}</TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <PaginationContainer>
        <PaginationButton onClick={() => setPage(page > 1 ? page - 1 : 1)}>
          Back
        </PaginationButton>
        <PaginationText> {page}</PaginationText>
        <PaginationButton onClick={() => setPage(page + 1)}>
          Next
        </PaginationButton>
      </PaginationContainer>
    </TableContainer>
  );
};

export default StyledTable;
