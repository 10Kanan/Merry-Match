import React, { useState } from "react";
import { ComplaintHeader, Sidebar } from "./indexPage";
import ComplaintCard from "../components/ComplaintCard";
import styles from "../style";

const ComplaintList = () => {
  return (
    <>
      <section className=" flex flex-row justify-between items-start ">
        <Sidebar />

        <div className=" flex flex-col flex-1">
          <section className={`bg-[#F1F2F6]`}>
            <ComplaintCard />
          </section>
        </div>
      </section>
    </>
  );
};

export default ComplaintList;
