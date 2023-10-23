import React, { useEffect, useState } from "react";
import { Sidebar } from "./indexPage";
import styles from "../style";
import { arrow_back, dragIcon, updateIcon } from "../assets/indexAsset";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../configs/firebase";
import AlertTitle from "@mui/material/AlertTitle";
import { v4 as uuidv4 } from "uuid";
import { ModalCustom } from "../components/indexComponent";

function AdminPackageEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    icon: "",
    limit: "",
    packageName: "",
    details: [],
    price: "",
  });
  const [formErrors, setFormErrors] = useState({
    icon: "",
    limit: "",
    packageName: "",
    details: [],
    price: "",
  });
  const [detailsAdd, setDetailsAdd] = useState([]);
  const [isOpenAddDetails, setIsOpenAddDetails] = useState(false);
  const [isCompleted, setIsCompleted] = useState(null);

  useEffect(() => {
    const fetchPackageData = async () => {
      const id = localStorage.getItem("uid");
      if (id) {
        try {
          const res = await axios.get(
            `http://localhost:3000/package/${params.packageId}`
          );

          if (Object.keys(res.data).length > 0) {
            // console.log(res.data);
            setFormData(res.data);
            setDetailsAdd(res.data.details);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchPackageData();
  }, []);

  const handleKeyDown = (e) => {
    e.preventDefault();

    const value = e.target.value;
    if (e.key === "Enter") {
      e.preventDefault();
      setDetailsAdd((prevDetails) => [...prevDetails, value]);
      e.target.value = "";
      setIsOpenAddDetails(false);
    }
    if (e.key !== "Enter") return;
    if (!value.trim()) return;
  };

  const handleDetailsChange = (e, index) => {
    const updatedDetails = [...detailsAdd];
    updatedDetails[index] = e.target.value;
    setDetailsAdd(updatedDetails);
  };

  const removeDetail = (index) => {
    setDetailsAdd((prevDetails) => prevDetails.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;

    if (files.length > 0) {
      const uploadedPictures = URL.createObjectURL(files[0]);

      setFormData({
        ...formData,
        icon: uploadedPictures,
      });
    }
  };

  const removeIcon = () => {
    setFormData({
      ...formData,
      icon: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // validate
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let error = "";

    if (name === "packageName") {
      if (value.trim() === "") {
        error = "Package name is required";
      }
    } else if (name === "limit") {
      if (value.trim() === "") {
        error = "limit is required";
      }
    } else if (name === "icon") {
      if (value.length === 0) {
        error = "icon is required";
      }
    } else if (name === "details") {
      if (value.length === 0) {
        error = "details is required";
      }
    } else if (name === "price") {
      if (value.trim() === "") {
        error = "price is required";
      }
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const deletePackage = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/package/${params.packageId}`
      );
      console.log(res);
      if (res.status === 204) {
        console.log("delete successfully");
        setOpenModal(false);
        navigate("/adminpackagelist");
      } else if (res.status === 400) {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadImg = formData.icon;
      const uploadIconToFirebase = async (icon) => {
        const storageRef = ref(
          storage,
          `icon/${formData.packageName}/${uuidv4()}`
        );
        const imageBlob = await fetch(icon).then((response) => response.blob());
        const uploadTask = uploadBytesResumable(storageRef, imageBlob);
        const snapshot = await uploadTask;
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      };
      const url = await uploadIconToFirebase(uploadImg);
      const data = {
        ...formData,
        details: detailsAdd,
        icon: url,
      };
      await axios.put(
        `http://localhost:3000/package/${params.packageId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("submitted");
      setIsCompleted(true);
      setTimeout(() => {
        setIsCompleted(null);
        navigate("/adminpackagelist");
      }, 1000);
    } catch (error) {
      setIsCompleted(false);
      setTimeout(() => {
        setIsCompleted(null);
      }, 3000);
    }
  };

  return (
    <>
      <div className="relative z-10">
        <ModalCustom
          open={openModal}
          label="Delete Confirmation"
          des="Do you sure to delete this Package?"
          onClose={() => setOpenModal(false)}
          yesLabel="Yes, I want to delete"
          noLabel="No, I don’t want"
          onYes={() => deletePackage()}
        />
      </div>

      <section className="flex flex-row justify-between items-start">
        <Sidebar />

        <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
          <section className={`bg-[#F1F2F6]`}>
            <div>
              <section
                className={` ${styles.paddingMin} bg-white flex flex-row justify-between items-center `}
              >
                <button
                  type="button"
                  className=" cursor-pointer flex flex-row gap-2 text-gray-800 text-h1 text-xl"
                  onClick={() => navigate("/adminpackagelist")}
                >
                  <img src={arrow_back} alt="" className="" />{" "}
                  <span>{formData.packageName}</span>
                </button>

                <div className="w-1/6  gap-3 flex flex-row justify-end items-center">
                  <button
                    type="button"
                    className="btSecondary px-2 py-3 w-1/2 text-[14px] cursor-pointer"
                    onClick={() => navigate("/adminpackagelist")}
                  >
                    Cancel
                  </button>
                  <button
                    className="btPrimary px-2 py-3 w-1/2 text-[14px]"
                    type="submit"
                  >
                    Edit
                  </button>
                </div>
              </section>
              {isCompleted === true && (
                <div className=" top-[12%] right-[35%] flex items-center justify-center rounded-full absolute">
                  <Alert severity="success">
                    <AlertTitle>Update Success!!</AlertTitle>
                  </Alert>
                </div>
              )}
              {isCompleted === false && (
                <div className=" top-[12%] right-[35%] flex items-center justify-center rounded-full absolute">
                  <Alert severity="error">
                    <AlertTitle>Form contain error!!</AlertTitle>
                  </Alert>
                </div>
              )}
              <section
                className={`m-[90px] pb-5 flex items-center justify-center flex-col`}
              >
                <div
                  className="w-full rounded-[30px] bg-white 
                 flex flex-col items-start justify-start border-2 p-[90px] gap-10"
                >
                  <div className="w-full flex flex-col items-start justify-start ">
                    <div className="w-full flex flex-row justify-between  items-center gap-10">
                      <div className="w-1/2 text-b1 h-[100px]">
                        <h2>Package name *</h2>
                        <label className="sr-only" />
                        <input
                          required
                          type="text"
                          name="packageName"
                          value={formData.packageName}
                          onChange={handleChange}
                          className={`${styles.input}`}
                          placeholder="Basic..."
                        />
                        {formErrors.packageName && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.packageName}
                          </p>
                        )}
                      </div>
                      <div className="w-1/2 text-b1 h-[100px]">
                        <h2>Merry limit *</h2>
                        <label htmlFor="limit" className="sr-only" />
                        <input
                          required
                          min={0}
                          type="number"
                          name="limit"
                          value={formData.limit}
                          onChange={handleChange}
                          className={`${styles.input}`}
                          placeholder="Put the limit number..."
                        />
                        {formErrors.limit && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.limit}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-1/12 text-b1 h-[100px]">
                      <h2>Price *</h2>
                      <label className="sr-only" />
                      <input
                        required
                        type="number"
                        name="price"
                        min={0}
                        value={formData.price}
                        onChange={handleChange}
                        className={`${styles.input}`}
                        placeholder="10..."
                      />
                      {formErrors.price && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.price}
                        </p>
                      )}
                    </div>
                    <div className="mb-8">
                      <p className="text-b1">Icon *</p>
                      <div className="border-2 rounded-xl object-contain w-[100px] h-[100px]">
                        {formData.icon.length === 0 ? (
                          <label htmlFor="uploadIcon">
                            <div className="relative cursor-pointer rounded-xl flex flex-col justify-center items-center ">
                              <img src={updateIcon} alt="uploadIcon" />
                            </div>
                            <input
                              required
                              id="uploadIcon"
                              name="icon"
                              type="file"
                              max={1}
                              onChange={handleFileUpload}
                              hidden
                            />
                          </label>
                        ) : (
                          <>
                            <div className=" flex justify-center items-center relative z-0">
                              <div className="bg-primaryGray6 rounded-xl overflow-hidden ">
                                <img
                                  className=" object-contain  "
                                  src={formData.icon}
                                  alt=""
                                />

                                <button
                                  className="z-10 absolute top-[-5px] right-[-5px] btPrimary px-2"
                                  onClick={() => removeIcon()}
                                  type="button"
                                >
                                  x
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {formData.icon.length === 0 && (
                        <p className="mt-2 text-sm text-red-600">
                          please upload icon
                        </p>
                      )}
                    </div>

                    <p className="text-b1 text-[#646D89] text-xl border-t-2 py-5 w-full">
                      Package Detail
                    </p>

                    <div className=" w-full flex flex-col items-start justify-start gap-3">
                      {detailsAdd.length > 0 &&
                        detailsAdd.map((item, index) => (
                          <div key={index} className="w-full">
                            <div className=" flex-row flex items-center justify-between gap-2 w-full">
                              <img
                                src={dragIcon}
                                alt=""
                                className="pl-3 w-[30px] h-[25px]"
                              />
                              <div className=" w-5/6">
                                <div className="text-b1 h-[70px] ">
                                  <h2>Detail *</h2>
                                  <label className="sr-only" />
                                  <input
                                    required
                                    type="text"
                                    name="details"
                                    value={item}
                                    onChange={(e) =>
                                      handleDetailsChange(e, index)
                                    }
                                    className={`${styles.input}`}
                                    placeholder="Place the description..."
                                  />
                                  {formErrors.details && (
                                    <p className="mt-2 text-sm text-red-600">
                                      {formErrors.details}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <button
                                className="text-[#C70039] text-b1 border-2 px-5 py-1 rounded-xl mt-4"
                                onClick={() => removeDetail(index)}
                                type="button"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}

                      <div className="w-full">
                        {detailsAdd.length === 0 && (
                          <div className=" flex-row flex items-center justify-between gap-2 w-full">
                            <img
                              src={dragIcon}
                              alt=""
                              className="pl-3 w-[30px] h-[25px]"
                            />
                            <div className=" w-5/6">
                              <div className="text-b1 h-[70px] ">
                                <h2>Detail *</h2>
                                <label className="sr-only" />
                                <input
                                  required
                                  type="text"
                                  name="details"
                                  onKeyDown={handleKeyDown}
                                  className={`${styles.input}`}
                                  placeholder="Place the description..."
                                />
                                {formErrors.details && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {formErrors.details}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              className="text-[#C70039] text-b1 border-2 px-5 py-1 rounded-xl mt-4 disabled:text-[#C8CCDB]"
                              type="button"
                              disabled
                            >
                              Delete
                            </button>
                          </div>
                        )}

                        {isOpenAddDetails && (
                          <div className=" flex-row flex items-center justify-between gap-2 w-full">
                            <img
                              src={dragIcon}
                              alt=""
                              className="pl-3 w-[30px] h-[25px]"
                            />
                            <div className=" w-5/6">
                              <div className="text-b1 h-[70px] ">
                                <h2>Detail *</h2>
                                <label className="sr-only" />
                                <input
                                  required
                                  type="text"
                                  name="details"
                                  onKeyDown={handleKeyDown}
                                  // value={formData.details}
                                  // onChange={handleChange}
                                  className={`${styles.input}`}
                                  placeholder="Place the description..."
                                />
                                {formErrors.details && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {formErrors.details}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              className="text-[#C70039] text-b1 border-2 px-5 py-1 rounded-xl mt-4 disabled:text-[#C8CCDB]"
                              type="button"
                              disabled
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <button
                          className="btSecondary text-b4 text-[14px] px-3 py-2 mt-3 "
                          type="Button"
                          onClick={() => setIsOpenAddDetails(true)}
                        >
                          + Add Detail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-h4 hover:underline text-[18px] text-[#646D89] flex items-center w-full justify-end mt-3 "
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  Delete Package
                </button>
              </section>
            </div>
          </section>
        </form>
      </section>
    </>
  );
}

export default AdminPackageEdit;
