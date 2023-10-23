import React from "react";
import styles from "./style";
import {
  Complaint,
  MerryPackage,
  UserProfile,
  ComplaintList,
  ComplaintDetail,
  DiscoverNewMatch,
  Membership,
  Login,
  Home,
  Register,
  MatchingPage,
} from "./page/indexPage";
import ProductList from "./page/ProductList";
import { MatchingPageList } from "./page/MatchingPageList";
import {
  AddPackageCard,
  ProfilePopup,
  Sidebar,
} from "./components/indexComponent";
import PaymentSuccess from "./page/PaymentSuccess";
import MerryList from "./page/MerryList";
import ComplaintResolve from "./page/ComplaintResolve";
import ComplaintCancel from "./page/ComplaintCancel";
import AdminPackageAdd from "./page/AdminPackageAdd";
import AdminPackageEdit from "./page/AdminPackageEdit";
import { useUserAuth } from "./context/AuthContext";
import AuthenticatedApp from "./auth/AuthenticatedApp";
import UnauthenticatedApp from "./auth/UnauthenticatedApp";

const App = () => {
  const { currentUser } = useUserAuth();
  console.log(currentUser);
  return <>{currentUser ? <AuthenticatedApp /> : <UnauthenticatedApp />}</>;
};

export default App;
