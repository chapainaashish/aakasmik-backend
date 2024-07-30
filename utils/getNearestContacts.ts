import contactsJson from "../db/contact.json";
import Contact from "../models/Contact";

const contacts = contactsJson as Contact[];

interface Location {
  latitude: number;
  longitude: number;
}

export default function getNearestContacts(userLocation: Location) {
  for (let contact of contacts) {
    const latDifference = Math.abs(contact.latitude - userLocation.latitude);
    const lonDifference = Math.abs(contact.longitude - userLocation.longitude);
    const difference = Math.max(latDifference, lonDifference);
    contact["difference"] = difference;
  }
  const sortedContacts = contacts
    .slice()
    .sort(
      (a: Contact, b: Contact) =>
        (a.difference as number) - (b.difference as number)
    );

  let results: Contact[] = [];
  let count = 0;

  for (let contact of sortedContacts) {
    if ((contact.difference as number) < 0.1 || count <= 5) {
      results.push(contact);
      count++;
    }
  }

  return results;
}
