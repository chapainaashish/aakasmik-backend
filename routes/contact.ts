import { Request, Response, Router } from "express";
import Contact from "../models/Contact";
import contactsJson from "../db/contact.json";
import getNearestContacts from "../utils/getNearestContacts";
import fs from "fs";
import path from "path";
import axios from "axios";


const router = Router();
const contacts = contactsJson as Contact[];

// return all contacts
router.get("/", (req: Request, res: Response) => {
  return res.send(contacts);
});

// return contacts based on user location
router.get("/contacts", (req: Request, res: Response) => {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);
  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude, longitude are required." });
  }
  const contacts = getNearestContacts({ latitude, longitude });
  return res.send(contacts);
});

// return contacts based on search
router.get("/search", (req: Request, res: Response) => {
  const searchTerm = req.query.term as string;
  if (!searchTerm) {
    return res.status(400).send({ message: "Missing search term" });
  }
  const regex = new RegExp(searchTerm, "i");
  const results = contacts.filter(
    (contact: Contact) =>
      regex.test(contact.district) ||
      regex.test(contact.category) ||
      regex.test(contact.name) ||
      regex.test(contact.city)
  );
  return res.send(results);
});

// endpoint to add the new contact through contribution form
router.post("/add-contact", async (req, res) => {
  const filePath = path.join(__dirname, "..", "db", "user_contact.json");
  const { recaptchaToken, ...contactData } = req.body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; 

  try {
    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
    );
    const recaptchaData = recaptchaResponse.data;

    if (!recaptchaData.success) {
      return res
        .status(400)
        .json({ success: false, message: "reCAPTCHA verification failed" });
    }

    let existingData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const newData = [...existingData, contactData]; 
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    res.status(201).json({ success: true, data: contactData }); 
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
export default router;