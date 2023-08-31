import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import toast from 'react-hot-toast';
const config = require("../config.json");

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // If the user is already logged in, go straight to home
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/get_current_user`, {
      method: "GET",
      credentials : 'include',
    }).then((res) => res.text())
      .then((resText) => {
        console.log(resText)
        if (resText) {
          navigate("/domestic");
        }
    });
  }, []);

  // Login function
  const handleLogin = () => {
    if (username.length === 0) {
      toast.error("Username must be filled")
    } else if (password.length === 0) {
      toast.error("Password must be filled")
    } else {
      fetch(`http://${config.server_host}:${config.server_port}/login?username=${username}&password=${password}`, {
        method: "POST",
        credentials : 'include'
      }).then((data, status) => {
        if (data.status === 201) {
          toast.success("Logged in!")
          navigate("/domestic");
        } else {
          toast.error("Username or password is incorrect")
        }
      }
      );
    }
  };

  return (
    <>
      <div style={{ height: "100vh", padding: "5vh" }} className="w-100">
        <div
          style={{ marginBottom: "12vh" }}
          className="d-flex justify-content-center"
        >
          <img
            className="m-auto text-center text-light"
            src={"https://w7.pngwing.com/pngs/773/201/png-transparent-airplane-aircraft-flight-logo-airplane-blue-logo-flight-thumbnail.png"}
            width="25"
          ></img>
        </div>
        <div className="text-center mb-4 text-2xl font-semibold">Sky High Entertainment</div>
        <div className="mx-auto w-fit">
          <div>
            <TextField
              className="w-[24vw]"
              color="primary"
              id="outlined-required"
              variant="outlined"
              label="Username"
              defaultValue=""
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <TextField
              className="w-[24vw]"
              color="primary"
              id="outlined-required"
              variant="outlined"
              label="Password"
              defaultValue=""
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="m-auto text-center mb-3">
          <button 
            type="button" 
            onClick={() => handleLogin()}
            class="text-white w-[24vw] bg-blue-500 mt-4 hover:bg-blue-600 hover:scale-105 active:scale-100 duration-150 font-medium rounded px-5 py-4 focus:outline-none">
              Continue
          </button>
        </div>
        <p className="m-auto text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 text-decoration-none">
            Sign up
          </a>
        </p>
      </div>
    </>
  );
};

export default Login;
