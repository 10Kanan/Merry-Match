import { useEffect, useState } from "react";
import { bgHome, heroSection, whyMerrySection } from "../assets/indexAsset.js";
import CTA from "../components/CTA.jsx";
import Footer from "../components/Footer.jsx";
import HowToMerry from "../components/HowToMerry.jsx";
import LandingPage from "../components/LandingPage.jsx";
import Navbar from "../components/Navbar.jsx";
import WhyMerry from "../components/WhyMerry.jsx";
import { features } from "../constants/indexConstants.js";
import styles from "../style";
import axios from "axios";
import { useUserAuth } from "../context/AuthContext.jsx";

const Home = () => {
  const [profile, setProfile] = useState([]);
  const { currentUser, isWhoLogin } = useUserAuth();

  useEffect(() => {
    const fetchUserProfileData = async () => {
      const id = localStorage.getItem("uid");
      if (id) {
        try {
          const res = await axios.get(`http://localhost:3000/users/${id}`);
          setProfile(res.data.user.profilePictures[0]);
        } catch (error) {
          console.error("Error fetching user profiles:", error);
        }
      }
    };
    fetchUserProfileData();

    if (isWhoLogin === "user") {
      fetchUserProfileData();
    }
  }, [isWhoLogin, currentUser]);
  return (
    <>
      <div className=" flex flex-col">
        <section className="bg-white w-full z-10 ">
          <div className={`${styles.flexCenter} `}>
            <nav className={`${styles.boxWidth}`}>
              <Navbar profileUser={profile} />
            </nav>
          </div>
        </section>

        <section className={`${styles.flexCenter} bg-home`}>
          <div className={`${styles.boxWidth}`}>
            <LandingPage />
            <div id="whyMerrysection">
              <WhyMerry />
            </div>
            <div id="howToMerrysection">
              <HowToMerry />
            </div>
            <CTA />
          </div>
        </section>

        <section className="bg-[#F6F7FC] w-full ">
          <div className={`${styles.flexCenter} `}>
            <div className={`${styles.boxWidth}`}>
              <Footer />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
