const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API_BASE = 'http://localhost:5000/api';
let authToken = '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

const testRegister = async (email, password) => {
  console.log('\n--- 1. Testing Registration ---');
  try {
    await axios.post(`${API_BASE}/auth/register`, {
      name: "Test Farmer",
      email,
      password
    });
    console.log('Success: User registered. Check server terminal for OTP.');
  } catch (err) {
    console.error('Registration Error:', err.response?.data || err.message);
  }
};

const testVerify = async (email) => {
  console.log('\n--- 2. Testing OTP Verification ---');
  const otp = await askQuestion('Enter the 6-digit OTP seen in server terminal: ');
  try {
    const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, code: otp });
    console.log('Success:', res.data.message);
  } catch (err) {
    console.error('Verification Error:', err.response?.data || err.message);
  }
};

const testLogin = async (email, password) => {
  console.log('\n--- 3. Testing Login ---');
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    authToken = res.data.token;
    console.log('Success: Received JWT Token');
  } catch (err) {
    console.error('Login Error:', err.response?.data || err.message);
  }
};

const testImageUpload = async () => {
  console.log('\n--- 4. Testing Protected Image Upload ---');
  const form = new FormData();
  form.append('cropType', 'Banana');
  form.append('image', fs.createReadStream(path.join(__dirname, 'test_assets/sample.jpg')));

  try {
    const res = await axios.post(`${API_BASE}/reports/analyze`, form, {
      headers: { 
        ...form.getHeaders(),
        Authorization: `Bearer ${authToken}`
      }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Upload Error:', err.response?.data || err.message);
  }
};

const testVoiceUpload = async () => {
  console.log('\n--- 5. Testing Protected Voice Query ---');
  const form = new FormData();
  form.append('audio', fs.createReadStream(path.join(__dirname, 'test_assets/sample.wav')));

  try {
    const res = await axios.post(`${API_BASE}/voice/process`, form, {
      headers: { 
        ...form.getHeaders(),
        Authorization: `Bearer ${authToken}`
      }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Voice Error:', err.response?.data || err.message);
  }
};

const runAllTests = async () => {
  if (!fs.existsSync('./test_assets')) {
    console.log('Please create a "test_assets" folder with sample.jpg and sample.wav');
    process.exit(1);
  }

  const email = `farmer_${Date.now()}@test.com`;
  const password = "Password123!";

  await testRegister(email, password);
  await testVerify(email);
  await testLogin(email, password);
  
  if (authToken) {
    await testImageUpload();
    await testVoiceUpload();
  }

  console.log('\n--- All Tests Completed ---');
  rl.close();
};

runAllTests();