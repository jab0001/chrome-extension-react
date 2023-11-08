import React from "react";

export function Divider({ className }) {

  return (
    <div style={'height: 1.5px; background-image: radial-gradient(white, transparent 70%); margin-top: 2px; margin-bottom: 2px;'} className={className}>
    </div>
  );
}