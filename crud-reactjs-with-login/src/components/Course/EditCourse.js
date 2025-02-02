import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
import "./User.css";
const EditCourse = () => {
  const [course, setCourse] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const getCourseApi = "http://localhost:7089/course/current";
  const updateUserApi = "http://localhost:7089/course/update-course";

  useEffect(() => {
    getCourse();
  }, []);

  const getCourse = () => {
    axios
      .get(getCourseApi.concat("?id=") + id)
      .then((item) => {
        const api = item.data.result[0]
        let courseData = {
          id: api.id,
          course: api.course,
          mentor: api.mentor,
          title: api.title
        }
        setCourse(courseData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handelInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    // console.log(name, value);
    setCourse({ ...course, [name]: value });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    console.log(course)
    fetch(updateUserApi, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(true);
        navigate("/show-course");
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      })
  };

  return (
    <div className="course-form">
      <div className="heading">
      {isLoading && <Loader />}
      {error && <p>Error: {error}</p>}
        <p>Edit Form</p>
      </div>
      <form onSubmit={handelSubmit}>
        <div className="mb-3">
          <label for="course" className="form-label">
            Course
          </label>
          <input
            type="text"
            className="form-control"
            id="course"
            name="course"
            value={course.course}
            onChange={handelInput}
          />
        </div>
        <div className="mb-3 mt-3">
          <label for="mentor" className="form-label">
            Mentor
          </label>
          <input
            type="mentor"
            className="form-control"
            id="mentor"
            name="mentor"
            value={course.mentor}
            onChange={handelInput}
          />
        </div>
        <div className="mb-3">
          <label for="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={course.title}
            onChange={handelInput}
          />
        </div>
        <button type="submit" className="btn btn-primary submit-btn">
          EDIT
        </button>
      </form>
    </div>
  );
};
export default EditCourse;
