import React, { useState } from "react";
import { ComplaintHeader, Sidebar } from "./indexPage";
import ComplaintCard from "../components/ComplaintCard";
import styles from "../style";
import PackageListCard from "../components/PackageListCard";

export const MatchingPageList = () => {
  return (
    <>
      <section className=" flex flex-row justify-between items-start ">
        <Sidebar />

        <div className=" flex flex-col flex-1">
          <section className={`bg-gray-300`}>
            <PackageListCard />
          </section>
        </div>
      </section>
    </>
  );
};
