import React from "react";

const CustomDropdown = ({ options, onSelect, selectedValue }) => {
  return (
    <select value={selectedValue} onChange={(e) => onSelect(e.target.value)}>
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default CustomDropdown;
