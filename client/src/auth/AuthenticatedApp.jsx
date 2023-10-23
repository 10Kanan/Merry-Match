import React from "react";
import {
  Home,
  MerryPackage,
  UserProfile,
  Complaint,
  MatchingPage,
  Membership,
  AdminPackageList,
  AdminPackageAdd,
  AdminPackageEdit,
  PaymentSuccess,
  Chat,
  ComplaintList,
  ComplaintDetail,
} from "../page/indexPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";
import MerryList from "../page/MerryList";
import ComplaintResolve from "../page/ComplaintResolve";
import ComplaintCancel from "../page/ComplaintCancel";

function AuthenticatedApp() {
  const { currentUser, isWhoLogin } = useUserAuth();
  console.log(currentUser, isWhoLogin);
  return (
    <>
      {isWhoLogin === "user" && currentUser && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memberhistory" element={<Membership />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/complaintpage" element={<Complaint />} />
          <Route path="/matchingpage" element={<MatchingPage />} />
          <Route path="/merrylist" element={<MerryList />} />
          <Route path="/merrypackage" element={<MerryPackage />} />
          <Route
            path="/merrypackage/subsuccess/:billingId"
            element={<PaymentSuccess />}
          />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Home />} />
        </Routes>
      )}

      {isWhoLogin === "admin" && currentUser && (
        <Routes>
          <Route path="/" element={<AdminPackageList />} />
          <Route path="/adminpackagelist" element={<AdminPackageList />} />
          <Route path="/adminpackagelist/add" element={<AdminPackageAdd />} />
          <Route
            path="/adminpackagelist/edit/:packageId"
            element={<AdminPackageEdit />}
          />
          <Route path="/complaintlist" element={<ComplaintList />} />
          <Route
            path="/complaintlist/detail/:complaintId"
            element={<ComplaintDetail />}
          />
          <Route
            path="/complaintlist/resolved/:complaintId"
            element={<ComplaintResolve />}
          />
          <Route
            path="/complaintlist/cancel/:complaintId"
            element={<ComplaintCancel />}
          />

          <Route path="*" element={<AdminPackageList />} />
        </Routes>
      )}
    </>
  );
}

export default AuthenticatedApp;
