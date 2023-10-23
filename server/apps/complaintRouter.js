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
} from "firebase/firestore";
import { db } from "../configs/firebase.js";

const complaintCollection = collection(db, "complaint");

const complaintRouter = Router();

// CREATE a new complaint (users)
complaintRouter.post("/", async (req, res) => {
  try {
    const { username, issue, description, status } = req.body;

    const complaintData = {
      username,
      issue,
      description,
      submitDate: serverTimestamp(),
      status,
    };

    const docRef = await addDoc(complaintCollection, complaintData);

    res
      .status(201)
      .json({ message: "Complaint saved successfully", docID: docRef.id });
  } catch (error) {
    console.error("Error adding complaint:", error);
    res.status(500).json({ error: "Could not add complaint" });
  }
});

// READ all complaints (admins only)
complaintRouter.get("/", async (req, res) => {
  try {
    const complaintsData = await getAllComplaintsFromFirestore();

    async function getAllComplaintsFromFirestore() {
      const complaintsSnapshot = await getDocs(complaintCollection);
      const complaintsData = [];

      complaintsSnapshot.forEach((doc) => {
        complaintsData.push({ id: doc.id, ...doc.data() });
      });

      return complaintsData;
    }
    complaintsData.forEach((complaint) => {
      complaint.submitDate = complaint.submitDate.toDate();
    });

    complaintsData.sort((a, b) => {
      const dateA = new Date(a.submitDate);
      const dateB = new Date(b.submitDate);

      return dateB - dateA;
    });

    res.status(200).json(complaintsData);
  } catch (error) {
    console.error("Error fetching complaints data:", error);
    res.status(500).json({ error: "Could not fetch complaints data" });
  }
});

// READ a specific complaint by ID
complaintRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const complaintData = await getComplaintByIdFromFirestore(id);

    async function getComplaintByIdFromFirestore(complaintId) {
      const complaintDocRef = doc(complaintCollection, complaintId);
      const complaintDocSnap = await getDoc(complaintDocRef);

      if (complaintDocSnap.exists()) {
        return { id: complaintDocSnap.id, ...complaintDocSnap.data() };
      } else {
        return null;
      }
    }

    if (complaintData) {
      res.status(200).json(complaintData);
    } else {
      res.status(404).json({ error: "Complaint not found" });
    }
  } catch (error) {
    console.error("Error fetching complaint data:", error);
    res.status(500).json({ error: "Could not fetch complaint data" });
  }
});

// UPDATE a complaint by ID
complaintRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComplaintData = req.body;

    updatedComplaintData.updatedDate = serverTimestamp();

    async function updateComplaintDataInFirestore(
      complaintId,
      updatedComplaintData
    ) {
      const complaintRef = doc(complaintCollection, complaintId);
      await updateDoc(complaintRef, updatedComplaintData);
    }

    await updateComplaintDataInFirestore(id, updatedComplaintData);

    res.status(200).json({
      message: "Complaint data updated successfully",
    });
  } catch (error) {
    console.error("Error updating complaint data:", error);
    res.status(500).json({ error: "Could not update complaint data" });
  }
});

complaintRouter.put("/resolved/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComplaintData = req.body;

    updatedComplaintData.updatedDate = serverTimestamp();
    updatedComplaintData.resolvedDate = serverTimestamp();

    async function updateComplaintDataInFirestore(
      complaintId,
      updatedComplaintData
    ) {
      const complaintRef = doc(complaintCollection, complaintId);
      await updateDoc(complaintRef, updatedComplaintData);
    }

    await updateComplaintDataInFirestore(id, updatedComplaintData);

    res.status(200).json({ message: "Complaint data resolved successfully" });
  } catch (error) {
    console.error("Error updating complaint data:", error);
    res.status(500).json({ error: "Could not resolved complaint data" });
  }
});

complaintRouter.put("/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComplaintData = req.body;

    updatedComplaintData.updatedDate = serverTimestamp();
    updatedComplaintData.cancelDate = serverTimestamp();

    async function updateComplaintDataInFirestore(
      complaintId,
      updatedComplaintData
    ) {
      const complaintRef = doc(complaintCollection, complaintId);
      await updateDoc(complaintRef, updatedComplaintData);
    }

    await updateComplaintDataInFirestore(id, updatedComplaintData);

    res.status(200).json({ message: "Complaint data cancel successfully" });
  } catch (error) {
    console.error("Error updating complaint data:", error);
    res.status(500).json({ error: "Could not cancel complaint data" });
  }
});

// DELETE a complaint by ID
complaintRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteComplaintFromFirestore(id);

    async function deleteComplaintFromFirestore(complaintId) {
      const complaintDocRef = doc(complaintCollection, complaintId);
      await deleteDoc(complaintDocRef);
    }

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ error: "Could not delete complaint" });
  }
});

export default complaintRouter;
