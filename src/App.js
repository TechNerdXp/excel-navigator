import React, { useState, useEffect, useRef } from 'react';
import { CogIcon, ArrowDownTrayIcon, ArrowPathRoundedSquareIcon, HandThumbUpIcon, HandThumbDownIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
import Sidebar from './Sidebar';
import * as XLSX from 'xlsx';

function App() {

  const getLocalStorage = (key, defaultValue) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
      return JSON.parse(savedValue);
    }
    return defaultValue;
  };

  const [currentIndex, setcurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState(currentIndex + 1);
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef();

  const [excludeDuplicates, setExcludeDuplicates] = useState(() => getLocalStorage('excludeDuplicates', true));
  const [excludeProductNotAvailable, setExcludeProductNotAvailable] = useState(() => getLocalStorage('excludeProductNotAvailable', true));
  const [excludePriceOnRequest, setExcludePriceOnRequest] = useState(() => getLocalStorage('excludePriceOnRequest', true));
  const [excludeUsedParts, setExcludeUsedParts] = useState(() => getLocalStorage('excludeUsedParts', true));
  const [excludeExistingProducts, setExcludeExistingProducts] = useState(() => getLocalStorage('excludeExistingProducts', true));
  const [excludeProductsWithDefaultImage, setExcludeProductsWithDefaultImage] = useState(() => getLocalStorage('excludeProductsWithDefaultImage', false));
  const [excludeProductsWithNoImage, setExcludeProductsWithNoImage] = useState(() => getLocalStorage('excludeProductsWithNoImage', false));

  const [filteredData, setFilteredData] = useState([])
  const [totalKept, setTotalKept] = useState(0)

  useEffect(() => {
    setTotalKept(filteredData.filter(rec => rec.MarkedAs === 'Kept').length);
  }, [filteredData]);

  useEffect(() => {
    setInputValue(currentIndex + 1);
  }, [currentIndex]);

  useEffect(() => {
    const savedData = localStorage.getItem('sheetData');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('excludeDuplicates', JSON.stringify(excludeDuplicates));
    localStorage.setItem('excludeProductNotAvailable', JSON.stringify(excludeProductNotAvailable));
    localStorage.setItem('excludePriceOnRequest', JSON.stringify(excludePriceOnRequest));
    localStorage.setItem('excludeUsedParts', JSON.stringify(excludeUsedParts));
    localStorage.setItem('excludeExistingProducts', JSON.stringify(excludeExistingProducts));
    localStorage.setItem('excludeProductsWithDefaultImage', JSON.stringify(excludeProductsWithDefaultImage));
    localStorage.setItem('excludeProductsWithNoImage', JSON.stringify(excludeProductsWithNoImage));
  }, [excludeDuplicates, excludeProductNotAvailable, excludePriceOnRequest, excludeUsedParts, excludeExistingProducts, excludeProductsWithDefaultImage, excludeProductsWithNoImage]);

  useEffect(() => {
    if (data) {
      const uniqueProductLinks = new Set();
      const filtered = data.filter(item => {
        if (item.Id === undefined) return false;
        if (excludeDuplicates && !uniqueProductLinks.has(item.ProductLink)) {
          uniqueProductLinks.add(item.ProductLink);
        } else if (excludeDuplicates) {
          return false;
        }
        if (excludeProductNotAvailable && item.IsAvailable !== 'Available 🟢') return false;
        if (excludePriceOnRequest && item.Price === 'On request') return false;
        if (excludeUsedParts && item.Tree.indexOf('USED PARTS') !== -1) return false;
        if (excludeExistingProducts && item.AlreadyThere === 'yes') return false;
        if (excludeProductsWithDefaultImage && item.IsDefaultImg === 'yes') return false;
        if (excludeProductsWithNoImage && item.SavedProductImage === undefined) return false;
        return true;
      });
      if (filtered) {
        setFilteredData(filtered);
      }
      if (filtered[currentIndex] === undefined || data[currentIndex] === undefined) {
        setcurrentIndex(0);
      }
    }
  }, [excludeDuplicates, excludeProductNotAvailable, excludePriceOnRequest, excludeUsedParts, excludeExistingProducts, excludeProductsWithDefaultImage, excludeProductsWithNoImage, data]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = data[0];
      data.shift();
      const processedData = data.map((row) => {
        let obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      setData(processedData);
      localStorage.setItem('sheetData', JSON.stringify(processedData));
      setcurrentIndex(0);
    };
    reader.readAsBinaryString(file);
  }


  const updateDataMarkedAs = (id, status) => {
    const filteredRow = filteredData.find(row => row.Id === id);
    filteredRow.MarkedAs = status;
    setFilteredData([...filteredData]);
    const dataRow = data.find(row => row.Id === id);
    dataRow.MarkedAs = status;
    setData([...data]);
    localStorage.setItem('sheetData', JSON.stringify(data));
  };

  const handleRemove = () => {
    const id = filteredData[currentIndex].Id;
    updateDataMarkedAs(id, 'Removed');
  };

  const handleKeep = () => {
    const id = filteredData[currentIndex].Id;
    updateDataMarkedAs(id, 'Kept');
  };

  const handleDownload = () => {
    const newWB = XLSX.utils.book_new();
    const newWS = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(newWB, newWS, "Products");
    XLSX.writeFile(newWB, "filtered_products.xlsx");
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset?')) {
      localStorage.setItem('sheetData', JSON.stringify([]));
      localStorage.setItem('excludeDuplicates', true);
      localStorage.setItem('excludeProductNotAvailable', true);
      localStorage.setItem('excludePriceOnRequest', true);
      localStorage.setItem('excludeUsedParts', true);
      localStorage.setItem('excludeExistingProducts', true);
      localStorage.setItem('excludeProductsWithDefaultImage', false);
      localStorage.setItem('excludeProductsWithNoImage', false);
      setFilteredData([]);
      setData([]);
      fileInputRef.current.value = null;
      setcurrentIndex(0);
    } else {
      console.log('Reset cancelled.');
    }
  };

  const handleSidebar = () => {
    setIsOpen(!isOpen);
  };


  const handleNext = () => {
    setcurrentIndex((prevIndex) => (prevIndex + 1) % filteredData.length);
  };

  const handlePrev = () => {
    setcurrentIndex((prevIndex) => (prevIndex - 1 + filteredData.length) % filteredData.length);
  };

  const handleIndexInput = (e) => {
    const val = e.target.value;
    setInputValue(val);
    const index = val - 1;
    if (val !== '' && index >= 0 && index < filteredData.length) {
      setcurrentIndex(index);
      e.target.setCustomValidity('');
    } else if (val !== '') {
      if (index < 0) {
        e.target.setCustomValidity('Please enter a valid row number.');
      } else if (index >= filteredData.length) {
        e.target.setCustomValidity(`The input exceeds the total number of rows in the Excel file, which is ${filteredData.length}.`);
      }
      e.target.reportValidity();
    }
  };

  const currentRow = filteredData[currentIndex];

  return (
    <div className="flex flex-col items-center justify-between h-screen p-5 lg:w-[60vw] m-auto">
      <header className="flex flex-col items-center w-full">
        <div className="flex justify-between justify-start w-full">
          <div>
            <input className="w-36 mr-2 mt-1 px-4 py-1 mr-2 border-2 border-gray-300 rounded-md" type="number" value={inputValue} min={1} max={filteredData.length} onChange={handleIndexInput} disabled={filteredData.length === 0} title="Index" />
            <input ref={fileInputRef} className="cursor-pointer mr-2 mt-1" type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
          </div>
          <div className="flex lg:flex-no-wrap align-end">
            <button onClick={handleDownload} className="btn flex w-full mr-2 mt-1 disabled:opacity-50" title="Download" disabled={filteredData.length === 0}>
              <span>Download</span>
              <ArrowDownTrayIcon className="ml-1 w-6 h-6" />
            </button>
            <button onClick={handleReset} className="btn flex w-full mr-2 mt-1 disabled:opacity-50" title="Reset" disabled={filteredData.length === 0}>
              <span>Reset</span>
              <ArrowPathRoundedSquareIcon className="ml-1 w-6 h-6" />
            </button>
            <button onClick={handleSidebar} className="btn w-full mr-2 mt-1 disabled:opacity-50" title="Settings" disabled={filteredData.length === 0}>
              <CogIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
      {filteredData.length > 0 && (
        <main className="flex flex-col items-center space-y-5">
          <div className="flex items-center w-72 h-72 lg:w-[50vh] lg:h-[50vh] border-blue-500">
            <img className="object-fit" src={'./images/' + currentRow.SavedProductImage} alt={currentRow.Title} />
          </div>
          <div
            className={`w-48 text-center py-1 ${currentRow.MarkedAs === 'Kept' ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {currentRow.MarkedAs === 'Kept' ? 'Kept' : 'Removed'}
          </div>
          <h2 className="text-2xl font-bold mt-4 line-clamp-1 w-[60vw]" title={currentRow.Title}><span>{currentRow.Id}</span> - {currentRow.Title}</h2>
          <p className="text-lg text-right text-gray-700 mt-2 text-right w-[60vw]">Price: <span className="font-bold">{currentRow.Price}</span></p>
        </main>
      )}
      {filteredData.length > 0 && (
        <footer className="flex items-between w-full">
          <div className="w-full mr-2 mt-1 font-mono">
              <div title="~">Total Records: {data.length}</div>
              <div>Total Filtered: {filteredData.length}</div>
              <div>Total Kept: {totalKept}</div>
            </div>
          <div>
            <div className="flex my-4">
              <button onClick={handleRemove} className="btn flex mr-2" title="Marke as kept in the output excel file."><span>Remove</span><HandThumbDownIcon className="ml-1 w-6 h-6" /></button>
              <button onClick={handleKeep} className="btn flex ml-2" title="Marke as removed in the output excel file."><span>Keep</span><HandThumbUpIcon className="ml-1 w-6 h-6" /></button>
            </div>
            <div className="flex">
              <button onClick={handlePrev} className="btn flex mr-2"><ChevronDoubleLeftIcon className="ml-1 w-6 h-6" /></button>
              <button onClick={handleNext} className="btn flex ml-2"><ChevronDoubleRightIcon className="ml-1 w-6 h-6" /></button>
            </div>
          </div>
        </footer>
      )}
      <Sidebar isOpen={isOpen} excludeDuplicates={excludeDuplicates} setExcludeDuplicates={setExcludeDuplicates} excludeProductNotAvailable={excludeProductNotAvailable} setExcludeProductNotAvailable={setExcludeProductNotAvailable} excludePriceOnRequest={excludePriceOnRequest} setExcludePriceOnRequest={setExcludePriceOnRequest} excludeUsedParts={excludeUsedParts} setExcludeUsedParts={setExcludeUsedParts} excludeExistingProducts={excludeExistingProducts} setExcludeExistingProducts={setExcludeExistingProducts} excludeProductsWithDefaultImage={excludeProductsWithDefaultImage} setExcludeProductsWithDefaultImage={setExcludeProductsWithDefaultImage} excludeProductsWithNoImage={excludeProductsWithNoImage} setExcludeProductsWithNoImage={setExcludeProductsWithNoImage} />
    </div>
  );
}

export default App;
