import React, { useEffect, useMemo, useState } from "react";
import styles from "../style";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deletepink, edit } from "../assets/indexAsset";
import axios from "axios";
import { ModalCustom } from "./indexComponent";

function AdminPackageCard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [packageList, setPackageList] = useState(null);
  const [filteredPackages, setFilteredPackages] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [packageID, setDeletePackID] = useState(null);
  const [fetchRequest, setFetchRequest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageData = async () => {
      const id = localStorage.getItem("uid");
      if (id) {
        try {
          const res = await axios.get(`http://localhost:3000/package`);

          if (Object.keys(res.data).length > 0) {
            setPackageList(res.data);
            setFilteredPackages(res.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchPackageData();

    if (fetchRequest) {
      fetchPackageData();
      setFetchRequest(false);
    }
  }, [fetchRequest]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSearch = (query) => {
    const filteredPackages = packageList.filter((item) =>
      item.packageName.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredPackages(filteredPackages);
  };

  const convertTime = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(2);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${day}/${month}/${year} ${formattedHours}:${minutes}${amOrPm}`;
  };

  const deletePackage = async () => {
    try {
      if (packageID) {
        const res = await axios.delete(
          `http://localhost:3000/package/${packageID}`
        );
        if (res) {
          setOpenModal(false);
          setFetchRequest(true);
        }
      } else {
        console.log("PackageID notfound");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePackage = async () => {
    deletePackage();
  };
  return (
    <div>
      <ModalCustom
        open={openModal}
        label="Delete Confirmation"
        des="Do you sure to delete this Package?"
        onClose={() => setOpenModal(false)}
        yesLabel="Yes, I want to delete"
        noLabel="No, I don’t want"
        onYes={() => handleDeletePackage()}
      />
      <section
        className={` ${styles.paddingMin} bg-white flex flex-row justify-between items-center `}
      >
        <p className="ml-4  text-gray-800 text-h1 text-xl">Merry Package</p>
        <div className="w-1/2 gap-3 flex flex-row justify-end items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`${styles.input} `}
          />
          <Link to="/adminpackagelist/add">
            <button className="btPrimary w-[150px] px-2 py-3 text-[14px]">
              + Add Package
            </button>
          </Link>
        </div>
      </section>

      <section className={`mx-16 mt-16 pb-20`}>
        <ul className="p-0 rounded-[30px] bg-white ">
          <li className="flex bg-[#D6D9E4] text-[#424C6B] p-3 rounded-t-[30px] text-b1 ">
            <div className="w-1/6 pl-5 flex items-center justify-center">
              Icon
            </div>
            <div className="w-1/6 ">Package name</div>
            <div className="w-1/6">Merry limit</div>
            <div className="w-1/6">Created date</div>
            <div className="w-1/6">Updated date</div>
            <div className="w-1/6"></div>
          </li>
          {!filteredPackages ||
            filteredPackages.map((item, index) => (
              <li
                key={index}
                className="flex p-3 border-t border-gray-300 cursor-pointer text-b4 "
                //   onClick={() => handleitemClick(item)}
              >
                <div className="w-1/6 pl-5 py-2 flex items-center justify-center">
                  <img
                    src={item.icon}
                    alt=""
                    className="w-[40px] h-[40px] object-contain rounded-md border-none"
                  />
                </div>
                <div className="w-1/6 py-2 text-ellipsis truncate  overflow-hidden ...">
                  {item.packageName}
                </div>
                <div className="w-1/6 py-2 text-ellipsis truncate  overflow-hidden ...">
                  {item.limit}
                </div>
                <div className="w-1/6 py-2">
                  {convertTime(item.createdDate)}
                </div>
                {!item.updatedDate ? (
                  <div className="w-1/6 py-2"></div>
                ) : (
                  <div className="w-1/6 py-2">
                    {convertTime(item.updatedDate)}
                  </div>
                )}

                <div className="w-1/6 py-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenModal(true);
                      setDeletePackID(item.id);
                    }}
                  >
                    <img
                      src={deletepink}
                      alt=""
                      className="hover:w-[40px]  transition duration-500 cursor-pointer rounded-md"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/adminpackagelist/edit/${item.id}`)
                    }
                  >
                    <img
                      src={edit}
                      alt=""
                      className="hover:w-[40px] transition duration-500 cursor-pointer rounded-md"
                    />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminPackageCard;
