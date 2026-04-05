"use client";

import { useState, useEffect } from "react";

const tips = [
  "Plastic bags and stretchy film plastic get wrapped around the sorting machinery at the recycling facility. Take them to CHaRM or grocery store drop-off bins instead.",
  "Don't bag your recyclables — keep them loose in the bin. Plastic bags and trash bags should never go in with mixed recycling.",
  "Styrofoam can't go in curbside recycling in ACC. Take it to CHaRM at 1005 College Ave for proper recycling.",
  "Rinse your bottles, cans, and containers before recycling. Food residue can contaminate other recyclables and make whole batches unusable.",
  "Clean pizza boxes are recyclable in ACC. Just make sure there's no grease or food stuck to them.",
  "Shredded paper can't go in your regular recycling bin — it's too small for the sorters. Drop it off in a clear bag or box at CHaRM or the ACC Recycling Facility.",
  "Flatten your cardboard boxes before putting them in the recycling cart. It saves space and helps trucks haul more.",
  "Aluminum cans are infinitely recyclable — they can be recycled and back on the shelf as a new can in about 60 days.",
  "CHaRM at 1005 College Ave is a one-stop drop for items that can't go curbside — electronics, paint, batteries, chemicals, tires, and more.",
  "ACC accepts rigid plastic containers #1–7 in curbside recycling, but not plastic bags, film wrap, or styrofoam.",
];

export function DidYouKnow() {
  const [tip, setTip] = useState("");

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)]!);
  }, []);

  if (!tip) return null;

  return (
    <div className="mt-12 w-full max-w-md mx-auto text-center">
      <p className="text-sm text-gray-400 mb-2">💡 Did you know?</p>
      <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
    </div>
  );
}
