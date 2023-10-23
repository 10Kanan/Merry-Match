import React, { useEffect, useState } from "react";
import styles, { layout } from "../style";
import Navbar from "../components/Navbar";
import { premium, rightIcon, success } from "../assets/indexAsset";
import { allPackage } from "../constants/indexConstants";
import Button from "../components/ButtonCustom";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [billing, setBilling] = useState(null);
  const [profile, setProfile] = useState([]);
  const [id, setId] = useState("");

  const params = useParams();
  const navigate = useNavigate();

  const getCurrentBilling = async () => {
    const result = await axios(
      `http://localhost:3000/billing/${params.billingId}`
    );
    console.log(result.data);
    setBilling(result.data);
  };

  const fetchUserProfileData = async () => {
    const id = localStorage.getItem("uid");
    setId(id);
    if (id) {
      try {
        const res = await axios.get(`http://localhost:3000/users/${id}`);
        setProfile(res.data.user.profilePictures[0]);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    }
  };

  const formatTimestampToDate = (timestamp) => {
    const milliseconds =
      timestamp.seconds * 1000 + Math.round(timestamp.nanoseconds / 1e6);

    const date = new Date(milliseconds);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${day < 10 ? "0" : ""}${day}/${
      month < 10 ? "0" : ""
    }${month}/${year}`;

    return formattedDate;
  };

  useEffect(() => {
    getCurrentBilling();
    fetchUserProfileData();
  }, []);

  return (
    <section className=" flex-col flex">
      <section className="bg-white w-full">
        <div className={`${styles.flexCenter} `}>
          <nav className={`${styles.boxWidth}`}>
            <Navbar profileUser={profile} />
          </nav>
        </div>
      </section>

      <section className="bg-white w-full flex justify-center">
        <div className={` ${styles.boxWidth} `}>
          <div className=" flex flex-row justify-between items-start pt-20 pb-[300px]">
            <section className="flex-1 flex-col ">
              <img
                src={success}
                alt="package-icon"
                className="w-[80px] h-[80] mt-10"
              />
              <div className="my-20 ">
                <p className="t-beige-700 text-b1 uppercase ">AYMENT SUCCESS</p>
                <h2 className="t-purple-500 text-[50px] text-h1">
                  Welcom Merry Membership! <br className="sm:block hidden" />
                  Thank you for joining us
                </h2>
              </div>
              <div className="flex flex-row items-center justify-start gap-10">
                <button
                  className="btSecondary px-5 py-3"
                  onClick={() => navigate("/")}
                >
                  Back to home
                </button>
                <button
                  className="btPrimary px-5 py-3"
                  onClick={() => navigate("/memberhistory")}
                >
                  Check Membership
                </button>
              </div>
            </section>

            {billing !== null && (
              <section
                className={`${styles.flexStart} w-[400px] mr-0 paymentCard bg-gradient-to-r from-[#742138]  to-[#a878bf]`}
              >
                <div className="flex w-full flex-row justify-between items-start  pb-10 border-b-[#b986d1] border-b-[1px]">
                  <div className=" flex flex-col justify-start">
                    <img
                      src={billing.packageData.icon}
                      alt="package-icon"
                      className="w-[80px] h-[80] relative z-[5] mr-10"
                    />
                    <div className="flex items-start justify-center flex-col my-7 gap-2">
                      <p className="text-b1 text-white text-[35px]">
                        {billing.packageData.packageName}
                      </p>
                      <p className="text-b3 text-[18px] text-[#EFC4E2]">
                        THB {billing.packageData.price}{" "}
                        <span className="text-[16px]">/Month</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-start justify-center gap-3">
                      {billing.packageData.details.map((item, index) => (
                        <div key={index} className=" flex flex-row">
                          <img src={rightIcon} alt="" />
                          <p className="ml-5 text-[#F4EBF2] text-b3 text-[18px]">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-between items-center">
                  <div className=" text-b3 mt-7 text-[#EFC4E2] text-[14px]">
                    Start Membership
                  </div>
                  <div className=" text-b3 mt-7 text-white text-[14px]">
                    {formatTimestampToDate(billing.startPackageTime)}
                  </div>
                </div>
                <div className="flex w-full justify-between items-center">
                  <div className=" text-b3 mt-5 text-[#EFC4E2] text-[14px]">
                    Next billing
                  </div>
                  <div className=" text-b3 mt-5 text-white text-[14px]">
                    {formatTimestampToDate(billing.endPackageTime)}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default PaymentSuccess;
