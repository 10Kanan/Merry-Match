import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles, { layout } from "../style";
import { allPackage } from "../constants/indexConstants";
import Footer from "../components/Footer";
import axios from "axios";
import { rightIcon } from "../assets/indexAsset";
import { ModalCustom } from "../components/indexComponent";

function Membership() {
  const { icon, title, price, details, billingHistory } = allPackage[0];
  const [packageStatus, setPackageStatus] = useState(false);
  const [currentbilling, setCurrentBilling] = useState(null);
  const [allBillingHistory, setAllBillingHistory] = useState(null);
  const [currentPackageId, setCurrentPackageId] = useState(null);
  const [nextBilling, setNextBilling] = useState(null);
  const [profile, setProfile] = useState([]);
  const [id, setId] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const getCurrentBillingHistory = async () => {
    const id = localStorage.getItem("uid");
    const result = await axios(
      `http://localhost:3000/billing/userbilling/${id}`
    );
    console.log(result.data);
    if (result.data.length > 0) {
      setAllBillingHistory(result.data);
    }
  };

  const fetchUserProfileData = async () => {
    const id = localStorage.getItem("uid");
    setId(id);
    if (id) {
      try {
        const res = await axios.get(`http://localhost:3000/users/${id}`);
        setProfile(res.data.user.profilePictures[0]);
        // console.log(Object.keys(res.data.billingData).length > 0);
        if (Object.keys(res.data.billingData).length > 0) {
          setPackageStatus(true);
          console.log(res.data.billingData);
          setCurrentPackageId(res.data.billingData.id);
          setCurrentBilling(res.data.billingData.packageData);
          setNextBilling(res.data.billingData.endPackageTime);
        }
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    }
  };
  const cancelBilling = async () => {
    try {
      await axios.put(
        `http://localhost:3000/billing/${currentPackageId}`,
        { packageStatus: false },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPackageStatus(false);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelPackage = async () => {
    cancelBilling();
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
    fetchUserProfileData();
    getCurrentBillingHistory();
  }, [packageStatus]);

  return (
    <>
      <ModalCustom
        open={openModal}
        label="Cancel Confirmation"
        des="Do you sure to cancel Membership to get more Merry?"
        onClose={() => setOpenModal(false)}
        yesLabel="Yes, I want to cancel"
        noLabel="No, I still want to be member"
        onYes={() => handleCancelPackage()}
      />
      <section className="flex flex-col">
        <section className="bg-white w-full">
          <div className={`${styles.flexCenter} `}>
            <nav className={`${styles.boxWidth}`}>
              <Navbar profileUser={profile} />
            </nav>
          </div>
        </section>

        <section className="bg-white w-full flex justify-center">
          <div className={`${styles.boxWidth}`}>
            <div className="w-full px-10 py-8 flex flex-col">
              <section className="pt-8 w-full">
                <p className="t-beige-700 text-b1 uppercase ">
                  Merry Membership Package
                </p>
                <h2 className="t-purple-500 text-[50px] text-h1">
                  Manage your membership <br className="sm:block hidden" />
                  and payment method
                </h2>
              </section>
              {packageStatus && (
                <section className="w-full my-20">
                  <p className="t-purple-500 text-[22px] text-h4 mb-5">
                    Merry Membership Package
                  </p>
                  <div
                    className={`${styles.flexStart} w-full mr-0 paymentCard bg-gradient-to-r from-[#742138]  to-[#a878bf]`}
                  >
                    <div className="flex w-full flex-row justify-between items-start  pb-10 border-b-[#b986d1] border-b-[1px]">
                      <div className=" flex flex-row justify-start">
                        <img
                          src={currentbilling.icon}
                          alt="package-icon"
                          className="w-[80px] h-[80] relative z-[5] mr-10"
                        />
                        <div className="flex items-start justify-center flex-col mr-20">
                          <p className="text-b1 text-white text-[35px]">
                            {currentbilling.packageName}
                          </p>
                          <p className="text-b3 text-[18px] text-[#EFC4E2]">
                            {currentbilling.price}{" "}
                            <span className="text-[16px]">/Month</span>
                          </p>
                        </div>
                        <div className="flex flex-col items-start justify-center">
                          {currentbilling.details.map((item, index) => (
                            <div key={index} className=" flex flex-row">
                              <img src={rightIcon} alt="" />
                              <p className="ml-5 text-[#F4EBF2] text-b3 text-[18px]">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <button className="new text-b1 text-[14px]">
                          Active
                        </button>
                      </div>
                    </div>
                    <div className="flex w-full justify-end items-center">
                      <button
                        className=" text-b1 mt-5 text-white text-[14px] cursor-pointer hover:underline"
                        onClick={() => setOpenModal(true)}
                      >
                        Cancel Package
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {allBillingHistory && (
                <section className="w-full mb-20 ">
                  <p className="t-purple-500 text-[22px] text-h4 mb-5">
                    Billing History
                  </p>
                  <div className="border-2 bg-white rounded-[32px] p-[40px]">
                    {packageStatus && (
                      <>
                        <p className="text-[#646D89] text-b1 mb-5">
                          Next billing : {formatTimestampToDate(nextBilling)}
                        </p>
                        <hr />
                      </>
                    )}

                    <div className="w-full mt-3">
                      {allBillingHistory.map((history, index) => (
                        <div
                          key={index}
                          className={`${
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-[#F6F7FC] rounded-xl"
                          } w-full flex flex-col`}
                        >
                          <div className="flex flex-row items-center justify-between py-5 mx-2 px-2 ">
                            <div>
                              {formatTimestampToDate(history.endPackageTime)}
                            </div>
                            <div>THB {history.packageData.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
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
}

export default Membership;
