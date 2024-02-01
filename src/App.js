import React, { useState, useEffect } from 'react';
import ContentCard from './ContentCard';



const contentArray = [
  { Title: 'Außenspiegel links 145 manuell,schw arz', Price: '66,81 EUR', Picture: 'unique_product_images/product_img_1.jpg' },
  { Title: 'Außenspiegel links 145 manuell,schw arz2', Price: '66,81 EUR', Picture: 'unique_product_images/product_img_2.jpg' },
  { Title: 'Außenspiegel links 145 manuell,schw arz3', Price: '66,81 EUR', Picture: 'unique_product_images/product_img_3.jpg' },
  { Title: 'Außenspiegel links 145 manuell,schw arz4', Price: '66,81 EUR', Picture: 'unique_product_images/product_img_4.jpg' },
  { Title: 'Außenspiegel links 145 manuell,schw arz5', Price: '66,81 EUR', Picture: 'unique_product_images/product_img_5.jpg' },
];
function App() {
  const [contentIndex, setContentIndex] = useState(0);
  const [inputValue, setInputValue] = useState(contentIndex + 1);

  useEffect(() => {
    setInputValue(contentIndex + 1);
  }, [contentIndex]);

  const handleNext = () => {
    setContentIndex((prevIndex) => (prevIndex + 1) % contentArray.length);
  };

  const handlePrev = () => {
    setContentIndex((prevIndex) => (prevIndex - 1 + contentArray.length) % contentArray.length);
  };


  const handleIndexInput = (e) => {
    const val = e.target.value;
    setInputValue(val); // update input value state

    const index = val - 1;
    if (val !== '' && index >= 0 && index < contentArray.length) {
      setContentIndex(index);
      e.target.setCustomValidity('');
    } else if (val !== '') {
      if (index < 0) {
        e.target.setCustomValidity('Please enter a valid row number.');
      } else if (index >= contentArray.length) {
        e.target.setCustomValidity(`The input exceeds the total number of rows in the Excel file, which is ${contentArray.length}.`);
      }
      e.target.reportValidity();
    }
  };

  return (
    <div className="App flex flex-col items-center justify-center h-screen">
      <input
        type="number"
        value={inputValue}
        min={1}
        max={contentArray.length}
        onChange={handleIndexInput}
        className="my-2 border-2 border-gray-300 rounded-md"
      />
      <div className="">

        <ContentCard content={contentArray[contentIndex]} />
      </div>
      <div className="absolute bottom-0 flex justify-center w-full pb-4">
        <button onClick={handlePrev} className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md font-bold">&lt;</button>
        <button onClick={handleNext} className="px-4 py-2 ml-2 bg-blue-500 text-white rounded-md font-bold">&gt;</button>
      </div>
    </div>
  );
}

export default App;
