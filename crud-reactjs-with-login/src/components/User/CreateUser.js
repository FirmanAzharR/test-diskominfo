import React, { useState } from 'react'
import {useNavigate } from "react-router-dom";
import Loader from '../Common/Loader';
import './User.css';
const CreateUser = () => {
    const navigate = useNavigate();
    const createUserApi = "http://localhost:7089/user/add-user"
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    })

    const handleInput = (event) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value, // Updates specific field dynamically
        }));
    };

    const handelSubmit = async (event) => {
        event.preventDefault();
        console.log(user)
        try {
            setIsLoading(true);
            const response = await fetch(createUserApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                console.log('Form submitted successfully!');
                setUser({username: "",email: "",password: ""})
                navigate('/show-user');
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
                <p>User Form</p>
            </div>
            <form onSubmit={handelSubmit}>
                <div className="mb-3">
                    <label for="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name="username" value={user.username} onChange={handleInput} />
                </div>
                <div className="mb-3 mt-3">
                    <label for="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={user.email} onChange={handleInput} />
                </div>
                <div className="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input type="text" className="form-control" id="password" name="password" value={user.password} onChange={handleInput} />
                </div>
                <button type="submit" className="btn btn-primary submit-btn">Submit</button>
            </form>
        </div>
    )
}

export default CreateUser