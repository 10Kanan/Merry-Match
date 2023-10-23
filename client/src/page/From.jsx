// Form.js
import React, { useState, useEffect } from "react";

const countries = ["USA", "UK", "Canada", "Australia"];
const cities = ["New York", "London", "Toronto", "Sydney"];

const Form = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const selectedFiles = files.slice(0, 5); // สูงสุด 5 รูป
    const uploadedPictures = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setFormData({
      ...formData,
      profilePictures: uploadedPictures,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const isPasswordMatch = () => {
    return formData.password === formData.confirmPassword;
  };

  const isFormValid = () => {
    return (
      formData.name !== "" &&
      formData.location !== "" &&
      formData.username.length > 6 &&
      formData.password.length > 8 &&
      isPasswordMatch() &&
      formData.dateOfBirth !== "" &&
      formData.city !== "" &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.sexualIdentities !== "" &&
      formData.racialPreferences !== "" &&
      formData.sexualPreferences !== "" &&
      formData.meetingInterests !== "" &&
      formData.hobbies.length <= 10
    );
  };

  useEffect(() => {
    console.log("Form data changed:", formData);
  }, [formData]);

  const sexualIdentitiesOptions = ["Interest 1", "Interest 2", "Interest 3"];
  const racialPreferencesOptions = ["Interest 1", "Interest 2", "Interest 3"];
  const sexualPreferencesOptions = ["Interest 1", "Interest 2", "Interest 3"];
  const meetingInterestsOptions = ["Interest 1", "Interest 2", "Interest 3"];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      setFormData((prevFormData) => ({
        ...prevFormData,
        hobbies: [...prevFormData.hobbies, e.target.value.trim()],
      }));
      e.target.value = "";
    }
  };

  const handleRemoveHobby = (index) => {
    const updatedHobbies = [...formData.hobbies];
    updatedHobbies.splice(index, 1);
    setFormData({
      ...formData,
      hobbies: updatedHobbies,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Location:
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
        >
          <option value="">Select a location</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Confirm Password:
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Date of Birth:
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        City:
        <select name="city" value={formData.city} onChange={handleChange}>
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <label>
        Sexual Identities:
        <select
          name="sexualIdentities"
          value={formData.sexualIdentities}
          onChange={handleChange}
        >
          <option value="">Select a sexual identity</option>
          {sexualIdentitiesOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Racial Preferences:
        <select
          name="racialPreferences"
          value={formData.racialPreferences}
          onChange={handleChange}
        >
          <option value="">Select a racial preference</option>
          {racialPreferencesOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Sexual Preferences:
        <select
          name="sexualPreferences"
          value={formData.sexualPreferences}
          onChange={handleChange}
        >
          <option value="">Select a sexual preference</option>
          {sexualPreferencesOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Meeting Interests:
        <select
          name="meetingInterests"
          value={formData.meetingInterests}
          onChange={handleChange}
        >
          <option value="">Select a meeting interest</option>
          {meetingInterestsOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <br />

      <label>
        Hobbies / Interests (Maximum 10):
        <textarea
          name="hobbies"
          onKeyDown={handleKeyDown}
          placeholder="Press Enter to add a hobby/interest"
        />
      </label>
      <div className="hobbies-container">
        {formData.hobbies.map((hobby, index) => (
          <div key={index} className="hobby-item">
            {hobby}
            <button type="button" onClick={() => handleRemoveHobby(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <label>
        Profile Pictures (2-5 images):
        <input
          type="file"
          name="profilePictures"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
        />
      </label>
      <div className="profile-pictures-preview">
        {formData.profilePictures.map((picture, index) => (
          <img key={index} src={picture} alt={`Profile Picture ${index + 1}`} />
        ))}
      </div>
      <br />
      <br />

      <button type="submit" disabled={!isFormValid()}>
        Submit
      </button>
    </form>
  );
};

export default Form;
