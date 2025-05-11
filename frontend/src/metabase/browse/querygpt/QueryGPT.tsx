import { Button, Icon, Input, Loader } from "metabase/ui";
import { Table } from "@mantine/core";
import { t } from "ttag";
import React, { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { AppBarCenterContainer } from "../../nav/components/AppBar/AppBarLarge.styled";
import { useState, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-sql";

interface QueryGPTResponse {
  sql_query: string;
  results: any[];
}

const INIT = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

export const QueryGPT = () => {
  const [query, setQuery] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  // const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);

  const [sampleData, setData] = useState(INIT);

  const headers = useMemo(() => {
    const object = Object.keys(sampleData?.[0] || {});
    return object.map((h) => h.charAt(0).toUpperCase() + h.slice(1));
  }, [sampleData]);

  const queryPlainText = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data: QueryGPTResponse = await response.json();
      // alert(JSON.stringify(data));
      if (!response.ok) {
        console.error("server error:", data);
      }
      console.log("debugging", { data });
      setData(data?.results || []);

      setSqlQuery(data.sql_query);
      setLoading(false);
    } catch (error) {
      alert("Something went wrong");
      console.error("Error querying GPT:", error);
    } finally {
      setLoading(false);
      setQuery("");
    }
  }, [
    query,
    setLoading,
    setSqlQuery,
    setData,
    // setResults,
    // setQuery,
    // setHeaders,
    // setObject,
    // setSampleData,
    // setHeaders,
  ]);

  // const queryGPT = useCallback(async () => {
  //     setLoading(true);
  //     try {
  //         const response = await fetch("http://localhost:8081/query", {
  //             method: "POST",
  //             headers: {
  //                 "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ query }),
  //         });
  //         const data: QueryGPTResponse = await response.json();
  //         if (!response.ok) {
  //             console.error("server error:", data);
  //         } else {
  //             console.log(data.sql_query);
  //             setSqlQuery(data.sql_query);
  //             // setResults(data.results);
  //         }
  //     } catch (error) {
  //         console.error("Error querying GPT:", error);
  //     } finally {
  //         setLoading(false);
  //         setQuery("")
  //     }
  // }, [query]);

  useEffect(() => {
    Prism.highlightAll();
  }, [
    sqlQuery,
    // results,
    // query,
    // setLoading,
    // setSqlQuery,
    // setResults,
    // setQuery,
    // setHeaders,
    // setObject,
    // setSampleData,
    // setHeaders,
  ]);

  return (
    <FullScreenDiv>
      <TopSkeletonDiv>
        {loading ? <Loader size="m" /> : <></>}

        {sqlQuery.length > 0 ? (
          <TopAnswerDiv>
            <div>
              <pre>
                <code className="language-sql">{sqlQuery}</code>
              </pre>
            </div>
            {/* <TextContainer>
                            some text
                        </TextContainer> */}
            <div>
              <Table
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
                style={{ marginTop: "1rem" }}
              >
                <Table.Thead>
                  <Table.Tr>
                    {headers.map((header) => (
                      <Table.Th key={header}>{header}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <TableData myData={sampleData} />
                </Table.Tbody>
              </Table>
            </div>
          </TopAnswerDiv>
        ) : (
          <></>
        )}
      </TopSkeletonDiv>
      <BottomBar>
        <AppBarCenterContainer>
          <Input
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder={t`Ask anything about your data`}
            style={{
              icon: {
                alignItems: "center",
                justifyContent: "center",
                // this creates padding on the left of the icon itself:
                paddingLeft: 12,
                width: 32 + 12, // original icon slot width + padding
              },
              height: "36px",
              width: "80%",
              padding: "0 0.75rem",
            }}
            leftSection={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "1.25rem", // ← here’s your extra padding
                  paddingTop: "0.35rem", // ← here’s your extra padding
                  height: "100%", // make it fill the input height
                }}
              >
                <Icon name="search" />
              </div>
            }
          />
          <Button
            type="submit"
            variant="filled"
            disabled={false}
            onClick={queryPlainText}
          >
            {t`Query`}
          </Button>
        </AppBarCenterContainer>
      </BottomBar>
    </FullScreenDiv>
  );
};

export const BottomBar = styled.div`
  display: flex;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  flex: 1 1 auto;
  align-items: center;
  gap: 1rem;
  height: 20%;
  justify-content: center;
  bottom: 0;
`;

export const TopAnswerDiv = styled.div`
  display: flex;
  flex-direction: column; /* Stack content vertically */
  align-items: flex-start;
  justify-content: flex-start;
  height: 80%; /* Height relative to parent */
  max-height: 80%; /* Prevent exceeding this height */
  width: 85%;
  border-radius: 40px 40px 0 0;
  padding: 2rem;
  background: rgba(245, 246, 245, 0.88);
  overflow-y: auto; /* Enable vertical scrolling */
  text-align: left;

  pre {
    margin: 0;
    width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
  }

  code {
    display: block;
    text-align: left;
  }
`;

export const TextContainer = styled.div`
  margin-top: 1rem; /* Add spacing between <pre> and <div> */
`;

export const TopSkeletonDiv = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: flex-end;
  gap: 1rem;
  height: 80%;
  width: 100%;
  justify-content: center;
  background: white;
  z-index: 1000;
`;

export const FullScreenDiv = styled.div`
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const TableData: React.FC<{
  myData: any[];
}> = ({ myData }) => {
  const headers = Object.keys(myData[0] || {});
  return myData.map((row, index) => (
    <Table.Tr key={index}>
      {headers.map((header) => (
        <Table.Td key={header}>{row[header]}</Table.Td>
      ))}
    </Table.Tr>
  ));
};
