import React from "react";
import { socialIcon } from "../constants/indexConstants";
import styles from "../style";
import { homelogo } from "../assets/indexAsset";

function Footer() {
  return (
    <section className={`${styles.flexCenter}  flex-col`}>
      <div className=" border-b-2 mt-10 my-5 flex flex-col items-center justify-center w-[900px] pt-2 pb-10">
        <img src={homelogo} alt="homelogo" className="h-[80px] " />

        <p className="text-b1 text-[#646D89] text-xl mt-2 leading-normal">
          New generation of online dating website for everyone
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-[900px] gap-4 pb-10">
        <p className="text-b1 text-[#9AA1B9] text-sm mt-2 leading-normal">
          copyright ©2022 merrymatch.com All rights reserved
        </p>
        <div className={`${styles.flexCenter} flex-row gap-6`}>
          {socialIcon.map((item) => (
            <img src={item.icon} alt="" key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Footer;
