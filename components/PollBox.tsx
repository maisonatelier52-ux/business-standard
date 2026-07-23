'use client';

import { useState } from 'react';

export default function PollBox() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedOption) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-[#e6d2c2] p-5 rounded">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-center">Opinion Poll</h2>
        <div className="w-16 h-[2px] bg-red-600 mt-2 mx-auto"></div>
      </div>
      <p className="font-semibold mb-4 text-sm leading-snug">
        Should the government prioritize economic growth over fiscal consolidation?
      </p>

      {!submitted ? (
        <>
          <div className="space-y-3">
            <label className="flex items-center gap-3 bg-white p-3 rounded cursor-pointer">
              <input
                type="radio"
                name="poll"
                value="yes"
                className="accent-red-600"
                onChange={() => setSelectedOption('yes')}
              />
              Yes
            </label>
            <label className="flex items-center gap-3 bg-white p-3 rounded cursor-pointer">
              <input
                type="radio"
                name="poll"
                value="no"
                className="accent-red-600"
                onChange={() => setSelectedOption('no')}
              />
              No
            </label>
          </div>
          <div className="flex justify-between items-center mt-5">
            <span className="text-red-600 text-sm cursor-pointer hover:underline">
              View all polls
            </span>
            <button
              onClick={handleSubmit}
              className="bg-red-600 text-white px-4 py-1 rounded text-sm font-semibold hover:bg-red-700 transition"
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white p-4 rounded text-center">
          <p className="font-bold text-green-700 text-sm mb-1">Thank you for voting!</p>
          <p className="text-xs text-gray-600">Your vote has been recorded.</p>
        </div>
      )}
    </div>
  );
}
