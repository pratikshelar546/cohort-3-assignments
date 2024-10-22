export const validation = (name, value, errors) => {
    switch (name) {
        case "petName":
            errors.petName =
                value.length < 3 ? "Pet Name must be at least 3 characters" : "";
            break;
        case "pettype":
            errors.pettype =
                value.length < 3 ? "Pet Name must be at least 3 characters" : "";
            break;
        case "petbreed":
            errors.petbreed =
                value.length < 3 ? "Breed must be at least 3 characters" : "";
            break;
        case "name":
            errors.name =
                value.length < 3 ? "Your Name must be at least 3 characters" : "";
            break;
        case "email":
            errors.email = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? "" : "Invalid email address";
            break;
        case "number":
            errors.number = /^\d{10}$/.test(value)
                ? ""
                : "Please enter a valid 10-digit phone number!";
            break;
        default:
            break;
    }
    return errors;
};