import { createContext, useState } from "react";
import Header from "./components/Header";
import PetAdoptionForm from "./components/PetAdoptionForm";
import "./myApp.css";
import AdopterData from "./components/AdopterData";

export const PetContext = createContext();
const App = () => {
  const [formData, setFormData] = useState([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80')",
        height: "100vh",
        backgroundSize: "cover",
      }}
    >
      <PetContext.Provider
        value={{ formData, setFormData, showForm, setShowForm }}
      >
        <Header message={"Pet Adoption Form"} />
        {showForm ? <PetAdoptionForm /> : <AdopterData />}
      </PetContext.Provider>
    </div>
  );
};
export default App;
