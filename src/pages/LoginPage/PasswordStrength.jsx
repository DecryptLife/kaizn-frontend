// PasswordStrength.jsx
import React from "react";

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length > 5) strength += 1;
  if (password.length > 7) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  return strength; // returns a number between 0 and 5
};

const PasswordStrength = ({ password }) => {
  const strength = getPasswordStrength(password);
  const strengthClass = {
    0: "bg-red-400", // Weak
    1: "bg-red-400",
    2: "bg-yellow-400", // Fair
    3: "bg-yellow-400",
    4: "bg-green-400", // Strong
    5: "bg-green-400",
  };

  return (
    <div className="w-full bg-gray-300 h-2">
      <div
        className={`h-2 ${strengthClass[strength]} transition-width duration-300`}
        style={{ width: `${strength * 20}%` }}
      />
    </div>
  );
};

export default PasswordStrength;
