import React from 'react';

export default function DataTable({ filteredData }) {
  return (
    <div>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">ProductURL</th>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">ProductCat</th>
            <th className="px-4 py-2">ImageURL</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
              <td className="border px-4 py-2">{item.ProductURL}</td>
              <td className="border px-4 py-2">{item.product}</td>
              <td className="border px-4 py-2">{item.Price}</td>
              <td className="border px-4 py-2">{item.ProductCat}</td>
              <td className="border px-4 py-2">{item.ImageURL}</td>
              {/* Add more cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
