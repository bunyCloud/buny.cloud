import React from "react";

export default function BtnHelper({ icon, text }) {
  return (
    <div>
      {icon && icon} {text}
    </div>
  );
}
