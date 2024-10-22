import { useContext, useState } from "react";
import "./AdoptionForm.css";
import { validation } from "../utils/validation";
import { PetContext } from "../App";
const PetAdoptionForm = () => {
  const [values, setValues] = useState({
    petname: "",
    pettype: "",
    petbreed: "",
    name: "",
    email: "",
    number: "",
  });
  const [errors, setErrors] = useState({
    petname: "",
    pettype: "",
    petbreed: "",
    name: "",
    email: "",
    number: "",
  });

  const { formData, setFormData, setShowForm, showForm } =
    useContext(PetContext);

  const inputChange = (data) => {
    const { id, value } = data;
    setValues((prevValue) => ({
      ...prevValue,
      [id]: value,
    }));

    let errroCopy = { ...errors };

    const error = validation(id, value, errroCopy);

    setErrors(error);
  };

  const handleSubmit = () => {
    if (
      !values.petname ||
      !values.pettype ||
      !values.petbreed ||
      !values.email ||
      !values.name ||
      !values.number
    ) {
      alert("Please fill all the fields");
      return;
    }

    const hasError = Object.values(errors).filter((val) => val);

    if (hasError.some((val) => val)) {
      alert(hasError);
      return;
    }

    setFormData((prevData) => [...prevData, values]);

    setValues({
      petname: "",
      pettype: "",
      petbreed: "",
      name: "",
      email: "",
      number: "",
    });

    setErrors({
      petname: "",
      pettype: "",
      petbreed: "",
      name: "",
      email: "",
      number: "",
    });
    setShowForm(!showForm);
  };

  console.log(formData);

  return (
    <div className="form">
      <h1>Pet Adotion form</h1>

      <div>
        <label className="label">Pet Name</label>
        <input
          type="text"
          placeholder="Pet Name"
          id="petname"
          value={values.petname}
          onChange={(e) => inputChange(e.target)}
        />

        <label className="label">Pet Type</label>
        <input
          type="text"
          placeholder="Pet Type"
          id="pettype"
          value={values.pettype}
          onChange={(e) => inputChange(e.target)}
        />

        <label className="label">Pet Breed</label>
        <input
          type="text"
          placeholder="Pet Breed"
          id="petbreed"
          value={values.petbreed}
          onChange={(e) => inputChange(e.target)}
        />

        <label className="label">Your Name</label>
        <input
          type="text"
          placeholder="Your Name"
          value={values.name}
          id="name"
          onChange={(e) => inputChange(e.target)}
        />

        <label className="label">Email</label>
        <input
          type="text"
          value={values.email}
          placeholder="Email"
          id="email"
          onChange={(e) => inputChange(e.target)}
        />

        <label className="label">Phone Number</label>
        <input
          type="text"
          value={values.number}
          placeholder="Phone Number"
          id="number"
          onChange={(e) => inputChange(e.target)}
        />

        <button className="button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default PetAdoptionForm;
