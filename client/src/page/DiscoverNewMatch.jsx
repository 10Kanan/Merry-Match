import React, { useEffect, useState } from "react";
import { userInfo } from "../constants/indexConstants";
import styles from "../style";
import {
  loading2,
  merryButton2,
  merrycomplete,
  nextArrow,
  profileButton,
  rightArrow,
  x2,
} from "../assets/indexAsset";
import ProfilePopup from "../components/ProfilePopup";
import axios from "axios";

const DiscoverNewMatch = ({ userId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [ageRange, setAgeRange] = useState({ min: 18, max: 50 });
  const [merryLimit, setMerryLimit] = useState(null);
  const [id, setId] = useState("");
  const [matchList, setMatchList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [profile, setProfile] = useState([]);
  const [availablePeople, setAvailablePeople] = useState(null);
  const [asCurrentUserMatches, setAsCurrentUserMatches] = useState(null);
  const [asCurrentCoupleMatches, setAsCurrentCoupleMatches] = useState(null);
  const [userInfoFilter, setUserInfoFilter] = useState(null);
  const [merryMatched, setMerryMatched] = useState(null);
  const [like, setLike] = useState(0);

  useEffect(() => {}, [like]);

  useEffect(() => {
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
    const fetchAvaliableUsers = async () => {
      const id = localStorage.getItem("uid");
      if (id) {
        try {
          const res = await axios.get(
            `http://localhost:3000/users/available/${id}`
          );
          setAvailablePeople(res.data);
          console.log(res.data);
          if (res.data) {
            setUserInfoFilter(res.data);
            setAvailablePeople(res.data);
          }
          // if (Object.keys(res.data.billingData).length > 0) {
          //   setMerryLimit(res.data.billingData.packageData.limit);
          // }
        } catch (error) {
          console.error("Error fetching user profiles:", error);
        }
      }
    };

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
            console.log(merryLimit);
          } else {
            setMerryLimit(20);
          }
        } catch (error) {
          console.error("Error fetching user profiles:", error);
        }
      }
    };

    const fetchMatchList = async () => {
      const id = localStorage.getItem("uid");
      if (id) {
        try {
          const res = await axios.get(
            `http://localhost:3000/merrymatching/user/${id}`
          );
          const data = res.data;
          setMatchList(data);
          setAsCurrentUserMatches(getUserMatchIDs(data));
          setAsCurrentCoupleMatches(getCoupleMatchIDs(data));
        } catch (error) {
          console.error("Error fetching user profiles:", error);
        }
      }
    };
    deleteMatchHistory();
    fetchAvaliableUsers();
    fetchUserProfileData();
    fetchMatchList();
    if (like != 0) {
      fetchMatchList();
    }
  }, [like]);

  const getCoupleMatchIDs = (data) => {
    const userMatchIDs = [];

    data.forEach((item) => {
      if (
        item.data &&
        item.data.userMatchID &&
        item.matchType === "userMatch"
      ) {
        userMatchIDs.push({
          id: item.id,

          coupleMatchID: item.data.coupleMatchID,
        });
      }
    });

    return userMatchIDs;
  };

  const getUserMatchIDs = (data) => {
    const coupleMatchIDs = [];

    data.forEach((item) => {
      if (
        item.data &&
        item.data.coupleMatchID &&
        item.matchType === "coupleMatch"
      ) {
        coupleMatchIDs.push({
          id: item.id,
          userMatchID: item.data.userMatchID,
        });
      }
    });

    return coupleMatchIDs;
  };

  const findMatchingIDs = (inputId, dataArray) => {
    const matchingIDs = dataArray
      .filter(
        (item) => item.coupleMatchID === inputId || item.userMatchID === inputId
      )
      .map((item) => item.id);

    return matchingIDs;
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
  //   start search section
  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
    console.log(keyword);
  };

  const handleGenderChange = (event) => {
    const gender = event.target.value;
    setSelectedGenders((prevSelectedGenders) => {
      if (prevSelectedGenders.includes(gender)) {
        return prevSelectedGenders.filter((item) => item !== gender);
      } else {
        return [...prevSelectedGenders, gender];
      }
    });
    console.log(selectedGenders);
  };

  const handleAgeRangeChange = (event) => {
    setAgeRange({
      ...ageRange,
      [event.target.name]: parseInt(event.target.value, 10),
    });
    console.log(ageRange);
  };

  const handleClearFilters = () => {
    setKeyword("");
    setSelectedGenders([]);
    setAgeRange({ min: 18, max: 50 });
    setUserInfoFilter(availablePeople);
  };
  const checkData = () => {
    return console.log(userInfoFilter);
  };

  const handleSearch = () => {
    checkData();
    const filteredUserInfo = availablePeople.filter((user) => {
      console.log(keyword);
      const age = parseInt(user.age, 10);
      const isAgeInRange = age >= ageRange.min && age <= ageRange.max;

      const hasKeywordMatch =
        user.hobbies.some((hobby) =>
          hobby.toLowerCase().includes(keyword.toLowerCase())
        ) ||
        user.meetingInterests.toLowerCase().includes(keyword.toLowerCase());

      const hasSelectedGender =
        selectedGenders.length === 0 ||
        selectedGenders
          .map((gender) => gender.toLowerCase())
          .includes(user.sexualPreferences.toLowerCase());

      return hasKeywordMatch && hasSelectedGender && isAgeInRange;
    });

    if (filteredUserInfo.length === 0) {
      console.log("No matching user found, showing all users");
      setUserInfoFilter(availablePeople);
    } else {
      setUserInfoFilter(filteredUserInfo);
    }
  };

  //   end

  const handleNextProfile = () => {
    setCurrentProfileIndex(0);

    setCurrentIndex((prevIndex) => (prevIndex + 1) % userInfoFilter.length);
  };

  const handleNextProfileImg = () => {
    setCurrentProfileIndex(
      (prevIndex) =>
        (prevIndex + 1) % userInfoFilter[currentIndex].profilePictures.length
    );
  };

  const handlePrevProfileImg = () => {
    setCurrentProfileIndex(
      (prevIndex) =>
        (prevIndex - 1 + userInfoFilter[currentIndex].profilePictures.length) %
        userInfoFilter[currentIndex].profilePictures.length
    );
  };

  const handleLike = async () => {
    const dataId = userInfoFilter[currentIndex].id;
    const matchMeAsUser = findMatchingIDs(dataId, asCurrentUserMatches); //เค้ากดไลก์เรามา
    const matchMeAsCouple = findMatchingIDs(dataId, asCurrentCoupleMatches); //เราเคยกดไลค์เค้าแล้ว
    const num = countUserMatches(matchList);

    console.log(matchMeAsUser, matchMeAsCouple, id, dataId, num, merryLimit);
    if (num <= merryLimit) {
      if (matchMeAsUser.length > 0) {
        const res = await axios.put(
          `http://localhost:3000/merrymatching/usermatch/${matchMeAsUser}`,
          { coupleStatus: true },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res) {
          setMerryMatched(true);
          setTimeout(() => {
            setMerryMatched(null);
            handleNextProfile();
          }, 10000);
          setLike(like + 1);
        }
      } else if (matchMeAsCouple.length > 0) {
        handleNextProfile();
      } else if (matchMeAsUser.length === 0 && matchMeAsCouple.length === 0) {
        const res = await axios.post(
          `http://localhost:3000/merrymatching`,
          { userMatchID: id, coupleMatchID: dataId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res) {
          setLike(like + 1);
          handleNextProfile();
        }
      }
    }
  };

  const handleDislike = () => {
    console.log("Disliked!");
    handleNextProfile();
  };

  const handleNext = () => {
    console.log(currentIndex);
    handleNextProfile();
  };

  return (
    <>
      {/* show data section */}
      {userInfoFilter ? (
        <section className="w-full flex items-center justify-center">
          <div className="discover-new-match-container bg-black text-white h-full w-full  flex  flex-col items-center justify-center ">
            {/* Display user profile */}
            <section className="w-full h-full flex flex-row items-center justify-center z-0 relative overflow-hidden gap-[50px]">
              <p className="text-[#ffffff] top-5 right-5 text-b1 text-[16px] absolute">
                Merry limit today
                <span className="text-[#FF1659] ml-3">
                  {countUserMatches(matchList)}/{merryLimit ? merryLimit : "20"}
                </span>
              </p>
              <div className="profile prev">
                {currentIndex === 0 ? (
                  <img
                    src={
                      userInfoFilter[userInfoFilter.length - 1]
                        .profilePictures[0]
                    }
                    alt=""
                    className="w-[480px] h-[480px] absolute top-[140px] left-[-360px] rounded-[60px] object-contain"
                  />
                ) : (
                  <img
                    src={userInfoFilter[currentIndex - 1].profilePictures[0]}
                    alt="Profile"
                    className="w-[480px] h-[480px] absolute top-[140px] left-[-360px] rounded-[60px] object-contain"
                  />
                )}
              </div>
              <div className="profile current shrink-0 ">
                <div
                  className={` absolute left-[176px] z-10 rounded-[90px] w-[600px] h-[600px] shrink-0 transition-all duration-500 bg-gradient-to-t to-transparent via-transparent from-[#7D2262] opacity-90 cursor-pointer ${
                    merryMatched && "bounce"
                  }`}
                ></div>
                <img
                  src={
                    userInfoFilter[currentIndex].profilePictures[
                      currentProfileIndex
                    ]
                  }
                  className={`w-[600px] h-[600px] object-contain shrink-0 rounded-[90px] ml-10  ${
                    merryMatched && "bounce"
                  }`}
                  alt="Profile"
                />
              </div>
              <div className={`profile next `}>
                {userInfoFilter.length - 1 === currentIndex ? (
                  <>
                    <button type="button" onClick={handleNext}>
                      <img
                        src={userInfoFilter[0].profilePictures[0]}
                        alt="Profile"
                        className={`w-[480px] h-[480px] absolute top-[140px] right-[-360px] rounded-[60px] object-contain`}
                      />
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={handleNext}>
                      <img
                        src={
                          userInfoFilter[currentIndex + 1].profilePictures[0]
                        }
                        alt="Profile"
                        className="w-[480px] h-[480px] absolute top-[140px] right-[-360px] rounded-[60px] object-contain"
                      />
                    </button>
                  </>
                )}
              </div>
              <div className="">
                <ProfilePopup
                  open={openModal}
                  {...userInfoFilter[currentIndex]}
                  onClose={() => setOpenModal(false)}
                />
              </div>
              {/* Navigation buttons */}
              {merryMatched ? (
                <>
                  <img
                    src={merrycomplete}
                    alt=""
                    className={`absolute z-30 bottom-[250px] 
            left-[335px] bounce`}
                  />
                  <button
                    type="button"
                    className={`absolute z-30 bottom-[170px] 
            left-[390px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  cursor-pointer duration-300 btSecondary px-5 py-3 `}
                  >
                    Start Conversation
                  </button>
                </>
              ) : (
                <>
                  <div
                    className="navigation-buttons absolute z-30 bottom-[150px] 
            left-[235px] text-white flex flex-row w-[520px] justify-between"
                  >
                    <div className="flex flex-row items-center gap-5">
                      <div className="teat-h1 text-3xl">
                        {userInfoFilter[currentIndex].name}
                        {userInfoFilter[currentIndex].age}
                      </div>
                      <img
                        onClick={() => setOpenModal(true)}
                        src={profileButton}
                        alt=""
                        className=" cursor-pointer rounded-full w-[50px] h-[25px] pt-1 object-cover bg-white opacity-60 "
                      />
                    </div>
                    <div className="flex flex-row items-center gap-3">
                      <img
                        onClick={handlePrevProfileImg}
                        src={rightArrow}
                        alt=""
                        className="cursor-pointer rounded-lg bg-black opacity-60   px-2 py-1 w-[30px] h-[20px]"
                      />
                      <img
                        onClick={handleNextProfileImg}
                        src={nextArrow}
                        alt=""
                        className="cursor-pointer rounded-lg bg-black opacity-60 px-2 py-1 w-[30px] h-[20px]"
                      />
                    </div>
                  </div>
                  <div className="navigation-buttons absolute z-30 bottom-[25px] left-[375px] text-white flex flex-row gap-6 overflow-hidden ">
                    <img
                      onClick={handleDislike}
                      src={x2}
                      alt=""
                      className="hover:w-[120px] transition duration-500 cursor-pointer object-cover bg-white p-5 w-[100px] h-[100px] rounded-[25px]"
                    />
                    <img
                      onClick={handleLike}
                      src={merryButton2}
                      alt=""
                      className="hover:w-[120px] transition duration-500 cursor-pointer object-cover bg-white p-5 w-[100px] h-[100px]  rounded-[25px] "
                    />
                  </div>
                </>
              )}
            </section>
          </div>
        </section>
      ) : (
        <img className="w-full object-contain" src={loading2} alt="" />
      )}
      {/* filter data section */}
      <section className=" w-3/12 py-20 pt-10 px-10 ">
        <div className="flex-col flex items-start justify-between gap-10">
          <div>
            <p className="text-h1 text-[#191C77] text-lg mb-5">
              Search by Keywords
            </p>
            <input
              type="text"
              placeholder="Search by keywords"
              value={keyword}
              onChange={handleKeywordChange}
              className={`${styles.input}`}
            />
          </div>

          {/* checkbox */}
          <div className=" flex flex-col gap-3 w-full">
            <p className="text-h1 text-[#191C77] text-lg mb-3">
              Sex you interest
            </p>
            <div
              className={`w-full flex-row items-center justify-start flex gap-5 text-b1 text-sm text-[#2A2E3F] `}
            >
              <input
                id="male"
                type="checkbox"
                value="Male"
                checked={selectedGenders.includes("Male")}
                onChange={handleGenderChange}
                className="w-5 h-5 shrink-0 rounded-md appearance-none bg-white border-[#D6D9E4] text-[#A62D82] focus:ring-[#DF89C6]"
              />
              <label htmlFor="male">Male</label>
            </div>
            <div
              className={`w-full flex-row items-center justify-start flex gap-5 text-b1 text-sm text-[#2A2E3F] `}
            >
              <input
                type="checkbox"
                value="Female"
                checked={selectedGenders.includes("Female")}
                onChange={handleGenderChange}
                className="w-5 h-5 shrink-0 rounded-md appearance-none bg-white border-[#D6D9E4] text-[#A62D82] focus:ring-[#DF89C6]"
              />
              <label>Female</label>
            </div>
            <div
              className={`w-full flex-row items-center justify-start flex gap-5 text-b1 text-sm text-[#2A2E3F] `}
            >
              <input
                type="checkbox"
                value="Non-binary"
                checked={selectedGenders.includes("Non-binary")}
                onChange={handleGenderChange}
                className="w-5 h-5 shrink-0 rounded-md appearance-none bg-white border-[#D6D9E4] text-[#A62D82] focus:ring-[#DF89C6]"
              />
              <label>Non-binary</label>
            </div>
          </div>

          {/* age */}
          <p className="text-h1 text-[#191C77] text-lg w-full mb-[-15px]">
            Sex you interest
          </p>
          <div className=" w-full flex-row flex justify-between  items-center gap-3 mb-20">
            <input
              type="number"
              id="minAge"
              name="min"
              max={50}
              min={18}
              value={ageRange.min}
              onChange={handleAgeRangeChange}
              className={`${styles.input} w-20 text-[#9AA1B9]`}
            />
            <p className="text-h1 text-lg">-</p>
            <input
              type="number"
              id="maxAge"
              name="max"
              max={50}
              min={18}
              value={ageRange.max}
              onChange={handleAgeRangeChange}
              className={`${styles.input} w-20 text-[#9AA1B9]`}
            />
          </div>

          {/* button */}
          <div className=" flex flex-row w-full grid-2 items-center justify-center gap-5 pt-10 border-t-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full border-2 rounded-full text-sm text-h1 text-[#C70039] py-2 text-[12px]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSearch}
              className="w-full btPrimary text-sm py-2 text-[12px]"
            >
              Search
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default DiscoverNewMatch;
