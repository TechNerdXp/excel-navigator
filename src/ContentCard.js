function ContentCard({ content }) {
    return (
      <div className="content-card bg-white shadow-md rounded-lg p-6">
        <img src={'./images/' + content.Picture} alt={content.Title} className="w-full h-64 object-cover object-center rounded-lg" />
        <h2 className="text-2xl font-bold mt-4">{content.Title}</h2>
        <p className="text-lg text-gray-700 mt-2">Price: <span className="font-bold">{content.Price}</span></p>
      </div>
    );
  }
  
  export default ContentCard;
