import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Banner from "./Banner";
import NavBar from "./navbar/NavBar";
const GET_LOGOS_BY_USER = gql`
  query logosByUser($owner: String!) {
    logosByUser(owner: $owner) {
      title
      owner
      items {
        type
        text
        color
        fontSize
        url
        imgWidth
        imgHeight
        alt
        id
        z
        x
        y
      }
      backgroundColor
      borderRadius
      borderThickness
      borderColor
      height
      width
      margin
      padding
      lastUpdate
      _id
    }
  }
`;

class HomeScreen extends Component {
  componentWillUnmount() {
    window.location.reload(true);
  }

  render() {
    let temp_token = window.localStorage.getItem("token");
    temp_token = temp_token.substring(1, temp_token.length - 1);
    return (
      <Query
        context={{
          headers: {
            authorization: temp_token,
          },
        }}
        query={GET_LOGOS_BY_USER}
        variables={{ owner: this.props.match.params.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          return (
            <div className="container">
              <div className="row">
                <NavBar />
                <div className="col s4 bg-secondary text-white">
                  <h3>Recent Work</h3>
                  {data.logosByUser.map((logo, index) => (
                    <div
                      key={index}
                      className="bg-danger text-white"
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        whiteSpace: "pre",
                      }}
                    >
                      <Link className=" text-white" to={`/view/${logo._id}`}>
                        {logo.title === "" ? "unnamed logo" : logo.title}
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="col s8">
                  <Banner />

                  <div>
                    <Link
                      className="btn btn-primary col"
                      id="add_logo_button"
                      to="/create"
                    >
                      Add Logo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default HomeScreen;
