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
  const [isLoading, setisLoading] = useState(false);
  const fileInputRef = useRef();

  const [excludeDuplicates, setExcludeDuplicates] = useState(() => getLocalStorage('excludeDuplicates', false));
  const [excludeProductNotAvailable, setExcludeProductNotAvailable] = useState(() => getLocalStorage('excludeProductNotAvailable', false));
  const [excludePriceOnRequest, setExcludePriceOnRequest] = useState(() => getLocalStorage('excludePriceOnRequest', false));
  const [excludeCategories, setExcludeCategories] = useState(() => getLocalStorage('excludeCategories', false));
  const [excludeExistingProducts, setExcludeExistingProducts] = useState(() => getLocalStorage('excludeExistingProducts', false));
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
    localStorage.setItem('excludeCategories', JSON.stringify(excludeCategories));
    localStorage.setItem('excludeExistingProducts', JSON.stringify(excludeExistingProducts));
    localStorage.setItem('excludeProductsWithDefaultImage', JSON.stringify(excludeProductsWithDefaultImage));
    localStorage.setItem('excludeProductsWithNoImage', JSON.stringify(excludeProductsWithNoImage));
  }, [excludeDuplicates, excludeProductNotAvailable, excludePriceOnRequest, excludeCategories, excludeExistingProducts, excludeProductsWithDefaultImage, excludeProductsWithNoImage]);

  useEffect(() => {
    if (data) {
      const includedCategories = ['Alfetta', 'Giulia/Berlina', 'Giulietta (116)', 'GT Bertone', 'GT/V/6 (116)', 'Spider (105/115)'];
      const uniqueProductLinks = new Set();
      const filtered = data.filter(item => {
        console.log(item.Tree)
        if (item.Id === undefined) return false;
        if (excludeDuplicates && !uniqueProductLinks.has(item.ProductLink)) {
          uniqueProductLinks.add(item.ProductLink);
        } else if (excludeDuplicates) {
          return false;
        }
        if (excludeProductNotAvailable && item.IsAvailable !== 'Available 🟢') return false;
        if (excludePriceOnRequest && item.Price === 'On request') return false;
        if (excludeCategories && !includedCategories.includes(item.Tree.split('->')[0])) return false;
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
  }, [excludeDuplicates, excludeProductNotAvailable, excludePriceOnRequest, excludeCategories, excludeExistingProducts, excludeProductsWithDefaultImage, excludeProductsWithNoImage, data, currentIndex]);

  const handleFileUpload = (event) => {
    setisLoading(true)
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
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      setData(processedData);
      setcurrentIndex(0);
      setisLoading(false)
      localStorage.setItem('sheetData', JSON.stringify(processedData));
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
    setTimeout(() => {
      handleNext();
    }, 200);
  };

  const handleKeep = () => {
    const id = filteredData[currentIndex].Id;
    updateDataMarkedAs(id, 'Kept');
    setTimeout(() => {
      handleNext();
    }, 200);
  };

  const handleDownload = () => {
    const newWB = XLSX.utils.book_new();
    const newWS = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(newWB, newWS, 'Products');
    XLSX.writeFile(newWB, 'filtered_products.xlsx');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset?')) {
      localStorage.setItem('sheetData', JSON.stringify([]));
      localStorage.setItem('excludeDuplicates', false);
      localStorage.setItem('excludeProductNotAvailable', false);
      localStorage.setItem('excludePriceOnRequest', false);
      localStorage.setItem('excludeCategories', false);
      localStorage.setItem('excludeExistingProducts', false);
      localStorage.setItem('excludeProductsWithDefaultImage', false);
      localStorage.setItem('excludeProductsWithNoImage', false);
      setFilteredData([]);
      setData([]);
      fileInputRef.current.value = null;
      setcurrentIndex(0);
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowUp':
          handleKeep();
          break;
        case 'ArrowDown':
          handleRemove();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePrev, handleNext, handleKeep, handleRemove]);

  const currentRow = filteredData[currentIndex];

  return (
    <div className="flex flex-col items-center justify-between h-screen p-5 lg:w-[60vw] m-auto">
      <header className="flex justify-between w-full">
        <div>
          <input className="w-36 mr-2 mt-1 px-4 py-1 border-2 border-gray-300 rounded-md" type="number" value={inputValue} min={1} max={filteredData.length} onChange={handleIndexInput} disabled={filteredData.length === 0} title="Index" />
          <input ref={fileInputRef} className="cursor-pointer mt-1 w-36 lg:w-auto" type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap items-start justify-end">
          <button onClick={handleDownload} className="btn flex items-center w-full mr-2 mt-1 disabled:opacity-50" title="Download" disabled={filteredData.length === 0}>
            <span>Download</span>
            <ArrowDownTrayIcon className="ml-1 w-6 h-6" />
          </button>
          <button onClick={handleReset} className="btn flex items-center w-full mr-2 mt-1 disabled:opacity-50" title="Reset">
            <span>Reset</span>
            <ArrowPathRoundedSquareIcon className="ml-1 w-6 h-6" />
          </button>
          <button onClick={handleSidebar} className="btn w-full mr-2 mt-1 disabled:opacity-50" title="Settings">
            <CogIcon className="w-6 h-6" />
          </button>
        </div>
      </header>
      {isLoading && (
        <div className="h-[45vh]" role="status">
          <div class="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-500"></div>
          <span class="sr-only">Loading...</span>
        </div>
      )}
      {filteredData.length > 0 && (
        <main className="flex flex-col justify-center items-center space-y-5 w-full">
          {currentRow.SavedCatImage !== currentRow.SavedProductImage ? (
            <div className="flex justify-center items-center w-72 h-72 lg:w-full lg:h-[50vh] border-blue-500">
              <img className="object-contain w-1/2 h-full" src={'./images/' + currentRow.SavedProductImage} alt={currentRow['Final Result']} />
              <img className="object-contain w-1/2 h-full border-dotted border-l-2 border-gray-200" src={'./images/' + currentRow.SavedCatImage} alt={currentRow.Tree} />
            </div>
          ) : (
            <div className="flex justify-center items-center w-72 h-72 lg:w-full lg:h-[50vh] border-blue-500">
              <img className="object-contain w-full h-full" src={'./images/' + currentRow.SavedProductImage} alt={currentRow['Final Result']} />
            </div>
          )}


          <div
            className={`w-48 text-center py-1 ${currentRow.MarkedAs ? (currentRow.MarkedAs === 'Kept' ? 'bg-green-500' : 'bg-red-500') : ''} text-white`}
          >
            {currentRow.MarkedAs ? (currentRow.MarkedAs === 'Kept' ? 'Kept' : 'Removed') : '&nbsp;'}
          </div>
          <h2 className="text-2xl px-5 font-bold mt-4 line-clamp-1 w-full lg:w-[60vw]" title={currentRow['Final Result']}><span title="Index" className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-indigo-700 ring-1 ring-inset ring-indigo-700/10">{currentRow.ProductIndex}</span> - {currentRow['Final Result']}</h2>
          <p className="text-lg px-5 text-right text-gray-700 mt-2 w-full lg:w-[60vw]">Price: <span className="font-bold">{currentRow.Price}</span></p>
          <p className="text-lg px-5 text-gray-700 mt-2 w-full lg:w-[60vw]">{currentRow['Description']}</p>
        </main>
      )}
      {filteredData.length > 0 && (
        <footer className="flex items-between w-full">
          <div className="w-full flex flex-col justify-center font-mono">
            <div title="~"><span className="font-bold lg:font-normal">Total:</span> {data.length}</div>
            <div><span className="font-bold lg:font-normal">Filtered:</span> {filteredData.length}</div>
            <div><span className="font-bold lg:font-normal">Kept:</span> {totalKept}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex my-4">
              <button onClick={handleRemove} className="btn flex mr-2  active:bg-red-500" title="Marke as kept in the output excel file."><span>Remove</span><HandThumbDownIcon className="ml-1 w-6 h-6" /></button>
              <button onClick={handleKeep} className="btn flex ml-2 active:bg-green-500" title="Marke as removed in the output excel file."><span>Keep</span><HandThumbUpIcon className="ml-1 w-6 h-6" /></button>
            </div>
            <div className="flex">
              <button onClick={handlePrev} className="btn flex mr-2"><ChevronDoubleLeftIcon className="ml-1 w-6 h-6" /></button>
              <button onClick={handleNext} className="btn flex ml-2"><ChevronDoubleRightIcon className="ml-1 w-6 h-6" /></button>
            </div>
          </div>
        </footer>
      )}
      <Sidebar isOpen={isOpen} excludeDuplicates={excludeDuplicates} setExcludeDuplicates={setExcludeDuplicates} excludeProductNotAvailable={excludeProductNotAvailable} setExcludeProductNotAvailable={setExcludeProductNotAvailable} excludePriceOnRequest={excludePriceOnRequest} setExcludePriceOnRequest={setExcludePriceOnRequest} excludeCategories={excludeCategories} setExcludeCategories={setExcludeCategories} excludeExistingProducts={excludeExistingProducts} setExcludeExistingProducts={setExcludeExistingProducts} excludeProductsWithDefaultImage={excludeProductsWithDefaultImage} setExcludeProductsWithDefaultImage={setExcludeProductsWithDefaultImage} excludeProductsWithNoImage={excludeProductsWithNoImage} setExcludeProductsWithNoImage={setExcludeProductsWithNoImage} />
    </div>
  );
}

export default App;
