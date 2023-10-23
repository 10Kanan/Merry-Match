import React, { useState, useEffect } from "react";
import styles from "../style";
import AlertTitle from "@mui/material/AlertTitle";
import { Navbar } from "../components/indexComponent";
import { photo } from "../assets/indexAsset";
import Alert from "@mui/material/Alert";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../configs/firebase";
import { useUserAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const Register = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { signUp, isErrorAuth, setIsErrorAuth } = useUserAuth();
  const [age, setAge] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    username: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    city: "",
    email: "",
    sexualIdentities: "",
    racialPreferences: "",
    sexualPreferences: "",
    meetingInterests: "",
    hobbies: [],
    profilePictures: [],
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    location: "",
    username: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    city: "",
    email: "",
    sexualIdentities: "",
    racialPreferences: "",
    sexualPreferences: "",
    meetingInterests: "",
  });
  const [filesUrl, setFilesUrl] = useState([]);
  const [isCompleted, setIsCompleted] = useState(null);

  useEffect(() => {}, [formData]);

  const formTabs = [
    { key: 1, label: ["Step 2/3", "Basic Information"] },
    { key: 2, label: ["Step 2/3", "Identities and Interests"] },
    { key: 3, label: ["Step 2/3", "Profile Pictures"] },
  ];

  const handleNextTab = () => {
    setActiveTab((prevTab) => prevTab + 1);
  };

  const handlePreviousTab = () => {
    setActiveTab((prevTab) => prevTab - 1);
  };

  function handleKeyDown(e) {
    // e.preventDefault();
    if (e.key !== "Tab") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setFormData({ ...formData, hobbies: [...formData.hobbies, value] });
    e.target.value = "";
  }
  function removeTag(index) {
    setFormData({
      ...formData,
      hobbies: formData.hobbies.filter((_, i) => i !== index),
    });
  }
  function remove(gallery) {
    console.log(gallery);
    setFormData({
      ...formData,
      profilePictures: formData.profilePictures.filter(
        (picture) => !gallery.includes(picture)
      ),
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // validate
    calculateAge(formData.dateOfBirth);
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let error = "";

    if (name === "name") {
      if (value.trim() === "") {
        error = "name is required";
      } else error = "";
    } else if (name === "password") {
      if (value.length < 8) {
        error = "password at least 8 characters";
      } else error = "";
    } else if (name === "username") {
      if (value.length < 6) {
        error = "username at least 6 characters";
      } else error = "";
    } else if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(value)) {
        error = "invalid email format";
      } else error = "";
    } else if (name === "location") {
      if (value.trim() === "") {
        error = "location is required";
      } else error = "";
    } else if (name === "city") {
      if (value.trim() === "") {
        error = "city is required";
      } else error = "";
    } else if (name === "sexualIdentities") {
      if (value.trim() === "") {
        error = "sexual identities is required";
      } else error = "";
    } else if (name === "racialPreferences") {
      if (value.trim() === "") {
        error = "racial preferences is required";
      } else error = "";
    } else if (name === "sexualPreferences") {
      if (value.trim() === "") {
        error = "sexual preferences is required";
      } else error = "";
    } else if (name === "meetingInterests") {
      if (value.trim() === "") {
        error = "meeting interests is required";
      } else error = "";
    } else if (name === "dateOfBirth") {
      if (value.trim() === "") {
        error = "date Of birth is required";
      } else error = "";
    } else if (name === "confirmPassword") {
      if (value !== formData.password) {
        error = "password not match";
      } else error = "";
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    setAge(age);
  }

  const handleFileUpload = (e) => {
    const files = e.target.files;
    const newPictures = Array.from(files).slice(
      0,
      5 - formData.profilePictures.length
    );

    const uploadedPictures = newPictures.map((file) =>
      URL.createObjectURL(file)
    );
    setFormData({
      ...formData,
      profilePictures: [...formData.profilePictures, ...uploadedPictures],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormError = Object.values(formErrors).every(
      (value) => value === ""
    );

    if (isFormError) {
      try {
        const uploadImg = formData.profilePictures;

        const uploadProfilePicturesToFirebase = async (profilePictures) => {
          const downloadURLs = [];

          const uploadTasks = profilePictures.map(async (picture) => {
            const storageRef = ref(
              storage,
              `profilePictures/${formData.username}${uuidv4()}`
            );
            const imageBlob = await fetch(picture).then((response) =>
              response.blob()
            );
            const uploadTask = uploadBytesResumable(storageRef, imageBlob);
            const snapshot = await uploadTask;
            const downloadURL = await getDownloadURL(snapshot.ref);

            downloadURLs.push(downloadURL);
          });

          await Promise.all(uploadTasks);
          return downloadURLs;
        };
        const url = await uploadProfilePicturesToFirebase(uploadImg);

        const registerData = {
          ...formData,
          profilePictures: url,
          age: age,
          password: null,
          confirmPassword: null,
        };
        console.log(registerData);
        await signUp(formData.email, formData.password, registerData);

        setIsCompleted(true);
        setTimeout(() => {
          setIsCompleted(null);
        }, 1000);
      } catch (error) {
        setIsErrorAuth(error.message);
        setIsCompleted(false);
      }
    } else {
      console.error("Form contains errors. Please fix them before submitting.");
      alert("Form contains errors. Please fix them before submitting.");
    }
  };

  const sexualIdentitiesOptions = ["Male", "Female", "Non-binary"];
  const racialPreferencesOptions = [
    "White",
    "Black",
    "Alaska Native",
    "Asian",
    "Native Hawaiian",
  ];
  const sexualPreferencesOptions = ["Male", "Female", "Non-binary"];
  const meetingInterestsOptions = [
    "Friends",
    "Party",
    "Music",
    "Reading",
    "Sports",
    "Cooking",
    "Travel",
  ];
  const countries = ["USA", "UK", "Canada", "Australia"];
  const cities = ["New York", "London", "Toronto", "Sydney"];

  return (
    <>
      <section className="bg-white w-full">
        <div className={`${styles.flexCenter} `}>
          <nav className={`${styles.boxWidth}`}>
            <Navbar />
          </nav>
        </div>
      </section>
      {/* header */}
      <section className="bg-white w-full">
        <div className="flex justify-center">
          <div className={`${styles.boxWidth} `}>
            <div className="w-full ">
              <section className="w-full px-10 py-8 flex flex-row ">
                <div className="w-1/2">
                  <p className="t-beige-700 text-b1 uppercase ">Register</p>
                  <h2 className="t-purple-500 text-[50px] text-h4">
                    Join us and start <br className="sm:block hidden" />{" "}
                    matching
                  </h2>{" "}
                </div>
                <div className="flex w-1/2 flex-row items-center justify-center">
                  {formTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={` ${styles.activeTab} ${
                        activeTab === tab.key
                          ? "w-[220px] h-[90px]"
                          : "w-[90px] h-[90px]"
                      }`}
                    >
                      {/* {`${tab.key} ${activeTab === tab.key ? tab.label : ""}`} */}
                      <div className=" flex flex-row items-center gap-3 justify-center">
                        <div className=" bg-[#F1F2F6] px-5 py-3 rounded-xl text-h1 text-[#A62D82]">{`${tab.key}`}</div>
                        {activeTab === tab.key && (
                          <div className="text-h1 text-[#A62D82] flex flex-col items-start ">
                            <div className="text-[#646D89] text-b1">{`${tab.label[0]}`}</div>
                            <div>{`${tab.label[1]}`}</div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
              {isErrorAuth !== null && isCompleted == null && (
                <Alert
                  severity="error"
                  className="w-full flex items-center justify-center"
                >
                  {isErrorAuth}
                </Alert>
              )}
              {isCompleted === true && (
                <div className="w-full flex items-center justify-center rounded-full">
                  <Alert severity="success">
                    <AlertTitle>Update Success!!</AlertTitle>
                  </Alert>
                </div>
              )}
              {isCompleted === false && (
                <div className="w-full flex items-center justify-center rounded-full">
                  <Alert severity="error">
                    <AlertTitle>Form contain error!!</AlertTitle>
                  </Alert>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* render form */}
      <section className="bg-white w-full">
        <div className="flex justify-center">
          <div className={`${styles.boxWidth}`}>
            <form
              onSubmit={handleSubmit}
              className="w-full px-10 py-8 flex flex-col"
            >
              {/* Basic Information */}
              {activeTab == 1 && (
                <div className="w-full h-[450px]">
                  <p className="t-purple-500 text-[22px] text-h4 mb-5">
                    Basic Information
                  </p>
                  <div className=" flex flex-row">
                    <div className=" flex flex-col w-1/2 pr-5 ">
                      <div className="text-b1 h-[100px]">
                        <h2>Name</h2>
                        <label className="sr-only" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`${styles.input}`}
                          placeholder="Jon Snow"
                        />
                        {formErrors.name && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.name}
                          </p>
                        )}
                      </div>
                      <div className="text-b1 h-[100px]">
                        <h2>Location</h2>
                        <label htmlFor="location" className="sr-only" />
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className={`${styles.input}`}
                          placeholder="Thailand"
                        >
                          <option value="" className=" text-gray-400">
                            Select a Location
                          </option>
                          {countries.map((country) => (
                            <option
                              key={country}
                              value={country}
                              className=" text-gray-900"
                            >
                              {country}
                            </option>
                          ))}
                        </select>
                        {formErrors.location && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.location}
                          </p>
                        )}
                      </div>
                      <div className="text-b1 h-[100px]">
                        <h2>Username</h2>
                        <label htmlFor="username" className="sr-only" />

                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className={`${styles.input}`}
                          placeholder="At least 6 charactor"
                        />
                        {formErrors.username && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.username}
                          </p>
                        )}
                      </div>
                      <div className="text-b1 h-[100px]">
                        <h2>Password</h2>
                        <label htmlFor="password" className="sr-only"></label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`${styles.input}`}
                          placeholder="At least 8 charactor"
                        />
                        {formErrors.password && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.password}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className=" flex flex-col w-1/2 pl-5 ">
                      <div className="h-[100px]">
                        <h2 className="text-b1 ">Date of Birth</h2>
                        <label
                          htmlFor="dateOfBirth"
                          className="sr-only"
                        ></label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={`${styles.input} `}
                          placeholder="Enter your date of birth"
                        />
                        {formErrors.dateOfBirth && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.dateOfBirth}
                          </p>
                        )}
                      </div>

                      <div className="text-b1 h-[100px]">
                        <h2>City</h2>
                        <label htmlFor="city" className="sr-only"></label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`${styles.input}`}
                        >
                          <option value="">Select a city</option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        {formErrors.city && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.city}
                          </p>
                        )}
                      </div>

                      <div className="text-b1 h-[100px]">
                        <h2>Email</h2>
                        <label htmlFor="email" className="sr-only"></label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`${styles.input}`}
                          placeholder="name@website.com"
                        />
                        {formErrors.email && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.email}
                          </p>
                        )}
                      </div>

                      <div className="text-b1 h-[100px]">
                        <h2>Confirm Password</h2>
                        <label
                          htmlFor="confirmPassword"
                          className="sr-only"
                        ></label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`${styles.input}`}
                          placeholder="At least 8 charactor"
                        />
                        {formErrors.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.confirmPassword}
                          </p>
                        )}
                        {/* {formData.password !== formData.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600">
                            password not match
                          </p>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Identities and Interests */}
              {activeTab === 2 && (
                <div className="w-full h-[450px]">
                  <p className="t-purple-500 text-[22px] text-h4 mb-5">
                    Identities and Interests
                  </p>
                  <div className=" flex flex-row">
                    <div className=" flex flex-col w-1/2 pr-5 ">
                      <div className="text-b1 h-[100px]">
                        <h2>Sexual Identities</h2>
                        <label
                          htmlFor="sexualIdentities"
                          className="sr-only"
                        ></label>
                        <select
                          name="sexualIdentities"
                          value={formData.sexualIdentities}
                          onChange={handleChange}
                          className={`${styles.input}`}
                        >
                          <option value="">Select a sexual identity</option>
                          {sexualIdentitiesOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {formErrors.sexualIdentities && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.sexualIdentities}
                          </p>
                        )}
                      </div>

                      <div className="text-b1 h-[100px]">
                        <h2>Racial Preferences</h2>
                        <label
                          htmlFor="racialPreferences"
                          className="sr-only"
                        ></label>
                        <select
                          name="racialPreferences"
                          value={formData.racialPreferences}
                          onChange={handleChange}
                          className={`${styles.input}`}
                        >
                          <option value="">Select a racial preference</option>
                          {racialPreferencesOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {formErrors.racialPreferences && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.racialPreferences}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className=" flex flex-col w-1/2 pl-5 ">
                      <div className="text-b1 h-[100px]">
                        <h2>Sexual Preferences</h2>
                        <label
                          htmlFor="sexualPreferences"
                          className="sr-only"
                        ></label>
                        <select
                          name="sexualPreferences"
                          value={formData.sexualPreferences}
                          onChange={handleChange}
                          className={`${styles.input}`}
                        >
                          <option value="">Select a sexual preference</option>
                          {sexualPreferencesOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {formErrors.sexualPreferences && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.sexualPreferences}
                          </p>
                        )}
                      </div>

                      <div className="text-b1 h-[100px]">
                        <h2>Meeting Interests</h2>
                        <label
                          htmlFor="meetingInterests"
                          className="sr-only"
                        ></label>
                        <select
                          name="meetingInterests"
                          value={formData.meetingInterests}
                          onChange={handleChange}
                          className={`${styles.input}`}
                        >
                          <option value="">Select a meeting interest</option>
                          {meetingInterestsOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {formErrors.meetingInterests && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.meetingInterests}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <h2>Hobbies / Interests</h2>
                    <div className={`${styles.input} `}>
                      {formData.hobbies.map((tag, index) => (
                        <div className="tag-item mr-2" key={index}>
                          <span className="text">{tag}</span>
                          <button
                            type="button"
                            className="close"
                            onClick={() => removeTag(index)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      {formData.hobbies.length !== 10 ? (
                        <input
                          onKeyDown={handleKeyDown}
                          type="text"
                          className=" border-none focus:border-none active:border-none appearance-none "
                          placeholder="Tab to at the new tags..."
                        />
                      ) : (
                        <>
                          <input
                            type="text"
                            className="tags-input"
                            placeholder="Tab to at the new tags..."
                          />
                          <p className="mt-2 text-sm text-red-600">
                            maximum 10 tags
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Profile pictures*/}
              {activeTab === 3 && (
                <div className="w-full h-[450px]">
                  <p className="t-purple-500 text-[22px] text-h4 ">
                    Profile pictures
                  </p>
                  <p className="text-[#424C6B] text-[16px] text-p1 mb-5">
                    Upload at least 2 photos
                  </p>

                  <div className=" flex flex-row gap-2 border-2 rounded-xl py-2 ">
                    {formData.profilePictures.map((gallery, index) => {
                      return (
                        <div
                          key={index}
                          className="image-preview-container flex justify-center items-center relative "
                        >
                          <div className="bg-primaryGray6 w-[150px] h-[150px] rounded-xl mx-2 overflow-hidden ">
                            <img
                              className="image-preview object-contain w-[150px] h-[150px] "
                              src={gallery}
                              alt=""
                            />
                            <button
                              type="button"
                              className="z-10 absolute top-[-5px] right-[0px] btPrimary px-2"
                              onClick={() => remove(gallery)}
                            >
                              x
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {formData.profilePictures.length < 5 ? (
                      <label htmlFor="uploadProfileImage">
                        <div className="relative cursor-pointer w-[150px] h-[150px] mx-2 rounded-xl flex flex-col justify-center items-center ">
                          <img src={photo} alt="" />
                        </div>
                        <input
                          id="uploadProfileImage"
                          name="gallery"
                          type="file"
                          min={2}
                          max={5}
                          onChange={handleFileUpload}
                          hidden
                        />
                      </label>
                    ) : null}
                  </div>
                  {formData.profilePictures.length < 2 &&
                    formData.profilePictures.length !== 0 && (
                      <p className="mt-2 text-sm text-red-600">
                        please upload at least 2 photos!
                      </p>
                    )}
                </div>
              )}
            </form>
            {/* footer */}
            <section className="bg-white w-full border-t-2">
              <div className="flex justify-center">
                <div className="w-full">
                  <div className=" w-full py-6 flex justify-between items-center">
                    <div className=" text-gray-500 px-4 py-2 text-sm">
                      {activeTab}
                      <span className="text-gray-300">/3</span>
                    </div>
                    <div>
                      <div className="flex flex-row gap-5">
                        {activeTab !== 1 ? (
                          <button
                            className="btSecondary py-2 px-6"
                            onClick={handlePreviousTab}
                          >
                            Back
                          </button>
                        ) : (
                          <button
                            className="btGray py-2 px-6"
                            onClick={handlePreviousTab}
                            disabled
                          >
                            Back
                          </button>
                        )}
                        {activeTab === 3 ? (
                          <button
                            className="btPrimary py-2 px-6"
                            onClick={handleSubmit}
                          >
                            Submit
                          </button>
                        ) : (
                          <button
                            className="btPrimary py-2 px-6"
                            onClick={handleNextTab}
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
