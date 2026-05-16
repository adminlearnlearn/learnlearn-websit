import { useState } from "react";

function UploadBox({ contentFile, setContentFile }) {

  const [isDragging, setIsDragging] = useState(false);
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
  ];

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload image or PDF only");
      return;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (validateFile(file)) {
      setContentFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (validateFile(file)) {
      setContentFile(file);
    }
  };

  return (
    <div className="upload-container">
      {/* Header */}
      <label
        htmlFor="file"
        className={`upload-header cursor-pointer ${
          isDragging ? "border-blue-600 bg-blue-50" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p  className="upload-text">Drag and Drop files here </p>
          <span>or</span>
          <span className="upload-subtext">Click to upload</span>

      </label>

      {/* Footer */}
      <div className="upload-footer">
        <svg
          className="file-icon"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path>
          <path d="M18.153 6h-.009v5.342H23.5v-.002z"></path>
        </svg>

        <p>{contentFile ? contentFile.name : "Not selected file"}</p>
        <button
          type="button"
          onClick={() => setContentFile(null)}
          className="delete-btn"
        >
        <svg
          className="delete-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 6H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 6L7 20C7.071 21.105 7.895 22 9 22H15C16.105 22 16.929 21.105 17 20L18 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 11V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 11V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        </button>
      </div>

      {/* Input */}
      <input
        id="file"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
    
  );
}

export default UploadBox;
