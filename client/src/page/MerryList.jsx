import React, { useEffect, useState } from "react";
import { matchInfo } from "../constants/indexConstants";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../style";
import {
  chatButton,
  locationLogo,
  merryStatus,
  notMatch,
  profileButton,
  verryButton,
} from "../assets/indexAsset";
import ProfilePopup from "../components/ProfilePopup";
import axios from "axios";

function MerryList() {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState([]);

  const [id, setId] = useState("");
  const [matchList, setMatchList] = useState([]);
  const [matchMessage, setMatchMessage] = useState("");
  const [merryLimit, setMerryLimit] = useState(null);

  const fetchUserProfileData = async () => {
    const id = localStorage.getItem("uid");
    setId(id);
    if (id) {
      try {
        const res = await axios.get(`http://localhost:3000/users/${id}`);
        setProfile(res.data.user.profilePictures[0]);
        console.log(res.data.billingData.packageData.limit);
        if (Object.keys(res.data.billingData).length > 0) {
          setMerryLimit(res.data.billingData.packageData.limit);
        }
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    }
  };

  const fetchMatchList = async () => {
    const id = localStorage.getItem("uid");
    setId(id);
    if (id) {
      try {
        const res = await axios.get(
          `http://localhost:3000/merrymatching/user/${id}`
        );
        const data = res.data;
        setMatchList(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    }
  };

  const deleteMatchHistory = async () => {
    const id = localStorage.getItem("uid");
    if (id) {
      try {
        const res = await axios.delete(`http://localhost:3000/merrymatching`);

        if (res.data) {
          console.log(res.data);
          console.log("deteted");
        }
      } catch (error) {
        console.error("Error delete matching people", error);
      }
    }
  };
  useEffect(() => {
    deleteMatchHistory();
    fetchMatchList();
    fetchUserProfileData();
  }, []);

  const handleViewClick = (index) => {
    setOpenModal(true);
    setData(matchList[index].data.couple);
    // console.log(data);
  };

  const handleVerryClick = async (index) => {
    if (matchList[index].matchType === "userMatch") {
      const status = !matchList[index].data.userMatchStatus; // เปลี่ยนสถานะ

      const data = {
        userMatchStatus: status,
      };

      try {
        await axios.put(
          `http://localhost:3000/merrymatching/usermatchlist/${matchList[index].id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        fetchMatchList();
      } catch (error) {
        console.error("Error updating user match status:", error);
      }
    } else {
      const status = !matchList[index].data.coupleStatus;
      const data = {
        coupleStatus: status,
      };
      try {
        await axios.put(
          `http://localhost:3000/merrymatching/couplematch/${matchList[index].id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        fetchMatchList();
      } catch (error) {
        console.error("Error updating user match status:", error);
      }
    }
  };

  const calculateRemainingHours = () => {
    const now = new Date(); // เวลาปัจจุบัน
    const midnight = new Date(); // เวลาเที่ยงคืนของวันปัจจุบัน
    midnight.setHours(24, 0, 0, 0); // Set เวลาเที่ยงคืน (24:00:00)

    // คำนวณจำนวนชั่วโมงที่เหลือจนถึงเที่ยงคืน
    const remainingHours = Math.ceil((midnight - now) / (1000 * 60 * 60));

    return remainingHours;
  };

  const countUserMatches = (data) => {
    let userMatchCount = 0;

    for (const item of data) {
      if (item.matchType === "userMatch") {
        userMatchCount++;
      }
    }

    return userMatchCount;
  };

  return (
    <>
      <ProfilePopup
        open={openModal}
        {...data}
        onClose={() => setOpenModal(false)}
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
              <section className="pt-8 w-full ">
                <p className="t-beige-700 text-b1 uppercase ">Merry list</p>
                <div className="w-full flex flex-row justify-between">
                  <h2 className="t-purple-500 text-[50px] text-h1">
                    Let’s know each other
                    <br className="sm:block hidden" />
                    with Merry!
                  </h2>
                  <div className=" flex flex-col justify-end items-end mb-3">
                    <p className="text-[#646D89]">
                      Merry limit today
                      <span className="text-[#FF1659] ml-3">
                        {countUserMatches(matchList)}/
                        {merryLimit ? merryLimit : "20"}
                      </span>
                    </p>
                    <p className="text-[#9AA1B9] text-sm">
                      Reset in {calculateRemainingHours()}h...
                    </p>
                  </div>
                </div>
              </section>

              <section className="w-full my-20">
                <div>
                  <div>
                    {matchList.map((item, index) => (
                      <div
                        key={item.id}
                        className="className={`${styles.flexStart} w-full mr-0 border-b-2 py-10 `}"
                      >
                        <div className="flex flex-row justify-between">
                          <div className="w-2/3 flex flex-row">
                            <div className="w-[175px] h-[175px] relative rounded-xl mr-10 overflow-hidden">
                              <img
                                src={item.data.couple.profilePictures[0]}
                                alt=""
                                className=" rounded-xl object-contain w-full h-full "
                              />
                              {item.data.coupleStatus !== false &&
                                item.data.userMatchStatus !== false && (
                                  <div className=" absolute bottom-[-8px] left-[-5px] rounded-xl btSecondary text-[10px] py-2 px-3 ">
                                    Merry today
                                  </div>
                                )}
                            </div>

                            <div className="w-2/3 h-[180px]flex flex-col items-center justify-start">
                              <div className="w-full  ">
                                <div className=" flex flex-row gap-3">
                                  <div>
                                    <h2 className="text-h1 text-[22px]">
                                      {item.data.couple.name}{" "}
                                      <span className="text-[#646D89]">
                                        {item.data.couple.age}
                                      </span>
                                    </h2>
                                  </div>
                                  <div className="flex flex-row gap-1 items-center mt-1">
                                    <img src={locationLogo} alt="" />
                                    <span className="text-b1 text-[#646D89] text-[12px]">
                                      {item.data.couple.city},{" "}
                                      {item.data.couple.location}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="w-full mt-7 flex flex-row justify-between items-center">
                                <div className="w-1/2 flex flex-col text-[14px] text-b1 text-[#2A2E3F] gap-3">
                                  <div>Sexual identities</div>
                                  <div>Sexual preferencess</div>
                                  <div>Racial preferences</div>
                                  <div>Meeting interests</div>
                                </div>
                                <div className="w-1/2 flex flex-col text-[14px] capitalize text-b1 text-[#646D89] ml-5 gap-3">
                                  <div>{item.data.couple.sexualIdentities}</div>
                                  <div>
                                    {item.data.couple.racialPreferences}
                                  </div>
                                  <div>
                                    {item.data.couple.sexualPreferences}
                                  </div>
                                  <div>{item.data.couple.meetingInterests}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className=" flex flex-col items-end gap-5">
                            <div className="mr-2">
                              {item.data.coupleStatus !== false &&
                              item.data.userMatchStatus !== false ? (
                                <img src={merryStatus} alt="match" />
                              ) : (
                                <img src={notMatch} alt="not-match" />
                              )}
                            </div>
                            <div className=" flex flex-row ">
                              {item.data.coupleStatus !== false &&
                              item.data.userMatchStatus !== false ? (
                                <>
                                  <img src={chatButton} alt="chat" />
                                  <button
                                    type="button"
                                    className=" cursor-pointer"
                                    onClick={() => handleViewClick(index)}
                                  >
                                    <img src={profileButton} alt="view" />
                                  </button>
                                  <button
                                    className=" cursor-pointer"
                                    onClick={() => handleVerryClick(index)}
                                  >
                                    <img src={verryButton} alt="match" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className=" cursor-pointer"
                                    onClick={() => handleViewClick(index)}
                                  >
                                    <img src={profileButton} alt="view" />
                                  </button>
                                  <button
                                    className=" cursor-pointer"
                                    onClick={() => handleVerryClick(index)}
                                  >
                                    <img src={verryButton} alt="match" />
                                  </button>
                                </>
                              )}
                            </div>
                            <div className="mr-3">
                              {item.data.coupleStatus === false &&
                                item.data.userMatchStatus === true && (
                                  <>
                                    <p className=" text-sm text-red-600">
                                      waiting for merry!
                                    </p>
                                  </>
                                )}
                              {item.data.coupleStatus === true &&
                                item.data.userMatchStatus === false && (
                                  <>
                                    <p className=" text-sm text-red-600">
                                      wanna merry back?
                                    </p>
                                  </>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
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

export default MerryList;
