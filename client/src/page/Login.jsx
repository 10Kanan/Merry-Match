import React, { useState, useEffect } from "react";
import styles, { layout } from "../style";
import Navbar from "../components/Navbar";
import { login1 } from "../assets/indexAsset";
import { useUserAuth } from "../context/AuthContext";
import { Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { logIn, isErrorAuth, setIsErrorAuth } = useUserAuth();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    username: "",
    password: "",
    email: "",
  });

  // useEffect(() => {}, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await logIn(formData.email, formData.password);
    } catch (err) {
      setIsErrorAuth(err.message);
      setTimeout(() => {
        setIsErrorAuth(null);
      }, 1000);
    }
  };

  return (
    <>
      <section className="bg-white w-full ">
        <div className={`${styles.flexCenter} `}>
          <nav className={`${styles.boxWidth}`}>
            <Navbar />
          </nav>
        </div>
      </section>

      <section className="bg-white w-full ">
        <div className={`${styles.flexCenter}`}>
          <div className={` ${styles.boxWidth} `}>
            <div className=" flex flex-row my-[100px] ">
              <div className="w-1/2">
                <img
                  src={login1}
                  alt="billing"
                  className="w-[450px] h-[100%] relative z-[5]"
                />
              </div>

              <div className="w-1/2">
                <div className="ml-[100px] mt-20 ">
                  <div className="">
                    <p className="t-beige-700 text-b1 ">LOGIN</p>
                    <h2 className="t-purple-500 text-[50px] text-h1">
                      Welcome back to <br className="sm:block hidden" /> Merry
                      Match
                    </h2>
                  </div>
                  <div>
                    <form className="mt-8 " onSubmit={handleSubmit}>
                      <div className="text-b1 h-[100px]">
                        <h2>Email</h2>
                        <label htmlFor="email" className="sr-only"></label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`${styles.input} `}
                          placeholder="Enter an email"
                        />
                      </div>

                      <div className="text-b1 h-[100px]">
                        <h2>Password</h2>
                        <label htmlFor="password" className="sr-only"></label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`${styles.input}`}
                          placeholder="At least 8 charactor"
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="btPrimary w-full py-2 px-4 mt-0 my-10"
                        >
                          Log in
                        </button>
                      </div>
                    </form>
                  </div>

                  <p className={`max-w-[470px] mt-0  text-black text-b1`}>
                    Don’t have an account?
                    <Link to={"/register"} className="t-red-500">
                      {" "}
                      Register
                    </Link>
                  </p>
                  {isErrorAuth !== null && (
                    <Alert
                      severity="error"
                      className="w-full flex items-center justify-center mt-5"
                    >
                      {isErrorAuth}
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
