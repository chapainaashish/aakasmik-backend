import { Request, Response, Router } from "express";
import Contact from "../models/Contact";
import contactsJson from "../db/contact.json";
import getNearestContacts from "../utils/getNearestContacts";

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



router.post("/add-contact", async (req: Request, res: Response) => {
  const { recaptchaToken, ...contactData } = req.body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const API_KEY = process.env.JSONBIN_API_KEY;
  const BIN_ID = process.env.BIN_ID;

  try {
    // Verify reCAPTCHA
    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
    );
    const recaptchaData = recaptchaResponse.data;

    if (!recaptchaData.success) {
      return res
        .status(400)
        .json({ success: false, message: "reCAPTCHA verification failed" });
    }

    // Store data in Jsonbin.io
    const url = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
    const config = {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    };

    // Fetch existing data
    let existingData = [];
    try {
      const response = await axios.get(url, config);
      existingData = response.data.record;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status !== 404) {
          console.error('Error fetching data:', error.response ? error.response.data : error.message);
          return res.status(500).json({ success: false, message: "Failed to fetch existing data" });
        }
      } else {
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: false, message: "An unexpected error occurred" });
      }
    }

    // Add new contact data
    const newData = [...existingData, contactData];

    await axios.put(url, newData, config);
    res.status(201).json({ success: true, data: contactData });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;