import React, { useState } from "react";
import { Sidebar } from "./indexPage";
import AdminPackageCard from "../components/AdminPackageCard";

function AdminPackageList() {
  return (
    <>
      <section className=" flex flex-row justify-between items-start ">
        <Sidebar />

        <div className=" flex flex-col flex-1">
          <section className={`bg-[#F1F2F6]`}>
            <AdminPackageCard />
          </section>
        </div>
      </section>
    </>
  );
}

export default AdminPackageList;
