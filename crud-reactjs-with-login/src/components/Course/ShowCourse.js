import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Common/Loader";

const ShowCourse = () => {
  const showCorse = "http://localhost:7089/course/all";
  const deleteCourse = "http://localhost:7089/course/delete-course";

  const [course, setCourse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handelDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(deleteCourse.concat("?id=") + id, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      setCourse(course.filter((item) => item.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

  const getCourse = () => {
    axios
      .get(showCorse)
      .then((res) => {
        setCourse(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (course.length < 0) {
    return <h1>no course found</h1>;
  } else {
    return (
      <div className="mt-5">
        {isLoading && <Loader />}
        {error && <p>Error: {error}</p>}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Course</th>
              <th>Mentor</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {course?.map((item, i) => {
              return (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td>{item.course}</td>
                  <td>{item.mentor}</td>
                  <td>{item.title}</td>
                  <td>
                    <Link to={`/edit-course/${item.id}`}>
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </Link>
                    <Link to={`/course/${item.id}`}>
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </Link>

                    <i
                      className="fa fa-trash-o"
                      aria-hidden="true"
                      onClick={() => handelDelete(item.id)}
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default ShowCourse;
