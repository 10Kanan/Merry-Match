import React from "react";
import { Controller } from "react-hook-form";

const BasicInformationForm = ({ control }) => {
  return (
    <div>
      <h2 className="t-purple-500 text-[50px] text-h1">Basic Information </h2>{" "}
      <div>
        <div>
          {/* left */}
          <div>
            <label>First Name</label>
            <Controller
              name="basicInfo.firstName"
              control={control}
              render={({ field }) => <input {...field} />}
            />
          </div>
          <div>
            <label>Last Name</label>
            <Controller
              name="basicInfo.lastName"
              control={control}
              render={({ field }) => <input {...field} />}
            />
          </div>
        </div>

        <div>{/* right */}</div>
      </div>
    </div>
  );
};

export default BasicInformationForm;
