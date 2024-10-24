import { useContext } from "react";
import "./header.css";
import { PetContext } from "../App";

const Header = () => {
  const {  setShowForm } = useContext(PetContext);

  return (
    <div className="header">
      <ul className="header-list">
        <li>Pet Adoption</li>
        <li onClick={() => setShowForm(true)}>Form</li>
        <li onClick={() => setShowForm(false)}>Table</li>
      </ul>
    </div>
  );
};

export default Header;
