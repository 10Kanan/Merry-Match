import React, { useState } from "react";

const ComplaintHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <section className="flex justify-between items-center">
      <div>
        <h1>Complaint list</h1>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select value={selectedStatus} onChange={handleStatusChange}>
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
          <option value="Cancel">Cancel</option>
        </select>
      </div>
    </section>
  );
};

export default ComplaintHeader;
