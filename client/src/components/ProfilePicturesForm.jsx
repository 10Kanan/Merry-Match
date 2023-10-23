import React from "react";
import { Controller } from "react-hook-form";

const ProfilePicturesForm = ({ control }) => {
  return (
    <div>
      <h2>Profile Pictures</h2>
      <div>
        <label>Profile Picture URL</label>
        <Controller
          name="profilePictures.profilePictureUrl"
          control={control}
          render={({ field }) => <input {...field} />}
        />
      </div>
    </div>
  );
};

export default ProfilePicturesForm;
