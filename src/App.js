import React, { useState } from 'react';

// Let's assume this is your content array for now
const contentArray = ['Content 1', 'Content 2', 'Content 3', 'Content 4', 'Content 5'];

function App() {
  const [contentIndex, setContentIndex] = useState(0);

  const handleNext = () => {
    setContentIndex((prevIndex) => (prevIndex + 1) % contentArray.length);
  };

  const handlePrev = () => {
    setContentIndex((prevIndex) => (prevIndex - 1 + contentArray.length) % contentArray.length);
  };

  return (
    <div className="App flex flex-col items-center h-screen">
      <input
        type="number"
        value={contentIndex}
        onChange={(e) => setContentIndex(e.target.value)}
        className="my-2 border-2 border-gray-300 rounded-md"
      />
      <div className="justify-center">
        <div className="text-2xl mb-4">{contentArray[contentIndex]}</div>
      </div>
      <div className="absolute bottom-0 flex justify-center w-full pb-4">
        <button onClick={handlePrev} className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md font-bold">&lt;</button>
        <button onClick={handleNext} className="px-4 py-2 ml-2 bg-blue-500 text-white rounded-md font-bold">&gt;</button>
      </div>
    </div>
  );
}

export default App;
