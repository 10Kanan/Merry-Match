import React, { useState, useEffect } from "react";
import styles, { layout } from "../style";
import Navbar from "../components/Navbar";
import { login1 } from "../assets/indexAsset";
import Button from "../components/ButtonCustom";
import Footer from "../components/Footer";
import axios from "axios";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";

const Complaint = () => {
  const [formData, setFormData] = useState({
    issue: "",
    description: "",
    username: "",
    status: "new",
  });
  const [profile, setProfile] = useState([]);
  const [isCompleted, setIsCompleted] = useState(null);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      const id = localStorage.getItem("uid");
      if (id) {
        try {
          const res = await axios.get(`http://localhost:3000/users/${id}`);
          //  setProfile(res.data.user.profilePictures[0]);
          console.log(res.data.user.username);
          setProfile(res.data.user.profilePictures[0]);

          setFormData({
            ...formData,
            username: res.data.user.username,
          });
        } catch (error) {
          console.error("Error fetching user profiles:", error);
        }
      }
    };
    fetchUserProfileData();
  }, []);

  const [formErrors, setFormErrors] = useState("");

  useEffect(() => {}, [formData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateData();
    setFormData({
      issue: "",
      description: "",
      username: "",
      status: "new",
    });
    setIsCompleted(true);
    setTimeout(() => {
      setIsCompleted(null);
    }, 1000);
    console.log("submitted");
  };

  const updateData = async () => {
    const updateData = {
      ...formData,
    };

    await axios.post(`http://localhost:3000/complaint`, updateData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <>
      <section>
        <section className="bg-white w-full ">
          <div className={`${styles.flexCenter} `}>
            <nav className={`${styles.boxWidth}`}>
              <Navbar profileUser={profile} />
            </nav>
          </div>
        </section>

        <section className="bg-white w-full ">
          <div className={`${styles.flexCenter}`}>
            <div className={` ${styles.boxWidth} `}>
              <div className=" flex flex-row mt-[100px] mb-[200px]">
                <div className="w-1/2">
                  <div className="mr-20 mt-0 ">
                    <div className="">
                      <p className="t-beige-700 text-b1 uppercase">Complaint</p>
                      <h2 className="t-purple-500 text-[50px] text-h1">
                        If you have any trouble
                        <br className="sm:block hidden" />
                        Don't be afraid to tell us!
                      </h2>
                    </div>

                    <div>
                      <form className="mt-8 " onSubmit={handleSubmit}>
                        {isCompleted === true && (
                          <div>
                            <Alert
                              severity="success"
                              className="w-full flex items-center justify-center"
                            >
                              <AlertTitle>Update Success!!</AlertTitle>
                            </Alert>
                          </div>
                        )}
                        <div className="text-b1 h-[100px]">
                          <h2>Issue</h2>
                          <label htmlFor="issue" className="sr-only"></label>
                          <input
                            required
                            type="text"
                            name="issue"
                            value={formData.issue}
                            onChange={handleChange}
                            className={`${styles.input} `}
                            placeholder="Tell us your new issue..."
                          />
                        </div>
                        <div className="text-b1">
                          <h2>Description</h2>
                          <label
                            htmlFor="description"
                            className="sr-only"
                          ></label>
                          <textarea
                            required
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`${styles.input} placeholder:top-0`}
                            placeholder="Let's us know your issues..."
                            rows={7} // กำหนดจำนวนแถว
                            cols={1}
                          />
                        </div>
                        {/* 
                        <div className="h-[100px] w-2/3 mt-8 mb-3">
                          <h2 className="text-b1 ">Date</h2>
                          <label
                            htmlFor="issueDate"
                            className="sr-only"
                          ></label>
                          <input
                            required
                            type="date"
                            name="issueDate"
                            value={formData.issueDate}
                            onChange={handleChange}
                            className={`${styles.input} `}
                            placeholder="Enter your date of birth"
                          />
                        </div> */}
                        <div className=" mt-5">
                          <button
                            type="submit"
                            className="btPrimary py-2 px-4 mt-0 my-10"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="w-1/2 flex justify-end items-start">
                  <img src={login1} alt="billing" className="w-[480px] " />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F6F7FC] w-full ">
          <div className={`${styles.flexCenter} `}>
            <div className={`${styles.boxWidth}`}>
              <Footer />
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Complaint;
