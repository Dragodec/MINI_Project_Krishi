const axios = require('axios');

async function testFlow() {
    console.log("🚀 Testing the Login & AI Task Generation Flow...");

    try {
        // 1. Login
        console.log("\n[1/3] Attempting to login with farmer@atlas.com...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'farmer@atlas.com',
            password: '12345678'
        });
        
        console.log("✅ Login Successful! User:", loginRes.data.user?.name || "Farmer");
        
        // Extract auth token (assuming backend sets a cookie or returns a token)
        // Express might use cookies for JWT auth (`res.cookie('jwt', ...)`). 
        // We need to capture the 'set-cookie' header.
        const cookies = loginRes.headers['set-cookie'];
        let cookieHeader = '';
        if (cookies) {
            cookieHeader = cookies.join('; ');
        }
        
        // 2. Generate Tasks
        console.log("\n[2/3] Calling AI Task Generation Endpoint...");
        const taskRes = await axios.post('http://localhost:5000/api/tasks/generate', {
            crop: 'Banana',
            plantingDate: '2025-01-01'
        }, {
            headers: {
                Cookie: cookieHeader // Send the JWT cookie
            }
        });
        
        console.log("✅ AI Simulation Generated Tasks Successfully!");
        
        // 3. Output tasks
        console.log("\n[3/3] Retrieved Crop Calendar:");
        const tasks = taskRes.data;
        tasks.forEach((t, i) => {
            console.log(`  Task ${i+1}: ${t.title}`);
            console.log(`  └─ ${t.description}`);
            console.log(`  └─ Due: ${new Date(t.dueDate).toLocaleDateString()}`);
        });

    } catch (err) {
        console.error("❌ Test Failed:");
        if (err.response) {
            console.error(err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

testFlow();
