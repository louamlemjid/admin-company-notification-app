import React, { useState } from 'react';
import plus from '../assets/image.png'
const BackgroundRemover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setOriginalImage(URL.createObjectURL(event.target.files[0]));
  };

  const removeBackground = async () => {
    console.log('triggered blob remover')
    if (!selectedFile) {
      alert('Please select an image file first.');
      return;
    }

    const formData = new FormData();
    formData.append('image_file', selectedFile);
    formData.append('size', 'auto');

    const apiKey = 'YNcGkTJBdvaM2KtqNQqu95fd';

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageDataURL = canvas.toDataURL('image/png');
        console.log(imageDataURL)
        window.electron.ipcRenderer.send('save-image',imageDataURL);
      };
      // window.electron.ipcRenderer.send('save-image',url)
      setOutputImage(url);
    } catch (error) {
      alert('Failed to remove background. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Background Remover</h1>
      <div className='inputImage'>
      <input type="file" accept="image/*" onChange={handleFileChange} id='inputImage'/>
      <label htmlFor="inputImage">
        <img src={!originalImage?plus:originalImage} alt="plus icon" width={170} />
      </label>
      </div>
      <button onClick={removeBackground} className='btn btn-warning' >Remove Background</button>
    </div>
  );
};

export default BackgroundRemover;
