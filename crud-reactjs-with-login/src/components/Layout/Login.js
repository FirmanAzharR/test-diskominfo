import React from 'react'
import Loader from '../Common/Loader';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../User/User.css';

const Login =()=> {

    const navigate = useNavigate();
       const createUserApi = "http://localhost:7089/user/login"
       const [error, setError] = useState(null);
       const [isLoading, setIsLoading] = useState(false);
       const [user, setUser] = useState({
           username: "",
           password: "",
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
               setIsLoading(true);
               fetch(createUserApi, {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json',
                   },
                   body: JSON.stringify(user),
               })
               .then(data => {
                return data.json();
               })
               .then(data => {
                    // console.log(data)
                   if (data.status===200) {
                   console.log('Form submitted successfully!');

                   localStorage.setItem("dataLogin",JSON.stringify(data.result));
                //    let x = localStorage.getItem("dataLogin")
                //    console.log('test',JSON.parse(x).token);
                   setUser({username: "",password: ""})      

                   navigate('/home');
               } else {
                   console.error('username or password is incorrect!');
                   setError(data.message);
               }
               })
               .catch(err=>{
                setError(err.message);
               })
               .finally(() => {
                setIsLoading(false);
               })

           
       }
   
       return (
           <div className='user-form'>
               <div className='heading'>
               {isLoading && <Loader />}
               {error && <p>Error: {error}</p>}
                   <p>Login</p>
               </div>
               <form onSubmit={handelSubmit}>
                   <div className="mb-3">
                       <label for="username" className="form-label">Username</label>
                       <input type="text" className="form-control" id="username" name="username" value={user.username} onChange={handleInput} />
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

export default Login