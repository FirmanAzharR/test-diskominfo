import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./User.css";
const Course = () => {
  const [course, setCourse] = useState([]);
  const { id } = useParams();
  const getCourseApi = "http://localhost:7089/course/current";

  useEffect(() => {
    getCourse();
  }, []);

  const getCourse = () => {
    axios
      .get(getCourseApi.concat("?id=") + id)
      .then((item) => {
        setCourse(item.data.result[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="course mt-5">
      <table className="table table-bordered">
    <thead>
      <tr>
        <th>Course Name</th>
        <th>Mentor</th>
        
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Course</td>
        <td>{course.course}</td>
      </tr>
      <tr>
        <td>Mentor</td>
        <td>{course.mentor}</td>
      </tr>
      <tr>
        <td>Title</td>
        <td>{course.title}</td>
      </tr>
    </tbody>
  </table>
    </div>
  );
};
export default Course;
