import { Router } from "express";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../configs/firebase.js";

const packageRouter = Router();

//GET all
packageRouter.get("/", async (req, res) => {
  try {
    const packageData = await getAllPackagesFromFirestore();
    async function getAllPackagesFromFirestore() {
      const packageCollection = collection(db, "package");
      const packageSnapshot = await getDocs(packageCollection);
      const packageData = [];

      packageSnapshot.forEach((doc) => {
        packageData.push({ id: doc.id, ...doc.data() });
      });
      packageData.sort((a, b) => {
        return parseInt(a.limit) - parseInt(b.limit);
      });

      return packageData;
    }
    res.status(200).json(packageData);
  } catch (error) {
    console.error("Error fetching package data:", error);
    res.status(500).json({ error: "Could not fetch package data" });
  }
});

//GET TOP 3 PACKAGE SORT BY LIMIT MERRY
packageRouter.get("/showpackages", async (req, res) => {
  try {
    const packageData = await getAllPackagesFromFirestore();

    async function getAllPackagesFromFirestore() {
      const packageCollection = collection(db, "package");
      const packageSnapshot = await getDocs(packageCollection);
      const packageData = [];

      packageSnapshot.forEach((doc) => {
        packageData.push({ id: doc.id, ...doc.data() });
      });

      packageData.sort((a, b) => {
        return parseInt(a.limit) - parseInt(b.limit);
      });

      // เลือกเอาแค่ 3 ข้อมูลแรก
      const limitedPackageData = packageData.slice(0, 3);

      return limitedPackageData;
    }

    res.status(200).json(packageData);
  } catch (error) {
    console.error("Error fetching package data:", error);
    res.status(500).json({ error: "Could not fetch package data" });
  }
});

// GET
packageRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const packageData = await getPackageByIdFromFirestore(id);

    async function getPackageByIdFromFirestore(packageId) {
      const packageDocRef = doc(db, "package", packageId);
      const packageDocSnap = await getDoc(packageDocRef);

      if (packageDocSnap.exists()) {
        return { id: packageDocSnap.id, ...packageDocSnap.data() };
      } else {
        return null;
      }
    }

    if (packageData) {
      res.status(200).json(packageData);
    } else {
      res.status(404).json({ error: "Package not found" });
    }
  } catch (error) {
    console.error("Error fetching package data:", error);
    res.status(500).json({ error: "Could not fetch package data" });
  }
});

// PUT
packageRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPackageData = req.body;
    updatedPackageData.updatedDate = serverTimestamp();

    async function updatePackageDataInFirestore(packageId, updatedPackageData) {
      const packageRef = doc(db, "package", packageId);
      await updateDoc(packageRef, updatedPackageData);
    }

    await updatePackageDataInFirestore(id, updatedPackageData);

    res.status(200).json({ message: "Package data updated successfully" });
  } catch (error) {
    console.error("Error updating package data:", error);
    res.status(500).json({ error: "Could not update package data" });
  }
});

//POST add new package
packageRouter.post("/", async (req, res) => {
  try {
    const { icon, limit, packageName, details, price } = req.body;

    const data = {
      icon,
      limit,
      packageName,
      details,
      price,
    };
    data.createdDate = serverTimestamp();

    const docRef = await addDoc(collection(db, "package"), data);

    res.status(201).json(docRef.id);
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({ error: "Could not add document" });
  }
});

// DELETE
packageRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Invalid package ID" });
    }

    await deletePackageFromFirestore(id);

    async function deletePackageFromFirestore(packageId) {
      const packageDocRef = doc(db, "package", packageId);
      await deleteDoc(packageDocRef);
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ error: "Could not delete package" });
  }
});

export default packageRouter;
