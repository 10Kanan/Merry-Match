import React, { useEffect, useState } from "react";
import { navProfileLinks } from "../constants/indexConstants";
import Button from "./ButtonCustom";
import { homelogo, loading, logout, moreIcon } from "../assets/indexAsset";
import { Link } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";
const Navbar = ({ profileUser }) => {
  const { currentUser, logOut } = useUserAuth();
  const [toggle, setToggle] = useState(true);

  useEffect(() => {}, [profileUser]);
  return (
    <nav className=" w-full py-6 flex justify-between items-center">
      <div>
        <Link to="/">
          <img src={homelogo} alt="homelogo" />
        </Link>
      </div>
      <div className="flex flex-row gap-10">
        <ul className="flex flex-row gap-10 text-h4 items-center t-purple-800 text-xl">
          <li>
            <a href="/#whyMerrysection">Why Merry Match?</a>
          </li>
          <li>
            <a href="/#howToMerrysection">How to Merry</a>
          </li>
        </ul>
        {currentUser === true ? (
          <div className="flex justify-center items-end gap-4 relative">
            <img
              src={!profileUser ? loading : profileUser}
              // src={userData.user.profilePictures[0]}
              alt="profile"
              className="w-[60px] h-[60px] object-contain rounded-full "
              onClick={() => setToggle(!toggle)}
            />

            <div
              className={`${
                toggle ? "hidden" : "flex"
              } p-4 bg-white shadow-sm border-2 absolute z-50 top-14 right-[-90px] mx-4 my-2 min-w-[220px] rounded-xl `}
            >
              <div className=" flex flex-col gap-4 text-b1 text-[#646D89]">
                <Link to="/merrypackage">
                  <Button
                    label="More limit Merry!"
                    iconURL={moreIcon}
                    isStyle={"bg-gradient-radial px-4 py-3 text-white"}
                  />
                </Link>

                {navProfileLinks.map((item) => (
                  <div key={item.id}>
                    <Link
                      to={item.path}
                      className={`flex flex-row gap-4 items-center`}
                    >
                      <img
                        src={item.icon}
                        alt={item.title}
                        className=" w-[20px] h-[20px] "
                      />
                      <p>{item.title}</p>
                    </Link>
                  </div>
                ))}
                <hr />
                <div
                  className={`flex flex-row gap-4 items-center cursor-pointer`}
                >
                  <img
                    src={logout}
                    alt="Logout"
                    className=" w-[20px] h-[20px] cursor-pointer"
                  />
                  <p
                    onClick={() => {
                      logOut();
                    }}
                  >
                    Log out
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login">
              <Button label="Login" isStyle={"btPrimary py-3 px-6"} />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
