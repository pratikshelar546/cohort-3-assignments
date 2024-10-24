import { useContext } from "react";
import { PetContext } from "../App";

const AdopterData = () => {
  const { formData, showForm, setShowForm } = useContext(PetContext);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <table 
        style={{
          borderCollapse: "collapse",
          width: "100%",
          maxWidth: "60%",
          border: "1px solid #ddd",
          fontSize: "18px",
          textAlign: "left",
          padding: "8px",
          backgroundColor: "#f2f2f2",
          color: "#333",
          textTransform: "capitalize",
          fontFamily: "Arial, sans-serif",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Pet Type</th>
            <th>Breed</th>
            <th>Adopter Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((data, index) => (
            <tr key={index}>
              <td>{data.petname}</td>
              <td>{data.pettype}</td>
              <td>{data.petbreed}</td>
              <td>{data.name}</td>
              <td>{data.email}</td>
              <td>{data.number}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="button" style={{width:"320px"}} onClick={() => setShowForm(!showForm)}>
        Add another pet
      </button>
    </div>
  );
};

export default AdopterData;
