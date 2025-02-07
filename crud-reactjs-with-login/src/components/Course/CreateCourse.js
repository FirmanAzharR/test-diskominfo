import React, { useState } from 'react'
import {useNavigate } from "react-router-dom";
import Loader from '../Common/Loader';
import './User.css';
const Createcourse = () => {
    const navigate = useNavigate();
    const createcourseApi = "http://localhost:7089/course/add-course"
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [course, setCourse] = useState({
        course: "",
        mentor: "",
        title: ""
    })

    const handleInput = (event) => {
        const { name, value } = event.target;
        setCourse((prevcourse) => ({
            ...prevcourse,
            [name]: value, // Updates specific field dynamically
        }));
    };

    const handelSubmit = async (event) => {
        event.preventDefault();
        console.log(course)
        try {
            setIsLoading(true);
            const response = await fetch(createcourseApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(course),
            });

            if (response.ok) {
                console.log('Form submitted successfully!');
                setCourse({course: "",mentor: "",title: ""})
                navigate('/show-course');
            } else {
                console.error('Form submission failed!');
            }

        } catch (error) {
            setError(error.message);
        } finally{
            setIsLoading(false);
        }
    }

    return (
        <div className='user-form'>
            <div className='heading'>
            {isLoading && <Loader />}
            {error && <p>Error: {error}</p>}
                <p>course Form</p>
            </div>
            <form onSubmit={handelSubmit}>
                <div className="mb-3">
                    <label for="course" className="form-label">course</label>
                    <input type="text" className="form-control" id="course" name="course" value={course.course} onChange={handleInput} />
                </div>
                <div className="mb-3 mt-3">
                    <label for="mentor" className="form-label">mentor</label>
                    <input type="mentor" className="form-control" id="mentor" name="mentor" value={course.mentor} onChange={handleInput} />
                </div>
                <div className="mb-3">
                    <label for="title" className="form-label">title</label>
                    <input type="text" className="form-control" id="title" name="title" value={course.title} onChange={handleInput} />
                </div>
                <button type="submit" className="btn btn-primary submit-btn">Submit</button>
            </form>
        </div>
    )
}

export default Createcourse