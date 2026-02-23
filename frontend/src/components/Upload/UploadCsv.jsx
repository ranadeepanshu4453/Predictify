// UploadCsv.jsx
import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  X,
  Eye,
  Trash2,
  Download,
  BarChart3,
  Table,
  AlertTriangle,
  Loader
} from 'lucide-react';
import Layout from '../Layout/Layout';

const UploadCsv = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', 'warning'
  const [dragActive, setDragActive] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Handle file drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  }, []);

  // Handle file selection via input
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  // Validate file
  const validateAndSetFile = (file) => {
    setErrors([]);
    
    // Check if file exists
    if (!file) {
      setErrors(['No file selected']);
      return;
    }

    // Check file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      setErrors(['Invalid file type. Please upload a CSV file.']);
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrors(['File size exceeds 10MB limit']);
      return;
    }

    setFile(file);
    previewCSV(file);
  };

  // Preview CSV content
  const previewCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').slice(0, 5); // First 5 rows
      const data = lines.map(line => line.split(','));
      setPreviewData(data);
    };
    reader.readAsText(file);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;
  
    setUploading(true);
    setUploadStatus(null);
    setUploadProgress(0);
  
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  
    // API call
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
  
      // Actual API call to localhost
      const response = await fetch('http://localhost:3000/visualize/upload-csv', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Upload failed');
      }
  
      const result = await response.json();
      console.log(result);
      
      setUploadStatus('success');
      // Store file info in localStorage or state management
      const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
      uploadedFiles.push({
        id: result.file_id || Date.now(),
        name: file.name,
        size: file.size,
        date: new Date().toISOString(),
        rows: previewData ? previewData.length - 1 : 0,
        columns: previewData ? previewData[0].length : 0
      });
      localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
      
    } catch (error) {
      setUploadStatus('error');
      setErrors(['Upload failed. Please try again.']);
    } finally {
      clearInterval(interval);
      setUploading(false);
    }
  };
  // Remove file
  const handleRemoveFile = () => {
    setFile(null);
    setPreviewData(null);
    setUploadStatus(null);
    setUploadProgress(0);
    setErrors([]);
  };

  //Main Div
  return (
    <Layout>
      <div className="max-w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Upload CSV File</h1>
        <p className="text-gray-600 mt-1">
          Upload your CSV file for visualization and prediction analysis
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        
        {/* Drag & Drop Zone */}
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 transition-all
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
            ${file ? 'bg-gray-50' : 'bg-white'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv"
            onChange={handleFileSelect}
          />

          {!file ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Drag & drop your CSV file here
              </h3>
              <p className="text-gray-500 mb-4">
                or click to browse from your computer
              </p>
              <button
                onClick={() => document.getElementById('file-upload').click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select File
              </button>
              <p className="text-xs text-gray-400 mt-4">
                Supported formats: CSV (Max size: 10MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Progress Bar (shown during upload) */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="text-blue-600 font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {uploadStatus === 'success' && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span>File uploaded successfully!</span>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Upload failed. Please try again.</span>
                </div>
              )}

              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleUpload}
                  disabled={uploading || uploadStatus === 'success'}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                    ${uploading || uploadStatus === 'success'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  {uploading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload File</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                </button>

                <button
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Sample CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* File Preview */}
        {showPreview && previewData && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3 flex items-center space-x-2">
              <Table className="h-4 w-4" />
              <span>File Preview (First 5 rows)</span>
            </h3>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {previewData[0]?.map((header, index) => (
                      <th
                        key={index}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header || `Column ${index + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap"
                        >
                          {cell || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* File Statistics */}
        {file && previewData && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Rows</p>
              <p className="text-xl font-semibold text-gray-700">
                {previewData.length - 1}+
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Columns</p>
              <p className="text-xl font-semibold text-gray-700">
                {previewData[0]?.length || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">File Size</p>
              <p className="text-xl font-semibold text-gray-700">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        )}

        {/* Recent Uploads */}
        <div className="mt-8">
          <h3 className="font-medium text-gray-700 mb-4">Recent Uploads</h3>
          <RecentUploadsList />
        </div>

        {/* Tips Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>CSV Upload Tips</span>
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• File must be in CSV format with headers in the first row</li>
            <li>• Maximum file size is 10MB</li>
            <li>• For best results, ensure data is clean and properly formatted</li>
            <li>• Numeric columns will be used for visualization and prediction</li>
          </ul>
        </div>
      </div>
    </div>
    </Layout>
    
  );
};

// Recent Uploads List Component
const RecentUploadsList = () => {
  // Get recent uploads from localStorage
  const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]')
    .slice(-3)
    .reverse();

  if (uploadedFiles.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No recent uploads</p>
      </div>
    );
  }
  //Uploaded Files
  return (
       <div className="space-y-2">
      {uploadedFiles.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <FileText className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">{file.name}</p>
              <p className="text-xs text-gray-500">
                {new Date(file.date).toLocaleDateString()} • {file.rows} rows • {file.columns} columns
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-white rounded">
              <Eye className="h-4 w-4 text-gray-500" />
            </button>
            <button className="p-1 hover:bg-white rounded">
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </button>
            <button className="p-1 hover:bg-white rounded">
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
   
  );
};

export default UploadCsv;