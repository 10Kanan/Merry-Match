import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../configs/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db } from "../configs/firebase";
import {
  getDocs,
  collection,
  where,
  query,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const userAuthContext = createContext();

export const UserAuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    false || window.localStorage.getItem("auth") === "true"
  );
  const [token, setToken] = useState("");
  const [currentAdmin, setCurrentAdmin] = useState(false);
  const [isWhoLogin, setIsWhoLogin] = useState();
  const [isLogin, setIsLogin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isErrorAuth, setIsErrorAuth] = useState(null);
  const [isLoading, setIsloading] = useState(false);

  const navigate = useNavigate();

  const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      setToken(token);
      localStorage.setItem("auth", token);
      localStorage.setItem("uid", user.uid);

      const adminCollectionRef = collection(db, "admin");
      const usersCollectionRef = collection(db, "users");

      const adminQuery = query(adminCollectionRef, where("email", "==", email));
      const usersQuery = query(usersCollectionRef, where("email", "==", email));

      const adminQuerySnapshot = await getDocs(adminQuery);
      const usersQuerySnapshot = await getDocs(usersQuery);

      if (!adminQuerySnapshot.empty) {
        console.log("Email found in the admin collection");
        const adminData = usersQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        console.log(adminData[0].id);
        navigate("/adminpackagelist");
        return;
      }

      if (!usersQuerySnapshot.empty) {
        // console.log("Email found in the users collection");
        const userData = usersQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        // console.log(userData[0].id);
        navigate("/");
        return;
      }

      console.log("Email not found in any collection");
    } catch (error) {
      setIsErrorAuth(error.message);
      setTimeout(() => {
        setIsErrorAuth(null);
      }, 1000);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ใช้ UID
      const userDocRef = doc(db, "users", user.uid);

      // Firestore
      const res = await setDoc(userDocRef, userData);
      // console.log(res);

      console.log("User registered and profile created for UID:", user.uid);
    } catch (error) {
      console.error("Error registering user and creating profile:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(false);
      localStorage.clear();
      navigate("/home");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // console.log("Auth", user.uid);
      localStorage.setItem("uid", user.uid);
      setCurrentUser(!!user);
      console.log("Auth", user);
      if (user) {
        if (user.uid === "PJSKYk5DGyWbVyW22T9HMzAhQoq2") {
          setIsWhoLogin("admin");
        } else {
          setIsWhoLogin("user");
        }
        setToken(user.accessToken);
      }
    });

    const storedAuth = window.localStorage.getItem("auth");
    if (storedAuth) {
      setCurrentUser(true);
    } else {
      setCurrentUser(false);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        isLoading,
        setIsloading,
        currentAdmin,
        currentUser,
        isWhoLogin,
        isLogin,
        signUp,
        logIn,
        logOut,
        currentUserId,
        isErrorAuth,
        setIsErrorAuth,
        setIsWhoLogin,
        setCurrentUser,
        token,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
};
export function useUserAuth() {
  return useContext(userAuthContext);
}
