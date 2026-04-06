import React from 'react';

const CategoryBadge = ({ category }) => {
  const badgeStyle = {
    "Cats":       "bg-purple-100 text-purple-800 border-purple-300",
    "Dogs":       "bg-amber-100 text-amber-800 border-amber-300",
    "Fish":       "bg-cyan-100 text-cyan-800 border-cyan-300",
    "Bird":       "bg-emerald-100 text-emerald-800 border-emerald-300",
    "Cat Food":   "bg-purple-100 text-purple-800 border-purple-300",
    "Dog Food":   "bg-amber-100 text-amber-800 border-amber-300",
    "Fish Food":  "bg-cyan-100 text-cyan-800 border-cyan-300",
    "Bird Food":  "bg-emerald-100 text-emerald-800 border-emerald-300",
    "Health":     "bg-red-100 text-red-800 border-red-300",
    "Grooming":   "bg-pink-100 text-pink-800 border-pink-300",
    "Toys":       "bg-orange-100 text-orange-800 border-orange-300",
    "Accessories":"bg-slate-100 text-slate-700 border-slate-300",
    "Cat Litter": "bg-gray-100 text-gray-700 border-gray-300",
  };

  const style = badgeStyle[category] || "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {category.includes("Cat") && "Cat "}
      {category.includes("Dog") && "Dog "}
      {category.includes("Fish") && "Fish "}
      {category.includes("Bird") && "Bird "}
      {category === "Health" && "Health "}
      {category === "Grooming" && "Grooming "}
      {category === "Toys" && "Toys "}
      {category === "Accessories" && "Accessories "}
      {category}
    </span>
  );
};

export default CategoryBadge;