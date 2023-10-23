import React, { useState, useMemo, useEffect } from "react";
import { complaintMockup } from "../constants/indexConstants";
import styles from "../style";
import ComplaintDetailCard from "./ComplaintDetailCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ComplaintCard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [complaintList, setComplaintList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageData = async () => {
      const id = localStorage.getItem("uid");
      if (id) {
        try {
          const res = await axios.get(`http://localhost:3000/complaint`);

          if (Object.keys(res.data).length > 0) {
            setComplaintList(res.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchPackageData();
  }, []);

  const filteredComplaintList = complaintList.filter((searchItem) => {
    const searchTermMatches =
      searchItem.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchItem.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchItem.description.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatches =
      selectedStatus === "" ||
      searchItem.status.toLowerCase() === selectedStatus.toLowerCase();

    return searchTermMatches && statusMatches;
  });

  const convertTime = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
  };
  const convertTimeSubmitDate = (isoDate) => {
    const date = new Date(isoDate);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleSelectComplaint = async (id, status) => {
    if (status === "new") {
      try {
        const res = await axios.put(
          `http://localhost:3000/complaint/${id}`,
          {
            status: "pending",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(res);
        if (res.status === 200) {
          navigate(`/complaintlist/detail/${id}`);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (status === "pending") {
      navigate(`/complaintlist/detail/${id}`);
    } else if (status === "resolved") {
      navigate(`/complaintlist/resolved/${id}`);
    } else if (status === "cancel") {
      navigate(`/complaintlist/cancel/${id}`);
    }
  };

  return (
    <div>
      <section
        className={` ${styles.paddingMin} bg-white flex flex-row justify-between items-center `}
      >
        <p className="ml-4  text-gray-800 text-h1 text-xl">Complaint list</p>
        <div className="w-1/2 gap-3 flex flex-row justify-end items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className={`${styles.input} `}
          />
          <select
            value={selectedStatus}
            className={`${styles.input} `}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
            }}
          >
            <option className="" value="">
              All Statuses
            </option>
            <option value="new">New</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="cancel">Cancel</option>
          </select>
        </div>
      </section>

      <section className={`mx-16 mt-16 pb-20`}>
        <ul className="p-0 rounded-[30px] bg-white ">
          <li className="flex bg-[#D6D9E4] text-[#424C6B] p-3 rounded-t-[30px] text-b1">
            <div className="w-1/6 pl-5">User</div>
            <div className="w-1/6 ">Issue</div>
            <div className="w-2/6">Description</div>
            <div className="w-1/6">Date Submitted</div>
            <div className="w-1/6">Status</div>
          </li>
          {filteredComplaintList.map((complaint, index) => (
            <li
              key={index}
              className="flex p-3 border-t border-gray-300 cursor-pointer text-b4"
              onClick={() =>
                handleSelectComplaint(complaint.id, complaint.status)
              }
            >
              <div className="w-1/6 pl-5 py-2">{complaint.username}</div>
              <div className="w-1/6 py-2  text-ellipsis truncate  overflow-hidden ...">
                {complaint.issue}
              </div>
              <div className="w-2/6 py-2 text-ellipsis truncate  overflow-hidden ...">
                {complaint.description}
              </div>
              <div className="w-1/6 py-2">
                {convertTimeSubmitDate(complaint.submitDate)}
              </div>
              {complaint.status === "new" && (
                <div className=" h-fit mt-1 capitalize   new text-[14px]">
                  {complaint.status}
                </div>
              )}
              {complaint.status === "pending" && (
                <div className=" h-fit mt-1 capitalize  pending text-[14px]">
                  {complaint.status}
                </div>
              )}
              {complaint.status === "resolved" && (
                <div className=" h-fit mt-1 capitalize  resolve text-[14px]">
                  {complaint.status}
                </div>
              )}
              {complaint.status === "cancel" && (
                <div className=" h-fit mt-1 capitalize  cancel text-[14px]">
                  {complaint.status}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ComplaintCard;
