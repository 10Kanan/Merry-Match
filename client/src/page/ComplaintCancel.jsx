import React, { useEffect, useState } from "react";
import { Sidebar } from "./indexPage";
import styles from "../style";
import { arrow_back } from "../assets/indexAsset";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ComplaintCancel = () => {
  const [currentComplaint, setCurrentComplaint] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageData = async () => {
      const id = localStorage.getItem("uid");
      if (id) {
        try {
          const res = await axios.get(
            `http://localhost:3000/complaint/${params.complaintId}`
          );
          if (Object.keys(res.data).length > 0) {
            setCurrentComplaint(res.data);
            // setCurrentComplaint(res.data.id);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchPackageData();
  }, []);

  const convertTime = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      {Object.keys(currentComplaint).length > 0 && (
        <section className="flex flex-row justify-between items-start">
          <Sidebar />

          <div className="flex flex-col flex-1">
            <section className={`bg-[#F1F2F6]`}>
              <div>
                <section
                  className={` ${styles.paddingMin} bg-white flex flex-row justify-between items-center `}
                >
                  <div className="flex flex-row gap-5">
                    <button
                      type="button"
                      className=" cursor-pointer"
                      onClick={() => navigate("/complaintlist")}
                    >
                      <img src={arrow_back} alt="" className="" />
                    </button>
                    <p className="  text-gray-800 text-h1 text-xl">
                      {currentComplaint.username}
                    </p>
                    <p className="cancel">Cancel</p>
                  </div>
                </section>

                <section
                  className={`m-[90px] pb-5 flex items-center justify-center flex-col`}
                >
                  <div className="w-full rounded-[30px] bg-white  flex flex-col items-start justify-start border-2 p-[90px] gap-10">
                    <p className="text-[#646D89] text-h4  text-xl pb-5 border-b-2 w-full">
                      Complaint by:
                      <span className="text-lg text-b3 text-black ml-3">
                        {currentComplaint.username}
                      </span>
                    </p>
                    <div className="text-[#646D89] text-h4  text-xl flex flex-col ">
                      <p>Issue</p>
                      <p className="text-lg text-b3 text-black mt-3">
                        {currentComplaint.issue}
                      </p>
                    </div>
                    <div className="text-[#646D89] text-h4  text-xl flex flex-col w-fullss ">
                      <p>Description</p>
                      <p className="text-lg text-b3 text-black mt-3">
                        {currentComplaint.description}
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Excepturi ratione et praesentium recusandae ab voluptate
                        earum nihil officia officiis iste, fuga veritatis ad
                        velit totam quod eum voluptatibus nisi doloribus?
                      </p>
                    </div>
                    <div className="text-[#646D89] text-h4  text-xl flex flex-col ">
                      <p>Date Submitted</p>
                      <p className="text-lg text-b3 text-black mt-3">
                        {convertTime(currentComplaint.submitDate)}
                      </p>
                    </div>
                    <div className="text-[#646D89] text-h4  text-xl flex flex-col border-t-2 pt-5 w-full">
                      <p>Canceled date</p>
                      <p className="text-lg text-b3 text-black mt-3">
                        {convertTime(currentComplaint.cancelDate)}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          </div>
        </section>
      )}
    </>
  );
};

export default ComplaintCancel;
