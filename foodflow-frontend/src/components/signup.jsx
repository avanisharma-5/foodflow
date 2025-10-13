import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase"; // Firestore database
import { doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const auth = getAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth,email, password);
      if (!userCredential || !userCredential.user) {
        throw new Error("Signup failed. No user returned.");
      }
      const user = userCredential.user;
      if (user) {
        alert("Signup successful!");
      } else {
        alert("Signup failed. Please try again.");
      }
      // Save additional details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        phone,
        address,
      });

      alert("Signup successful! You can now log in.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} required />
      <input type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)} required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;