import React, { useState } from "react";
import { Controller } from "react-hook-form";
import CustomDropdown from "./CustomDropdown";

const IdentitiesInterestsForm = ({ control }) => {
  const [hobbiesInterests, setHobbiesInterests] = useState([""]);

  const handleHobbiesInterestsChange = (index, value) => {
    const updatedHobbiesInterests = [...hobbiesInterests];
    updatedHobbiesInterests[index] = value;
    setHobbiesInterests(updatedHobbiesInterests);
  };

  const handleAddHobbiesInterests = () => {
    if (hobbiesInterests.length < 10) {
      setHobbiesInterests([...hobbiesInterests, ""]);
    }
  };

  const handleRemoveHobbiesInterests = (index) => {
    const updatedHobbiesInterests = [...hobbiesInterests];
    updatedHobbiesInterests.splice(index, 1);
    setHobbiesInterests(updatedHobbiesInterests);
  };

  return (
    <div>
      <h2>Identities and Interests</h2>
      <div>
        <label>Sexual Identities</label>
        <Controller
          name="identitiesInterests.sexualIdentities"
          control={control}
          render={({ field }) => (
            <CustomDropdown
              options={["Option 1", "Option 2", "Option 3"]} // Replace with your options
              onSelect={(value) => field.onChange(value)}
              selectedValue={field.value}
            />
          )}
        />
      </div>
      <div>
        <label>Racial Preferences</label>
        <Controller
          name="identitiesInterests.racialPreferences"
          control={control}
          render={({ field }) => (
            <CustomDropdown
              options={["Option A", "Option B", "Option C"]} // Replace with your options
              onSelect={(value) => field.onChange(value)}
              selectedValue={field.value}
            />
          )}
        />
      </div>
      <div>
        <label>Sexual Preferences</label>
        <Controller
          name="identitiesInterests.sexualPreferences"
          control={control}
          render={({ field }) => (
            <CustomDropdown
              options={["Option X", "Option Y", "Option Z"]} // Replace with your options
              onSelect={(value) => field.onChange(value)}
              selectedValue={field.value}
            />
          )}
        />
      </div>
      <div>
        <label>Meeting Interests</label>
        <Controller
          name="identitiesInterests.meetingInterests"
          control={control}
          render={({ field }) => (
            <CustomDropdown
              options={[
                "Meeting Option 1",
                "Meeting Option 2",
                "Meeting Option 3",
              ]} // Replace with your options
              onSelect={(value) => field.onChange(value)}
              selectedValue={field.value}
            />
          )}
        />
      </div>
      <div>
        <label>Hobbies/Interests</label>
        {hobbiesInterests.map((hobby, index) => (
          <div key={index}>
            <input
              type="text"
              value={hobby}
              onChange={(e) =>
                handleHobbiesInterestsChange(index, e.target.value)
              }
            />
            <button onClick={() => handleRemoveHobbiesInterests(index)}>
              Remove
            </button>
          </div>
        ))}
        {hobbiesInterests.length < 10 && (
          <button onClick={handleAddHobbiesInterests}>
            Add Hobby/Interest
          </button>
        )}
      </div>
    </div>
  );
};

export default IdentitiesInterestsForm;
