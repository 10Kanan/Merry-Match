import React from "react";
import styles from "../style";
import { arrow_back, rightArrow } from "../assets/indexAsset";

const ComplaintDetailCard = ({ complaint }) => {
  return (
    <div>
      <section
        className={` ${styles.paddingMin} bg-white flex flex-row justify-between items-center `}
      >
        <div className="flex flex-row gap-5">
          <button>
            <img src={arrow_back} alt="" className="" />
          </button>
          <p className="  text-gray-800 text-h1 text-xl">
            I was insulted by Ygritte
          </p>
          <p className="pending">Pending</p>
        </div>
        <div className="w-1/2  gap-3 flex flex-row justify-end items-center">
          <button className="text-h1 text-[#C70039]  rounded-[35px] px-5 py-[14px] w-1/2 text-xl border-2">
            Cancel Complaint
          </button>
          <button className="btPrimary px-5 py-3 w-1/2 text-xl">
            Resolve Complaint
          </button>
        </div>
      </section>

      <section className={`m-[90px] pb-5 w-full`}>
        {/* Display details of the complaint */}
        <div className="w-5/6 rounded-[30px] bg-white  flex flex-col items-start justify-start border-2 p-[90px] gap-10">
          <p className="text-[#646D89] text-b1  text-xl pb-5 border-b-2">
            Complaint by:
            <span className="text-sm text-black ml-3">
              {complaint.username}
            </span>
          </p>
          <div className="text-[#646D89] text-b1  text-xl flex flex-col ">
            <p>Issue</p>
            <p className="text-sm text-black mt-3">{complaint.submitDate}</p>
          </div>
          <div className="text-[#646D89] text-b1  text-xl flex flex-col w-1/2 text-ellipsis">
            <p>Description</p>
            <p className="text-sm text-black mt-3">
              {complaint.description}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
              ratione et praesentium recusandae ab voluptate earum nihil officia
              officiis iste, fuga veritatis ad velit totam quod eum voluptatibus
              nisi doloribus?
            </p>
          </div>
          <div className="text-[#646D89] text-b1  text-xl flex flex-col">
            <p>Status</p>
            <p className="text-sm text-black mt-3">{complaint.status}</p>
          </div>
        </div>

        {/* Add any other details as needed */}
      </section>
    </div>
  );
};

export default ComplaintDetailCard;
