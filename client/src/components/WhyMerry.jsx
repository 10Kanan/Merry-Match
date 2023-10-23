import React from "react";
import styles, { layout } from "../style";
import { home3 } from "../assets/indexAsset";

const WhyMerry = () => {
  return (
    <section className={`${layout.section} mt-10`}>
      <div className={layout.sectionInfo}>
        <h2 id="section1" className="t-purple-300 text-[50px] text-h4">
          Why Merry Match?
        </h2>
        <p
          className={`${styles.paragraph} max-w-[480px] mt-5 text-white text-b1`}
        >
          Merry Match is a new generation of online dating website for everyone
        </p>
        <p
          className={`${styles.paragraph} max-w-[480px] mt-5  text-white text-b3 text-[14px]`}
        >
          Whether you’re committed to dating, meeting new people, expanding your
          social network, meeting locals while traveling, or even just making a
          small chat with strangers.
        </p>
        <p
          className={`${styles.paragraph} max-w-[480px] mt-5  text-white text-b3 text-[14px]`}
        >
          This site allows you to make your own dating profile, discover new
          people, save favorite profiles, and let them know that you’re
          interested
        </p>
      </div>
      <div className={layout.sectionImg}>
        <img src={home3} alt="reason-image" className="w-[100%] h-[100%]" />
      </div>
    </section>
  );
};

export default WhyMerry;
