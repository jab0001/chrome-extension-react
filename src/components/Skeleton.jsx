import React from "react";

import classNames from "../utils/classTransform";

export function Skeleton({ className }) {
  return (
    <div className={className} style={{ background: '' }}>
    </div>
  );
}