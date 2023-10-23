import React, { useEffect, useState } from "react";
import { Navbar, Footer, ModalCustom } from "../components/indexComponent";
import styles from "../style";
import { allPackage } from "../constants/indexConstants";
import Button from "../components/ButtonCustom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { rightIcon } from "../assets/indexAsset";

function MerryPackage() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState("");
  const [packageList, setPackageList] = useState([]);
  const [profile, setProfile] = useState([]);
  const [packId, setPackId] = useState("");
  const [packName, setPackName] = useState("");
  const [billingId, setBillingId] = useState(null);

  const fetchPackageList = async () => {
    const id = localStorage.getItem("uid");
    setId(id);
    if (id) {
      try {
        const res = await axios.get(`http://localhost:3000/package/showpackages`);
        const data = res.data;
        setPackageList(data);
        console.log(data);
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
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    }
  };

  useEffect(() => {
    fetchPackageList();
    fetchUserProfileData();
  }, []);

  const handleViewClick = (index) => {
    setOpenModal(true);
    setPackId(packageList[index].id);
    setPackName(
      `Do you want to subscribe ${packageList[index].packageName} package?`
    );
    //  setData(matchList[index].data.couple);
    // console.log(data);
  };

  const subscriptionPackage = async () => {
    try {
      const data = {
        userID: id,
        packageID: packId,
        packageStatus: true,
      };
      const res = await axios.post(`http://localhost:3000/billing`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res) {
        navigate(`/merrypackage/subsuccess/${res.data.docID}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubscribeSuccess = () => {
    subscriptionPackage();
  };

  return (
    <>
      <ModalCustom
        page="subscribe"
        open={openModal}
        packageId={packId}
        label="Subscribe Package Confirmation"
        des={packName}
        onClose={() => setOpenModal(false)}
        yesLabel="Yes, I want to subscribe"
        noLabel="No, I dont't"
        onYes={() => handleSubscribeSuccess()}
      />
      <section className="flex flex-col ">
        <section className="bg-white w-full">
          <div className={`${styles.flexCenter} `}>
            <nav className={`${styles.boxWidth}`}>
              <Navbar profileUser={profile} />
            </nav>
          </div>
        </section>

        <section className="bg-white w-full flex justify-center">
          <div className={`${styles.boxWidth}`}>
            <div className="w-full px-10 py-8 flex  flex-col">
              <section className="pt-8 mb-20 w-full">
                <p className="t-beige-700 text-b1 uppercase ">
                  Merry Membership
                </p>
                <h2 className="t-purple-500 text-[50px] text-h1">
                  Be part of Merry Membership <br className="sm:block hidden" />
                  to make more Merry!
                </h2>
              </section>
              <div className="gap-10 flex flex-row items-center justify-center mb-2 ">
                {packageList.map((item, index) => (
                  <div
                    key={index}
                    className="border-2 bg-white rounded-[35px] flex flex-col px-5 py-7 w-full  "
                  >
                    <img
                      src={item.icon}
                      alt="package-icon"
                      className="w-[80px] h-[80] mb-5 "
                    />
                    <div className="flex items-start justify-center flex-col  ">
                      <p className="text-b1 text-bl text-[35px]">
                        {item.packageName}
                      </p>
                      <p className="text-b3 text-[18px] text-[#2A2E3F]">
                        THB {item.price}
                        <span className="text-[16px] text-[#9AA1B9]">
                          /Month
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col items-start justify-center py-5 border-b-2 gap-5">
                      {item.details.map((item, index) => (
                        <div key={index} className=" flex flex-row ">
                          <img src={rightIcon} alt="" />
                          <p className="ml-5 text-[#424C6B] text-b3 text-[16px]">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btSecondary  px-3 py-3 mt-10"
                      onClick={() => handleViewClick(index)}
                    >
                      Choose Package
                    </button>
                  </div>
                ))}
              </div>
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

export default MerryPackage;
