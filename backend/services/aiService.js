const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

const analyzeImage = async (filePath) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  
  const response = await axios.post(`${FASTAPI_URL}/predict`, formData, {
    headers: formData.getHeaders()
  });
  return response.data;
};

const processAudio = async (filePath) => {
  const formData = new FormData();
  formData.append('audio', fs.createReadStream(filePath));
  
  const response = await axios.post(`${FASTAPI_URL}/transcribe`, formData, {
    headers: formData.getHeaders()
  });
  return response.data;
};

const processText = async (text) => {
  const res = await axios.post(`${FASTAPI_URL}/chat`, { text });
  return res.data;
};

module.exports = { analyzeImage, processAudio, processText };