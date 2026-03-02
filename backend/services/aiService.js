const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

const processMultimodal = async (text, imagePath, audioPath) => {
    const formData = new FormData();
    if (text) formData.append('text', text);
    
    if (imagePath && fs.existsSync(imagePath)) {
        formData.append('image', fs.createReadStream(imagePath));
    }
    
    if (audioPath && fs.existsSync(audioPath)) {
        formData.append('audio', fs.createReadStream(audioPath));
    }

    const response = await axios.post(`${FASTAPI_URL}/process`, formData, {
        headers: { ...formData.getHeaders() }
    });
    
    return response.data;
};

module.exports = { processMultimodal };