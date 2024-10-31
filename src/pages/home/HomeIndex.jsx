import React from "react";
import { Link } from "react-router-dom";

const HomeIndex = () => {
  return (
    <div className="container-fluid bg-transparent text-center py-5">
      <div
        className="row justify-content-center align-items-center"
        style={{ height: "76.7vh" }}
      >
        <div className="col-md-8">
          <h1 className="display-4 fw-bold">
            A better online daily used app for work
          </h1>
          <p className="lead">
            EcoNest makes it easier for everyone to plan their work.
          </p>
          <Link to="/notes" className="btn btn-dark btn-lg">
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeIndex;
