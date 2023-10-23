import { Router } from "express";
import {
  query,
  limit,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "../configs/firebase.js";

const usersRouter = Router();
const usersCollection = collection(db, "users");
const billingCollection = collection(db, "billing");

usersRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Initialize billingData as an empty array
    let billingData = [];

    // Get user data
    const userDocRef = doc(usersCollection, id);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.exists()
      ? { id: userDocSnap.id, ...userDocSnap.data() }
      : null;

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check billing records for the user
    const billingQuery = query(
      billingCollection,
      where("userID", "==", id),
      where("packageStatus", "==", true)
    );

    const billingSnapshot = await getDocs(billingQuery);

    if (!billingSnapshot.empty) {
      // Take the first billing record that matches the conditions
      const billingDoc = billingSnapshot.docs[0];
      billingData = { id: billingDoc.id, ...billingDoc.data() };
    } else {
      billingData = [];
    }

    // Add billing data to user response
    const response = {
      user: userData,
      billingData,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user and billing data:", error);
    res.status(500).json({ error: "Could not fetch user and billing data" });
  }
});

// Limit to 50 results and random
usersRouter.get("/available/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const usersData = await getRandomUsersFromFirestore();

    async function getRandomUsersFromFirestore() {
      const q = query(
        usersCollection,
        limit(50) // Limit to 50 results
      );

      const usersSnapshot = await getDocs(q);
      const usersData = [];

      usersSnapshot.forEach((doc) => {
        if (doc.id !== id) {
          usersData.push({ id: doc.id, ...doc.data() });
        }
      });

      // Shuffle the usersData array to display in random order
      for (let i = usersData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [usersData[i], usersData[j]] = [usersData[j], usersData[i]];
      }

      return usersData;
    }

    res.status(200).json(usersData);
  } catch (error) {
    console.error("Error fetching users data:", error);
    res.status(500).json({ error: `Could not fetch users data: ${error}` });
  }
});

// GET
// usersRouter.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userData = await getUserByIdFromFirestore(id);

//     async function getUserByIdFromFirestore(userId) {
//       const userDocRef = doc(db, "users", userId);
//       const userDocSnap = await getDoc(userDocRef);

//       if (userDocSnap.exists()) {
//         return { id: userDocSnap.id, ...userDocSnap.data() };
//       } else {
//         return null;
//       }
//     }

//     if (userData) {
//       res.status(200).json(userData);
//     } else {
//       res.status(404).json({ error: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     res.status(500).json({ error: "Could not fetch user data" });
//   }
// });

// PUT
usersRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get user ID for update
    const updatedUserData = req.body; // Data to be updated

    // Function to update user data in Firestore
    async function updateUserDataInFirestore(userId, updatedUserData) {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, updatedUserData);
    }

    // Update user data in Firebase Firestore
    await updateUserDataInFirestore(id, updatedUserData);

    res.status(200).json({ message: "User data updated successfully" });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Could not update user data" });
  }
});

//POST add new user from register data
usersRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      location,
      username,
      confirmPassword,
      dateOfBirth,
      age,
      city,
      email,
      sexualIdentities,
      racialPreferences,
      sexualPreferences,
      meetingInterests,
      hobbies,
      profilePictures,
    } = req.body;

    const user = {
      name,
      location,
      username,
      confirmPassword,
      dateOfBirth,
      age,
      city,
      email,
      sexualIdentities,
      racialPreferences,
      sexualPreferences,
      meetingInterests,
      hobbies,
      profilePictures,
    };

    const docRef = await addDoc(collection(db, "users"), user);

    res.status(201).json(docRef.id);
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({ error: "Could not add document" });
  }
});

// DEL
usersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUserFromFirestore(id);

    async function deleteUserFromFirestore(userId) {
      const userDocRef = doc(db, "users", userId);
      await deleteDoc(userDocRef);
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Could not delete user" });
  }
});

export default usersRouter;
