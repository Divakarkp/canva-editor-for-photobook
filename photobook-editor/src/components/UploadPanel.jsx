function UploadPanel({ onUpload }) {

  const handleUpload = (e)=>{
    const file = e.target.files[0];
    if(file) onUpload(file);
  };

  return (
    <div className="sidebar">

      <h3>Upload</h3>

      <input type="file" onChange={handleUpload}/>

    </div>
  );
}

export default UploadPanel;