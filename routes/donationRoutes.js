import express from "express";
import SourdoughStarterDonation from "../models/Donation.js";

const router = express.Router();

// Get all donations
router.get("/", async (req, res) => {
  try {
    const donations = await SourdoughStarterDonation.find();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a donation by ID
router.get("/:id", getDonation, (req, res) => {
  res.json(res.donation);
});

// Create a new donation (can be used for both request and offer)
router.post("/", async (req, res) => {
  const { donorId, recipientId, status } = req.body;

  if ((donorId && recipientId) || (!donorId && !recipientId)) {
    res.status(400).json({ message: "Invalid donation data" });
    return;
  }

  const donation = new SourdoughStarterDonation(req.body);

  try {
    const newDonation = await donation.save();
    res.status(201).json(newDonation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a donation
router.patch("/:id", getDonation, async (req, res) => {
  Object.assign(res.donation, req.body);

  try {
    const updatedDonation = await res.donation.save();
    res.json(updatedDonation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a donation
router.delete("/:id", async (req, res) => {
  try {
    const donationId = req.params.id;
    const deletedDonation = await SourdoughStarterDonation.findByIdAndRemove(
      donationId
    );

    if (!deletedDonation) {
      res.status(404).json({ message: "Donation not found" });
    } else {
      res.json({ message: "Deleted donation" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to fetch a donation by ID
async function getDonation(req, res, next) {
  let donation;

  try {
    donation = await SourdoughStarterDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Cannot find donation" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.donation = donation;
  next();
}

export default router;
