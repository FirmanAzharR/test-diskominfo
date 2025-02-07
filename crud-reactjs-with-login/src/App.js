import "./App.css";
import CreateUser from "./components/User/CreateUser";
import ShowUser from "./components/User/ShowUser";
import CreateCourse from "./components/Course/CreateCourse";
import ShowCourse from "./components/Course/ShowCourse";
import Course from "./components/Course/Course";
import EditCourse from "./components/Course/EditCourse";
import EditUser from "./components/User/EditUser";
import User from "./components/User/User";
import Header from "./components/Common/Header";
import Home from "./components/Layout/Home";
import Login from "./components/Layout/Login";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute ";
function App() {
  return (
    <div className="App">
      <header className="container">
        <div className="">
          <Header />
          {/* <Router> */}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/edit-user/:id" element={<PrivateRoute><EditUser /></PrivateRoute>} />
              <Route path="/user/:id" element={<PrivateRoute><User /></PrivateRoute>} />
              <Route path="/create-user" element={<PrivateRoute><CreateUser /></PrivateRoute>} />
              <Route path="/show-user" element={<PrivateRoute><ShowUser /></PrivateRoute>} />
              <Route path="/create-course" element={<PrivateRoute><CreateCourse /></PrivateRoute>} />
              <Route path="/show-course" element={<PrivateRoute><ShowCourse /></PrivateRoute>} />
              <Route path="/course/:id" element={<PrivateRoute><Course /></PrivateRoute>} />
              <Route path="/edit-course/:id" element={<PrivateRoute><EditCourse /></PrivateRoute>} />
            </Routes>
          {/* </Router> */}
          
        </div>
      </header>
    </div>
  );
}

export default App;
