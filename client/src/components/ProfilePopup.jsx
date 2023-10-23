import React, { useState } from "react";
import { userInfo } from "../constants/indexConstants";
import {
  disMatchBotton,
  locationLogo,
  merryButton,
  nextArrow,
  photo,
  rightArrow,
  x,
} from "../assets/indexAsset";

function ProfilePopup({
  userID,
  profilePictures,
  name,
  dateOfBirth,
  location,
  city,
  username,
  email,
  sexualIdentities,
  racialPreferences,
  sexualPreferences,
  meetingInterests,
  hobbies,
  open,
  onClose,
  onMatch,
  onNotMatch,
  age,
}) {
  if (!open) return null;
  if (!age) {
    age = "20";
  }

  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const handleNextProfileImg = () => {
    setCurrentProfileIndex(
      (prevIndex) => (prevIndex + 1) % profilePictures.length
    );
  };

  const handlePrevProfileImg = () => {
    setCurrentProfileIndex(
      (prevIndex) =>
        (prevIndex - 1 + profilePictures.length) % profilePictures.length
    );
  };

  return (
    <>
      <section className="relative z-50">
        <div onClick={onClose}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="modalContainer shadow-sm border-gray-200 border hover:shadow-2xl h-[380px] w-[500px]"
          >
            <img
              src={x}
              alt="x"
              className=" w-[25px]  rounded-full hover:shadow-md cursor-pointer fixed top-3 right-4"
              onClick={onClose}
            />

            <div className="w-full flex flex-row mb-7">
              <div className=" relative w-1/2 flex flex-col items-center justify-center">
                {/* Display user profile */}
                {profilePictures.length === 0 ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="mt-7 overflow-hidden absolute top-0 rounded-xl object-fit w-[200px] h-[200px]"
                  />
                ) : (
                  <img
                    src={profilePictures[currentProfileIndex]}
                    alt="Profile"
                    className="mt-7 overflow-hidden absolute top-0 rounded-xl object-fit w-[200px] h-[200px]"
                  />
                )}
                <div className=" flex flex-row absolute bottom-[95px]">
                  <button type="button" onClick={onNotMatch}>
                    <img
                      src={disMatchBotton}
                      alt=""
                      className=" w-[50px] h-[50px] rounded-full  cursor-pointer"
                    />
                  </button>
                  <button type="button" onClick={onMatch}>
                    <img
                      src={merryButton}
                      alt=""
                      className=" w-[50px] h-[50px] rounded-full  cursor-pointer"
                    />
                  </button>
                </div>

                <div className="navigation-buttons flex flex-row justify-between absolute bottom-[90px]">
                  <div className="flex flex-row w-[180px]  justify-between items-center ">
                    <div className="text-b1 text-[12px] text-[#9AA1B9] mt-1">
                      <span className="text-[#646D89]">
                        {currentProfileIndex === 0 &&
                        profilePictures.length === 0
                          ? "0"
                          : currentProfileIndex + 1}
                      </span>
                      /{profilePictures.length}
                    </div>
                    <div>
                      <img
                        onClick={handlePrevProfileImg}
                        src={rightArrow}
                        alt=""
                        className="w-[10px] h-[10px] object-cover"
                      />
                      <img
                        onClick={handleNextProfileImg}
                        src={nextArrow}
                        alt=""
                        className="w-[10px] h-[10px] object-cover ml-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 flex flex-col items-center justify-start">
                <div className="w-full mt-7 ">
                  <h2 className="text-h1 text-[22px] text-black">
                    {name === "" ? "Name" : name}
                    {" ,"}
                    <span className="text-[#646D89]">{age}</span>
                  </h2>
                  <div className="flex flex-row gap-1 items-center mt-1">
                    <img src={locationLogo} alt="" />
                    <span className="text-b1 text-[#646D89] text-[12px]">
                      {city === "" ? "city" : city},
                      {location === "" ? "location" : location}
                    </span>
                  </div>
                </div>
                <div className="w-full mt-7 flex flex-row justify-between">
                  <div className="w-1/2 flex flex-col text-[12px] text-b1 text-[#2A2E3F] gap-3">
                    <div>Sexual identities</div>
                    <div>Sexual preferencess</div>
                    <div>Racial preferences</div>
                    <div>Meeting interests</div>
                  </div>
                  <div className="w-1/2 flex flex-col text-[12px] capitalize text-b1 text-[#646D89] ml-5 gap-3">
                    <div>{sexualIdentities}</div>
                    <div>{sexualPreferences}</div>
                    <div>{racialPreferences}</div>
                    <div>{meetingInterests}</div>
                  </div>
                </div>

                <div className="w-full mt-7">
                  <h3 className="text-h4 text-[15px]">Hobbies and Interests</h3>
                  <div className="flex flex-row gap-2 mt-2 mr-6">
                    {hobbies.map((item, index) => (
                      <div
                        className="text-center leading-none border-[#DF89C6] border-[1px] rounded-md px-2 text-b1 text-[10px] text-[#7D2262] "
                        key={index}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProfilePopup;
