import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import Issues from "./Issues.js";

function App() {
  let [key, setKey] = useState("home");
  let [openIssue, setOpenIssue] = useState(0);
  let [filterData, setFilterData] = useState([]);
  let [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getRepo();
  }, [key]);

  useEffect(() => {
    getIssues();
  }, [openIssue]);

  const getIssues = () => {
    fetch(
      "https://api.github.com/search/issues?per_page=10&q=repo:angular/angular/node+type:issue+state:open+" +
        searchValue
    )
      .then(res => res.json())
      .then(
        result => {
          setFilterData(result["items"]);
          setOpenIssue(result["total_count"]);
        },
        error => {
          setFilterData([]);
        }
      );
  };

  const getRepo = () => {
    fetch("https://api.github.com/repos/angular/angular")
      .then(res => res.json())
      .then(
        result => {
          setOpenIssue(result["open_issues_count"]);
        },
        error => {
          console.log(error);
        }
      );
  };

  const search = event => {
    setSearchValue(event.target.value);
  };

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      getIssues();
    }
  };

  return (
    <div className="container">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={k => setKey(k)}
      >
        <Tab eventKey="home" title="Issues">
          <input
            className="inputBox"
            placeholder="search..."
            autoComplete="off"
            onChange={search}
            value={searchValue}
            onKeyPress={handleKeyPress}
          />
          <Router>
            <ul className="repoList">
              {filterData.map(data => (
                <li className="repoContent" key={data.id}>
                  <div style={{ paddingBottom: "10px" }}>
                    <div>
                      {data.title}
                      <Route path="/issues" component={Issues} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Router>
          <div className="pagination">
            <Pagination size="sm">
              <Pagination.First />
              <Pagination.Prev />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Ellipsis />
              <Pagination.Item>{parseInt(openIssue / 10, 10)}</Pagination.Item>
              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
