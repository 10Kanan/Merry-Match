import React from "react";
import styles from "../style";
import { home1, home2 } from "../assets/indexAsset";
import Button from "./ButtonCustom";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <section className="relative overflow-hidden py-36 pb-[220px]">
      <img src={home1} alt="" className=" w-[375px] absolute bottom-0 left-0" />
      <img
        src={home2}
        alt=""
        className=" w-[365px] absolute top-[-11%] right-0"
      />
      <div className={`${styles.flexCenter} flex-col text-white gap-5 `}>
        <div className="w-[325px]">
          <p className="text-center text-h1 text-[60px]">
            Make the
            <br />
            first ‘Merry’
          </p>
          <div className="text-center mt-8 text-[19px] text-b1">
            If you feel lonely, let’s start meeting
            <p>new people in your area!</p>
            Dont’t forget to get Merry with us
          </div>
          <div className={`${styles.flexCenter} mt-16`}>
            <Link to="/matchingpage">
              <Button label="Start matching!" isStyle={"btPrimary py-3 px-6"} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
