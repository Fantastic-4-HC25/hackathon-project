// components/LandLordDashboard.jsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyList from "./ListingsSection";

export default function LandlordDashboard() {
  const [properties, setProperties] = useState([]);
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "apartment",
  });

  const fetchProperties = async () => {
    const myPropsQuery = query(
      collection(db, "properties"),
      where("ownerId", "==", auth.currentUser.uid)
    );
    const mySnap = await getDocs(myPropsQuery);
    setProperties(mySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

    const allSnap = await getDocs(collection(db, "properties"));
    setListings(
      allSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const addProperty = async () => {
    if (!form.title || !form.price)
      return alert("Title and price are required");
    await addDoc(collection(db, "properties"), {
      ...form,
      price: Number(form.price),
      ownerId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "available",
      features: [],
      images: [],
    });
    setForm({
      title: "",
      description: "",
      price: "",
      location: "",
      type: "apartment",
    });
    fetchProperties();
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Form */}
        <div className="border p-4 rounded space-y-2">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <Input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <Input
            placeholder="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <Button onClick={addProperty}>Add Property</Button>
        </div>

        {/* All Listings */}
        <div>
          <h2 className="text-lg font-semibold">All Listings</h2>
          <PropertyList listings={listings} />
        </div>
      </CardContent>
    </Card>
  );
}
