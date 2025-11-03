import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./models/Doctor.js";

dotenv.config();

const doctors = [
  { name: "Dr. James Peters", specialty: "Cardiology" },
  { name: "Dr. Sarah Coleman", specialty: "Pediatrics" },
  { name: "Dr. Ahmed Yusuf", specialty: "Orthopedics" },
  { name: "Dr. Laura Ojo", specialty: "Neurology" },
  { name: "Dr. Michael Stone", specialty: "Dermatology" },
  { name: "Dr. Grace Adeniyi", specialty: "Gynecology" },
  { name: "Dr. Daniel Brown", specialty: "Ophthalmology" },
  { name: "Dr. Esther Bello", specialty: "Dentistry" },
  { name: "Dr. Henry Okafor", specialty: "General Surgery" },
  { name: "Dr. Adaeze Nwosu", specialty: "Psychiatry" },
  { name: "Dr. Kolade Peters", specialty: "Cardiology" },
  { name: "Dr. Sarah Adeyinka", specialty: "Neurology" },
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Doctor.deleteMany(); // remove old data
    await Doctor.insertMany(doctors); // insert new data

    console.log("✅ Doctors seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDoctors();
