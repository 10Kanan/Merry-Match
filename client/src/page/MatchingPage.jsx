import React, { useEffect, useState } from "react";
import styles from "../style";
import Navbar from "../components/Navbar";
import {
  complaint,
  discover,
  homelogo,
  logout,
  membership,
} from "../assets/indexAsset";
import DiscoverNewMatch from "./DiscoverNewMatch";
import axios from "axios";
import { Link } from "react-router-dom";

function MatchingPage() {
  const [merryLimit, setMerryLimit] = useState(null);
  const [id, setId] = useState("");
  const [matchList, setMatchList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState([]);
  const [peopleList, setPeopleList] = useState(null);

  const fetchUserProfileData = async () => {
    const id = localStorage.getItem("uid");
    setId(id);
    if (id) {
      try {
        const res = await axios.get(`http://localhost:3000/users/${id}`);
        setProfile(res.data.user.profilePictures[0]);
        // console.log(res.data.billingData.packageData.limit);
        if (Object.keys(res.data.billingData).length > 0) {
          setMerryLimit(res.data.billingData.packageData.limit);
        }
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserProfileData();
  }, []);

  return (
    <>
      <section className="flex flex-col">
        <section className="bg-white w-full">
          <div className={`${styles.flexCenter} `}>
            <nav className={`${styles.boxWidth}`}>
              <Navbar profileUser={profile} />
            </nav>
          </div>
        </section>

        <section className="w-full flex flex-row justify-start ">
          {/* side bar chat */}
          <section className="h-screen w-1/6 flex flex-col justify-start mx-7 gap-7">
            <div className="w-full flex flex-col justify-center items-center pt-10 pb-10  border-b-2">
              <Link to="/matchingpage">
                <img
                  src={discover}
                  alt="logo"
                  className=" cursor-pointer hover:shadow-2xl rounded-xl "
                />{" "}
              </Link>
            </div>

            <div>
              <span className="ml-4  text-gray-800 text-h1 text-xl">
                Merry Match!
              </span>
              <div className="ml-4 flex flex-row h-[80px] mt-3 gap-3 overflow-hidden">
                <img
                  src={membership}
                  alt="membership"
                  className=" focus:bg-gray-100 h-full gap-4 flex justify-start items-center rounded-[20px] object-contain "
                />
                <img
                  src={membership}
                  alt="membership"
                  className=" focus:bg-gray-100 h-full gap-4 flex justify-start items-center rounded-[20px] object-contain "
                />
                <img
                  src={membership}
                  alt="membership"
                  className=" focus:bg-gray-100 h-full gap-4 flex justify-start items-center rounded-[20px] object-contain "
                />
              </div>
            </div>

            <span className="ml-4  text-gray-800 text-h1 text-xl">
              Chat with Merry Match
            </span>
          </section>

          {/* chat & filter*/}
          <section className=" h-screen w-5/6 flex flex-row justify-between">
            <DiscoverNewMatch userId={id} />
          </section>
        </section>
      </section>
    </>
  );
}

export default MatchingPage;
