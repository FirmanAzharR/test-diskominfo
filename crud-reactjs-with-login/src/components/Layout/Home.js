import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Common/Loader";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const showUserApi = "http://localhost:7089/user/all-user-course";
  const mentorFeeApi = "http://localhost:7089/user/mentor-fee";

  const [user, setUser] = useState([]);
  const [fee, setFee] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState("sarjana");

  useEffect(() => {
    getUsers();
    mentorFee()
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    setIsLoading(true);
    getUsers();
    setIsLoading(false);
    
  }

  const handleLogout = (event) => {
    // event.preventDefault(); 
    localStorage.clear();
    navigate('/');
  }

  const getUsers = () => {
    axios
      .post(showUserApi,  { jenis_mentor: selectedOption }, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("dataLogin")).token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log(res.data.result);
        setIsLoading(false);
        setUser(res.data.result);
      })
      .catch((err) => {
        setError(err.message)
        console.log(err);
      });
  };

  const mentorFee = () => {
    axios
      .get(mentorFeeApi,{
        // headers: {
        //   Authorization: `Bearer ${JSON.parse(localStorage.getItem("dataLogin")).token}`,
        //   "Content-Type": "application/json",
        // },
      })
      .then((res) => {
        // console.log(res.data.result.chart);
        setFee(res.data.result.chart);
      })
      .catch((err) => {
        setError(err.message)
        console.log(err);
      });
  };

  const data = {
    labels: fee.labels,
    datasets: [
      {
        label: 'Fee',
        data: fee.total_fee,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Jumlah Peserta',
        data: fee.jumlah_peserta,
        backgroundColor: 'rgba(192, 75, 75, 0.2)',
        borderColor: 'rgb(192, 75, 75)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Mentor Fee Data (click option Fee/Jumlah Peserta to filter)',
      },
    },
  };



  if (user.length < 0) {
    return <h1>no user found</h1>;
  } else {
    return (
      <div className="mt-5">
         <form onSubmit={handleLogout}>
         <button type="submit" className="btn btn-warning">logout</button>
         </form>
        {isLoading && <Loader />}
        {error && <p>Error: {error}</p>}
        <form onSubmit={handleSubmit}>
        <h4>Pilih jenis mentor</h4>
        <label>
        <input
          type="radio"
          value="sarjana"
          checked={selectedOption === "sarjana"}
          onChange={handleChange}
        />
        sarjana
      </label>
      <br></br>
      <label>
        <input
          type="radio"
          value="bukan sarjana"
          checked={selectedOption === "bukan sarjana"}
          onChange={handleChange}
        />
        bukan sarjana
      </label>
      <br></br>
      <button type="submit" className="btn btn-primary">send</button>
      <br></br> <br></br>
      </form>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Course</th>
              <th>Mentor</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {user?.map((item, i) => {
              return (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td>{item.username}</td>
                  <td>{item.course}</td>
                  <td>{item.mentor}</td>
                  <td>{item.title}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>
          <h3>Course Mentor Fee Income Diagram</h3>
          <Bar data={data} options={options} />
        </div>
      </div>
    );
  }
};

export default Home;
