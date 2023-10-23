import { Router } from "express";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../configs/firebase.js";

const merryMatchingCollection = collection(db, "merryMatching");
const usersCollection = collection(db, "users");

const merryMatchingRouter = Router();

function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
// Read
merryMatchingRouter.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const toDayDate = new Date();
    const formattedDate = formatDateToYYYYMMDD(toDayDate);

    let userMatchQuery, coupleMatchQuery;

    if (formattedDate) {
      userMatchQuery = await getDocs(
        query(
          merryMatchingCollection,
          where("merryDate", "==", formattedDate),
          where("userMatchID", "==", userId)
        )
      );
      coupleMatchQuery = await getDocs(
        query(
          merryMatchingCollection,
          where("merryDate", "==", formattedDate),
          where("coupleMatchID", "==", userId)
        )
      );
    } else {
      console.log("not found");
      res.status(200).json({ error: "Could not fetch documents" });
    }

    const userMatchData = userMatchQuery.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
      matchType: "userMatch",
    }));

    const coupleMatchData = coupleMatchQuery.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
      matchType: "coupleMatch",
    }));

    const combinedData = [...userMatchData, ...coupleMatchData];
    res.status(200).json(combinedData);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Could not fetch documents" });
  }
});

// POST new documents
merryMatchingRouter.post("/", async (req, res) => {
  try {
    const { userMatchID, coupleMatchID } = req.body;
    const toDayDate = new Date();

    const formattedDate = formatDateToYYYYMMDD(toDayDate);

    const userDocRef = doc(usersCollection, userMatchID);
    const userDocSnap = await getDoc(userDocRef);
    const user = userDocSnap.exists() ? userDocSnap.data() : null;

    const coupleDocRef = doc(usersCollection, coupleMatchID);
    const coupleDocSnap = await getDoc(coupleDocRef);
    const couple = coupleDocSnap.exists() ? coupleDocSnap.data() : null;

    const merryMatchingData = {
      userMatchID,
      coupleMatchID,
      userMatchStatus: true,
      coupleStatus: false,
      merryDate: formattedDate,
      user,
      couple,
    };

    const docRef = await addDoc(merryMatchingCollection, merryMatchingData);

    res
      .status(201)
      .json({ message: "Data saved successfully", docID: docRef.id });
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({ error: "Could not add document" });
  }
});

// Read merryMatching document by ID
merryMatchingRouter.get("/:id", async (req, res) => {
  try {
    const merryMatchingID = req.params.id;
    const merryMatchingRef = doc(merryMatchingCollection, merryMatchingID);
    const merryMatchingSnap = await getDoc(merryMatchingRef);

    if (!merryMatchingSnap.exists()) {
      return res.status(404).json({ error: "Document not found" });
    }

    const merryMatchingData = merryMatchingSnap.data();
    res.status(200).json({ data: merryMatchingData });
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Could not fetch document" });
  }
});

// Update merryMatching document by ID
merryMatchingRouter.put("/usermatch/:id", async (req, res) => {
  try {
    const merryMatchingID = req.params.id;
    const { coupleStatus } = req.body;

    const merryMatchingRef = doc(merryMatchingCollection, merryMatchingID);
    const merryMatchingSnap = await getDoc(merryMatchingRef);

    if (!merryMatchingSnap.exists()) {
      return res.status(404).json({ error: "Document not found" });
    }

    await updateDoc(merryMatchingRef, {
      coupleStatus,
    });

    res.status(200).json({ message: "Document updated successfully" });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Could not update document" });
  }
});

// UPDATE document
merryMatchingRouter.put("/usermatchlist/:id", async (req, res) => {
  try {
    const merryMatchingID = req.params.id;
    const { userMatchStatus } = req.body;

    const merryMatchingRef = doc(merryMatchingCollection, merryMatchingID);
    const merryMatchingSnap = await getDoc(merryMatchingRef);

    if (!merryMatchingSnap.exists()) {
      return res.status(404).json({ error: "Document not found" });
    }

    await updateDoc(merryMatchingRef, {
      userMatchStatus,
    });

    res.status(200).json({ message: "Document updated successfully" });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Could not update document" });
  }
});

merryMatchingRouter.put("/match/:id", async (req, res) => {
  try {
    const merryMatchingID = req.params.id;

    const merryMatchingRef = doc(merryMatchingCollection, merryMatchingID);
    const merryMatchingSnap = await getDoc(merryMatchingRef);

    if (!merryMatchingSnap.exists()) {
      return res.status(404).json({ error: "Document not found" });
    }

    await updateDoc(merryMatchingRef, {
      userMatchStatus: true,
    });

    res.status(200).json({ message: "Document updated successfully" });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Could not update document" });
  }
});

merryMatchingRouter.put("/couplematch/:id", async (req, res) => {
  try {
    const merryMatchingID = req.params.id;
    const { coupleStatus } = req.body;

    const merryMatchingRef = doc(merryMatchingCollection, merryMatchingID);
    const merryMatchingSnap = await getDoc(merryMatchingRef);

    if (!merryMatchingSnap.exists()) {
      return res.status(404).json({ error: "Document not found" });
    }

    await updateDoc(merryMatchingRef, {
      coupleStatus,
    });

    res.status(200).json({ message: "Document updated successfully" });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Could not update document" });
  }
});

// Delete merryMatching document by ID
merryMatchingRouter.delete("/:id", async (req, res) => {
  try {
    const merryMatchingID = req.params.id;
    const merryMatchingRef = doc(merryMatchingCollection, merryMatchingID);
    const merryMatchingSnap = await getDoc(merryMatchingRef);

    if (!merryMatchingSnap.exists()) {
      return res.status(404).json({ error: "Document not found" });
    }

    await deleteDoc(merryMatchingRef);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Could not delete document" });
  }
});

merryMatchingRouter.delete("/", async (req, res) => {
  try {
    const toDayDate = new Date();
    const formattedDate = formatDateToYYYYMMDD(toDayDate);

    if (formattedDate) {
      const querySnapshot = await getDocs(
        query(merryMatchingCollection, where("merryDate", "!=", formattedDate))
      );

      const deleteMatches = querySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });

      await Promise.all(deleteMatches);
    } else {
      console.log("not found");
      res.status(404).json({ error: "Could not fetch documents" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting documents:", error);
    res.status(500).json({ error: "Could not delete documents" });
  }
});

export default merryMatchingRouter;
