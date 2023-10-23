import React, { useState, useEffect, useContext } from "react";
import styles from "../style";
import { Navbar, Footer, ProfilePopup } from "../components/indexComponent";
import { photo, x } from "../assets/indexAsset";
import { useUserAuth } from "../context/AuthContext";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../configs/firebase";
import AlertTitle from "@mui/material/AlertTitle";
import { v4 as uuidv4 } from "uuid";

function UserProfile() {
  const {} = useUserAuth();
  const [openModal, setOpenModal] = useState(false);
  const [age, setAge] = useState("");
  const [profile, setProfile] = useState([]);

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
  const [id, setId] = useState("");

  useEffect(() => {
    const fetchUserProfileData = async () => {
      const id = localStorage.getItem("uid");
      setId(id);
      if (id) {
        try {
          const res = await axios.get(`http://localhost:3000/users/${id}`);
          const data = res.data.user;
          setProfile(res.data.user.profilePictures[0]);
          const updatedFormData = {
            name: data.name || "",
            location: data.location || "",
            username: data.username || "",
            password: data.password || "",
            confirmPassword: data.confirmPassword || "",
            dateOfBirth: data.dateOfBirth || "",
            city: data.city || "",
            email: data.email || "",
            sexualIdentities: data.sexualIdentities || "",
            racialPreferences: data.racialPreferences || "",
            sexualPreferences: data.sexualPreferences || "",
            meetingInterests: data.meetingInterests || "",
            hobbies: data.hobbies || [],
            profilePictures: data.profilePictures || [],
          };
          setFormData(updatedFormData);
        } catch (error) {
          console.error("Error fetching user profiles:", error);
        }
      }
    };

    fetchUserProfileData();
    if (isCompleted) {
      fetchUserProfileData();
    }
  }, [isCompleted]);

  function handleKeyDown(e) {
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
    setFormData({
      ...formData,
      profilePictures: formData.profilePictures.filter(
        (picture) => !gallery.includes(picture)
      ),
    });
  }
  const handleFileUpload = (e) => {
    const files = e.target.files;
    const newPictures = Array.from(files);

    const uploadedPictures = newPictures.map((file) =>
      URL.createObjectURL(file)
    );

    setFormData({
      ...formData,
      profilePictures: [...formData.profilePictures, ...uploadedPictures],
    });
  };

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
      }
    } else if (name === "password") {
      if (value.length < 8) {
        error = "password at least 8 characters";
      }
    } else if (name === "username") {
      if (value.length < 6) {
        error = "username at least 6 characters";
      }
    } else if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(value)) {
        error = "Invalid email format";
      }
    } else if (name === "location") {
      if (value.trim() === "") {
        error = "location is required";
      }
    } else if (name === "city") {
      if (value.trim() === "") {
        error = "city is required";
      }
    } else if (name === "sexualIdentities") {
      if (value.trim() === "") {
        error = "sexual identities is required";
      }
    } else if (name === "racialPreferences") {
      if (value.trim() === "") {
        error = "racial preferences is required";
      }
    } else if (name === "sexualPreferences") {
      if (value.trim() === "") {
        error = "sexual preferences is required";
      }
    } else if (name === "meetingInterests") {
      if (value.trim() === "") {
        error = "meeting interests is required";
      }
    } else if (name === "dateOfBirth") {
      if (value.trim() === "") {
        error = "date Of birth is required";
      }
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormError = Object.values(formErrors).every(
      (value) => value === ""
    );

    if (isFormError) {
      try {
        const uploadImg = formData.profilePictures;
        if (uploadImg) {
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

          const updateData = {
            ...formData,
            profilePictures: url,
            age: age,
          };

          await axios.put(`http://localhost:3000/users/${id}`, updateData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else {
          await updateData();
        }

        setIsCompleted(true);
        setTimeout(() => {
          setIsCompleted(null);
        }, 1000);
      } catch (error) {
        setIsCompleted(false);
        setTimeout(() => {
          setIsCompleted(null);
        }, 1000);
      }
    } else {
      console.error("Form contains errors. Please fix them before submitting.");
      alert("Form contains errors. Please fix them before submitting.");
    }
  };

  const updateData = async () => {
    const updateData = {
      ...formData,
      profilePictures: filesUrl,
      age: age,
      password: null,
      confirmPassword: null,
    };

    await axios.put(`http://localhost:3000/users/${id}`, updateData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const calculateAge = (dateOfBirth) => {
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
      <div className="flex flex-col">
        <section className="bg-white w-full">
          <div className={`${styles.flexCenter} `}>
            <nav className={`${styles.boxWidth}`}>
              <Navbar profileUser={profile} />
            </nav>
          </div>
        </section>

        <section className="bg-white w-full">
          <div className="flex justify-center">
            <div className={`${styles.boxWidth}`}>
              <form
                onSubmit={handleSubmit}
                className="w-full px-10 py-8 flex flex-col"
              >
                {/* head section start */}

                <section className="w-full  py-8 flex flex-row ">
                  <div className="w-1/2">
                    <p className="t-beige-700 text-b1 uppercase ">Profile</p>
                    <h2 className="t-purple-500 text-[50px] text-h1">
                      Let’s make profile
                      <br className="sm:block hidden" />
                      to let others know you
                    </h2>{" "}
                  </div>
                  <div className="flex w-1/2 flex-row items-center justify-end gap-4">
                    <div>
                      <ProfilePopup
                        open={openModal}
                        {...formData}
                        onClose={() => setOpenModal(false)}
                      />
                      <button
                        type="button"
                        className="btSecondary py-3 px-8 cursor-pointer"
                        onClick={() => setOpenModal(true)}
                      >
                        Preview Profile
                      </button>
                    </div>
                    <button
                      className="btPrimary py-3 px-8 cursor-pointer"
                      type="submit"
                    >
                      Update Profile
                    </button>
                  </div>
                </section>

                {/* Basic Information */}
                <div className="mb-20">
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
                          // defaultValue={formData.location}
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
                          // defaultValue={formData.city}
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
                          disabled
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`${styles.input} disabled:text-gray-300`}
                          placeholder="name@website.com"
                        />
                        {formErrors.email && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Identities and Interests */}
                <div className="mb-20">
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
                          // defaultValue={formData.sexualIdentities}
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
                          // defaultValue={formData.racialPreferences}
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
                          // defaultValue={formData.sexualPreferences}
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
                          <span
                            className="close"
                            onClick={() => removeTag(index)}
                          >
                            &times;
                          </span>
                        </div>
                      ))}
                      {formData.hobbies.length !== 10 ? (
                        <input
                          onKeyDown={handleKeyDown}
                          type="text"
                          className="tags-input"
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
                {/* Profile pictures*/}
                <p className="t-purple-500 text-[22px] text-h4 ">
                  Profile pictures
                </p>
                <p className="text-[#424C6B] text-[16px] text-p1 mb-5">
                  Upload at least 2 photos
                </p>

                <div className="grid grid-cols-5 gap-4 border-2 rounded-xl py-5">
                  {formData.profilePictures.map((gallery, index) => {
                    return (
                      <div
                        key={index}
                        className="image-preview-container flex justify-center items-center relative"
                      >
                        <div className="bg-primaryGray6 w-[180px] h-[180px] rounded-xl overflow-hidden ">
                          <img
                            className="image-preview object-contain w-[180px] h-[180px] "
                            src={gallery}
                            alt=""
                          />
                          <button
                            type="button"
                            className="z-10 absolute top-[-5px] right-[5px] btPrimary px-2"
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
                      <div className="relative cursor-pointer w-[180px] h-[180px] mx-2 rounded-xl flex flex-col justify-center items-center ">
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
              </form>
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
      </div>
    </>
  );
}

export default UserProfile;
