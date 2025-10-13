import React from "react";
import { getAuth } from "firebase/auth";

const DeleteFoodButton = ({ foodId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch(`http://localhost:5000/api/foods/${foodId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        onDeleteSuccess(foodId); // Remove deleted item from UI
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  };

  return (
    <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white", padding: "5px", border: "none", cursor: "pointer" }}>
      Delete
    </button>
  );
};

export default DeleteFoodButton;
