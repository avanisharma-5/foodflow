import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import ExpiryPrediction from "./ExpiryPrediction";
import "./FoodList.css";
import DeleteFoodButton from "./DeleteFoodButton";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [userId, setUserId] = useState(null); 
  const [newFood, setNewFood] = useState({
    title: "",
    description: "",
    expiryDate: "",
    location: "",
    manufactureDate: "",
    cookedDate: ""
  });
  const [computedExpiryDate, setComputedExpiryDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);

  useEffect(() => {
    fetchFoods();

    //get loggedin users id

  const auth=getAuth();
  const user=auth.currentUser;
  if(user){
    setUserId(user.uid);
  }
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/foods");
      const data = await response.json();
      setFoods(data);
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

   

 // Function to remove deleted food from UI
 const handleDeleteSuccess = (deletedFoodId) => {
   setFoods(foods.filter(food => food._id !== deletedFoodId));
 };

  const handleChange = (e) => {
    setNewFood({ ...newFood, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to post a food item.");
      return;
    }

    const token = await user.getIdToken();
    const finalExpiryDate = newFood.expiryDate || computedExpiryDate;

    if (!finalExpiryDate) {
      alert("Please provide an expiry date or use expiry prediction.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ...newFood, expiryDate: finalExpiryDate }),
      });

      if (response.ok) {
        alert("Food item added successfully!");
        fetchFoods();
        setNewFood({ title: "", description: "", expiryDate: "", location: "", manufactureDate: "", cookedDate: "" });
        setComputedExpiryDate(null);
        setShowModal(false);
      } else {
        alert("Failed to add food item.");
      }
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Food Items Available for Donation</h2>

      {foods.length === 0 ? (
        <p className="empty-message">No food items available.</p>
      ) : (
        <table className="food-table">
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Location</th>
              <th>Description</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food, index) => (
              <tr key={index}>
                <td>{food.title}</td>
                <td>{food.location}</td>
                <td>{food.description}</td>
                <td>{food.expiryDate || "N/A"}</td>
                <td>

              {String(food.userId) === String(userId) &&(<DeleteFoodButton foodId={food._id} onDeleteSuccess={handleDeleteSuccess} />
              )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="add-food-button" onClick={() => setShowModal(true)}>Add Food</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Post a Food Item</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Food Title" value={newFood.title} onChange={handleChange} required />
              <input type="text" name="description" placeholder="Description" value={newFood.description} onChange={handleChange} required />
              <label>Date of Expiry:</label>
              <input type="date" name="expiryDate" value={newFood.expiryDate} onChange={handleChange} />
              <button type="button" className="predict-button" onClick={() => setShowExpiryModal(true)}>Use Expiry Predictor</button>
              <input type="text" name="location" placeholder="Your Address" value={newFood.location} onChange={handleChange} required />
              <button type="submit" className="submit-button">Add Food</button>
              <button className="close-button" onClick={() => setShowModal(false)}>Close</button>
            </form>
          </div>
        </div>
      )}

      {showExpiryModal && (
        <div className="modal">
          <div className="modal-content">
            <ExpiryPrediction 
              setComputedExpiryDate={setComputedExpiryDate} 
              setShowExpiryModal={setShowExpiryModal} 
            />
            <button className="close-button" onClick={() => setShowExpiryModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodList;
