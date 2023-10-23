import React from "react";
import { features } from "../constants/indexConstants";
import styles from "../style";

const HowToMerry = () => {
  return (
    <section
      id="section2"
      className={`${styles.flexCenter} flex-col pb-[100px] mt-5 `}
    >
      <h2 className="t-purple-300 text-[50px] text-h4 py-10">How to Merry</h2>
      <div className={`${styles.flexCenter} flex-row gap-6 mt-6 ] `}>
        {features.map((item) => (
          <div
            key={item.id}
            className={`${styles.flexCenter} flex-col justify-center gap-2 items-start bg-[#2A0B21] p-10 rounded-[40px] h-[350px] w-[270px]`}
          >
            <img src={item.icon} alt={item.title} />
            <p className=" text-white text-h4 text-[20px] text-center mt-10 ">
              {item.title}
            </p>
            <p className=" text-gray-300 text-b3 text-[14px]  text-center w-[150px]">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowToMerry;
