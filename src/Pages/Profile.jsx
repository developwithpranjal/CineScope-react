import React, { useState,useEffect } from "react";
import "./Profile.css";
import { FaCamera } from "react-icons/fa";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("Login first");
      return;
    }

    try {
      await getDoc(doc(db, "users", user.uid), form);

      alert("Profile Saved ✅");
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setForm(docSnap.data());
        }
      } catch (error) {
        console.error(error);
      }
    });

    return () => unsubscribe();
  }, []);

  const [image, setImage] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
  if (e) e.preventDefault(); 

  const user = auth.currentUser;
  if (!user) return;

  try {
    await setDoc(doc(db, "users", user.uid), form);

    alert("Profile Updated ✅");
    setIsEditing(false);
  } catch (error) {
    console.error(error);
  }
}

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="profile-image">
          <img src={image} alt="profile" />
          <label className="edit-icon">
            <FaCamera />
            <input type="file" onChange={handleImage} hidden />
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={form.name}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Gender</label>
          <div className="gender">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={handleChange}
                disabled={!isEditing}
              />{" "}
              Male
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleChange}
                disabled={!isEditing}
              />{" "}
              Female
            </label>
          </div>

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="+91 1234567890"
            value={form.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            disabled={!isEditing}
          />

         <button
  type="button"
  onClick={() => {
    if (!isEditing) {
      setIsEditing(true); 
    } else {
      handleSubmit(new Event("submit")); 
    }
  }}
>
  {isEditing ? "Save Changes" : "Edit Profile"}
</button>
   
        </form>
      </div>
    </div>
  );
};

export default Profile;
