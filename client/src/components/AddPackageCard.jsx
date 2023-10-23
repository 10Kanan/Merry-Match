import React, { useState } from "react";

const AddPackageCard = () => {
  const [packageName, setPackageName] = useState("");
  const [merryLimit, setMerryLimit] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [packageDetails, setPackageDetails] = useState([""]);

  const handlePackageNameChange = (event) => {
    setPackageName(event.target.value);
  };

  const handleMerryLimitChange = (event) => {
    setMerryLimit(event.target.value);
  };

  const handleIconFileChange = (event) => {
    const file = event.target.files[0];
    setIconFile(file);
  };

  const handlePackageDetailChange = (index, event) => {
    const updatedPackageDetails = [...packageDetails];
    updatedPackageDetails[index] = event.target.value;
    setPackageDetails(updatedPackageDetails);
  };

  const handleAddPackageDetail = () => {
    if (packageDetails.length < 5) {
      setPackageDetails([...packageDetails, ""]);
    }
  };

  const handleDeletePackageDetail = (index) => {
    const updatedPackageDetails = [...packageDetails];
    updatedPackageDetails.splice(index, 1);
    setPackageDetails(updatedPackageDetails);
  };

  const handleSubmit = () => {
    // Implement your logic to send the form data to the server
    // This is where you would send the data to the server
    console.log({
      packageName,
      merryLimit,
      iconFile,
      packageDetails,
    });
  };

  return (
    <div>
      <div>
        <label>Package Name:</label>
        <input
          type="text"
          value={packageName}
          onChange={handlePackageNameChange}
          required
        />
      </div>

      <div>
        <label>Merry Limit:</label>
        <input
          type="text"
          value={merryLimit}
          onChange={handleMerryLimitChange}
          required
        />
      </div>

      <div>
        <label>Icon File:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleIconFileChange}
          required
        />
      </div>

      <div>
        {iconFile && (
          <img src={URL.createObjectURL(iconFile)} alt="Icon Preview" />
        )}
      </div>

      <div>
        <label>Package Details:</label>
        {packageDetails.map((detail, index) => (
          <div key={index}>
            <input
              type="text"
              value={detail}
              onChange={(event) => handlePackageDetailChange(index, event)}
              required
            />
            {packageDetails.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeletePackageDetail(index)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddPackageDetail}>
          Add Package Detail
        </button>
      </div>

      <button type="button" onClick={handleSubmit}>
        Create
      </button>
    </div>
  );
};

export default AddPackageCard;
