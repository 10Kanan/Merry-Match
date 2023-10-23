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

const billingCollection = collection(db, "billing");
const packageCollection = collection(db, "package");

const billingRouter = Router();

const calculateEndPackageTime = (startPackageTime) => {
  const endPackageTime = new Date(startPackageTime);
  endPackageTime.setMonth(endPackageTime.getMonth() + 1);
  return endPackageTime;
};

// CREATE a new billing record
billingRouter.post("/", async (req, res) => {
  try {
    const { userID, packageID, packageStatus } = req.body;

    // Get package data based on packageID
    const packageDocRef = doc(packageCollection, packageID);
    const packageDocSnap = await getDoc(packageDocRef);
    const packageData = packageDocSnap.exists() ? packageDocSnap.data() : null;

    if (!packageData) {
      return res.status(404).json({ error: "Package not found" });
    }

    const startPackageTime = new Date();
    const endPackageTime = calculateEndPackageTime(startPackageTime);

    const billingData = {
      userID,
      packageID,
      packageStatus,
      packageData,
      startPackageTime,
      endPackageTime,
    };

    const docRef = await addDoc(billingCollection, billingData);

    res
      .status(201)
      .json({ message: "Data saved successfully", docID: docRef.id });
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({ error: "Could not add document" });
  }
});

//GET update status
billingRouter.get("/", async (req, res) => {
  try {
    const billingData = await getAllBillingDataFromFirestore();

    async function getAllBillingDataFromFirestore() {
      const billingSnapshot = await getDocs(billingCollection);
      const billingData = [];

      billingSnapshot.forEach((doc) => {
        const billingDocData = { id: doc.id, ...doc.data() };

        const currentDate = new Date();
        const endPackageTime = new Date(
          billingDocData.endPackageTime.seconds * 1000
        );
        if (currentDate > endPackageTime) {
          // Update packageStatus to false
          billingDocData.packageStatus = false;
        }

        billingData.push(billingDocData);
      });

      billingData.sort(
        (a, b) => b.startPackageTime.seconds - a.startPackageTime.seconds
      );

      return billingData;
    }

    res.status(200).json(billingData);
  } catch (error) {
    console.error("Error fetching billing data:", error);
    res.status(500).json({ error: "Could not fetch billing data" });
  }
});

billingRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const billingData = await getBillingDataByIdFromFirestore(id);

    async function getBillingDataByIdFromFirestore(billingId) {
      const billingDocRef = doc(billingCollection, billingId);
      const billingDocSnap = await getDoc(billingDocRef);

      if (billingDocSnap.exists()) {
        return { id: billingDocSnap.id, ...billingDocSnap.data() };
      } else {
        return null;
      }
    }

    if (billingData) {
      res.status(200).json(billingData);
    } else {
      res.status(404).json({ error: "Billing record not found" });
    }
  } catch (error) {
    console.error("Error fetching billing data:", error);
    res.status(500).json({ error: "Could not fetch billing data" });
  }
});

billingRouter.get("/userbilling/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const billingQuery = query(
      billingCollection,
      where("userID", "==", id),
      where("packageStatus", "==", false)
    );

    const billingSnapshot = await getDocs(billingQuery);
    const billingData = [];

    if (!billingSnapshot.empty) {
      billingSnapshot.forEach((doc) => {
        billingData.push({ id: doc.id, ...doc.data() });
      });

      // เรียงลำดับตาม startPackageTime จากมากไปน้อย
      billingData.sort((a, b) => b.startPackageTime - a.startPackageTime);

      res.status(200).json(billingData);
    } else {
      res.status(404).json({ error: "Billing record not found" });
    }
  } catch (error) {
    console.error("Error fetching billing data:", error);
    res.status(500).json({ error: "Could not fetch billing data" });
  }
});

// UPDATE a billing record by ID
billingRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBillingData = req.body;

    updatedBillingData.updatedDate = serverTimestamp();

    async function updateBillingDataInFirestore(billingId, updatedBillingData) {
      const billingRef = doc(billingCollection, billingId);
      await updateDoc(billingRef, updatedBillingData);
    }

    await updateBillingDataInFirestore(id, updatedBillingData);

    res.status(200).json({ message: "Billing data updated successfully" });
  } catch (error) {
    console.error("Error updating billing data:", error);
    res.status(500).json({ error: "Could not update billing data" });
  }
});

// DELETE a billing record by ID
billingRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteBillingRecordFromFirestore(id);

    async function deleteBillingRecordFromFirestore(billingId) {
      const billingDocRef = doc(billingCollection, billingId);
      await deleteDoc(billingDocRef);
    }

    res.status(200).json({ message: "Billing record deleted successfully" });
  } catch (error) {
    console.error("Error deleting billing record:", error);
    res.status(500).json({ error: "Could not delete billing record" });
  }
});

export default billingRouter;
