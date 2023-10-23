import React, { useEffect, useRef } from "react";
import { complaint, homelogo, logout, membership } from "../assets/indexAsset";
import { useUserAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const { logOut } = useUserAuth();

  const membershipRef = useRef(null);
  const complaintRef = useRef(null);

  const currentURL = window.location.href;

  const checkURL = () => {
    if (currentURL.includes("admin")) {
      membershipRef.current.focus();
    }
    if (currentURL.includes("complaint")) {
      complaintRef.current.focus();
    }
  };

  useEffect(() => {
    checkURL();
  }, []);

  return (
    <>
      <section className=" h-screen w-1/6 border-r-2 flex flex-col justify-between">
        <div>
          <div className="w-full flex flex-col justify-center items-center pt-10 py-20">
            <img src={homelogo} alt="logo" />
            <p className="text-b1 text-gray-500">Admin Panel Control</p>
          </div>

          <div className="w-full flex flex-col">
            <button
              onClick={() => navigate("/adminpackagelist")}
              ref={membershipRef}
              className=" focus:bg-gray-100 gap-4 flex justify-start items-center px-4 py-7 pl-10"
            >
              <img src={membership} alt="membership" className="w-[30px]" />
              <span className="ml-4  text-gray-800 text-h1 text-lg">
                Merry Package
              </span>
            </button>
            <button
              onClick={() => navigate("/complaintlist")}
              ref={complaintRef}
              className=" focus:bg-gray-100 gap-4 flex justify-start items-center px-4 py-7 pl-10"
            >
              <img src={complaint} alt="complaint" className="w-[30px]" />
              <span className="ml-4  text-gray-800 text-h1 text-lg">
                Complaint
              </span>
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            logOut();
          }}
          className=" border-y-2 gap-4 flex justify-start items-center px-4 py-6 pl-10"
        >
          <img src={logout} alt="logout" className="w-[30px]" />
          <span className="ml-4 text-gray-800 text-h1 text-lg">Log Out</span>
        </button>
      </section>
    </>
  );
}

export default Sidebar;
