import React, { useEffect, useState } from "react";
import { Sidebar } from "./indexPage";
import styles from "../style";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ModalCustom } from "../components/indexComponent";
import { arrow_back } from "../assets/indexAsset";

const ComplaintDetail = () => {
  const [complaintList, setComplaintList] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [openModalResolved, setOpenModalResolved] = useState(false);
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [currentId, setCurrentId] = useState("");

  useEffect(() => {
    const fetchPackageData = async () => {
      const id = localStorage.getItem("uid");
      if (id) {
        try {
          const res = await axios.get(
            `http://localhost:3000/complaint/${params.complaintId}`
          );
          if (Object.keys(res.data).length > 0) {
            setComplaintList(res.data);
            setCurrentId(res.data.id);
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

  const resolvedComplaint = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/complaint/resolved/${params.complaintId}`,
        {
          status: "resolved",
        }
      );
      console.log(res);
      if (res.status === 200) {
        console.log("updated resolved successfully");
        setOpenModalResolved(false);
        navigate("/complaintlist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelComplaint = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/complaint/cancel/${params.complaintId}`,
        {
          status: "cancel",
        }
      );
      console.log(res);
      if (res.status === 200) {
        console.log("updated cancel successfully");
        setOpenModalCancel(false);
        navigate("/complaintlist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="relative z-10">
        <ModalCustom
          open={openModalCancel}
          label="Delete Confirmation"
          des="Do you sure to delete this Package?"
          onClose={() => setOpenModalCancel(false)}
          yesLabel="Yes, I want to delete"
          noLabel="No, I don’t want"
          onYes={() => cancelComplaint()}
        />

        <ModalCustom
          open={openModalResolved}
          label="Resolve Complaint"
          des="This complaint is resolved?"
          onClose={() => setOpenModalResolved(false)}
          yesLabel="Yes, it has been resolved"
          noLabel="No, it’s not"
          onYes={() => resolvedComplaint()}
        />
      </div>
      {Object.keys(complaintList).length > 0 && (
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
                      onClick={() => navigate("/complaintlist")}
                    >
                      <img src={arrow_back} alt="" className="" />
                    </button>
                    <p className="  text-gray-800 text-h1 text-xl">
                      {complaintList.issue}
                    </p>
                    <p className={`${complaintList.status}`}>
                      {complaintList.status}
                    </p>
                  </div>
                  <div className="w-1/2  gap-3 flex flex-row justify-end items-center">
                    <button
                      type="button"
                      className="text-h1 text-[#C70039]  rounded-[35px] px-5 py-[14px] w-1/2 text-xl border-2"
                      onClick={() => {
                        setOpenModalCancel(true);
                      }}
                    >
                      Cancel Complaint
                    </button>
                    <button
                      type="button"
                      className="btPrimary px-5 py-3 w-1/2 text-xl"
                      onClick={() => {
                        setOpenModalResolved(true);
                      }}
                    >
                      Resolve Complaint
                    </button>
                  </div>
                </section>
                <section
                  className={`m-[90px] pb-5 flex items-center justify-center flex-col`}
                >
                  <div className="w-full rounded-[30px] bg-white  flex flex-col items-start justify-start border-2 p-[90px] gap-10">
                    <p className="text-[#646D89] text-h4  text-xl pb-5 border-b-2">
                      Complaint by:
                      <span className="text-b3  text-lg text-black ml-3">
                        {complaintList.username}
                      </span>
                    </p>
                    <div className="text-[#646D89] text-h4  text-xl flex flex-col ">
                      <p>Issue</p>
                      <p className="text-b3  text-lg text-black mt-3  ">
                        {complaintList.issue}
                      </p>
                    </div>
                    <div className="text-[#646D89] text-h4  text-xl flex flex-col w-full">
                      <p>Description</p>
                      <p className="text-b3  text-lg text-black mt-3 w-full">
                        {complaintList.description}
                        Lorem ipsum dolor sit amet consectetur adipisicing
                        elit.Excepturi ratione et praesentium recusandae ab
                        voluptateearum nihil officia officiis iste, fuga
                        veritatis velit totam quod eum voluptatibus nisi
                        doloribus?
                      </p>
                    </div>
                    <div className="text-[#646D89] text-h4  text-xl flex flex-col">
                      <p>Date Submitted</p>
                      <p className="text-b3  text-lg text-black mt-3">
                        {convertTime(complaintList.submitDate)}
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

export default ComplaintDetail;
