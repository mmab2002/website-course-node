const axios = require('axios');

async function testBackend() {
  try {
    console.log('🧪 Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test auth endpoint
    const authResponse = await axios.get('http://localhost:5000/api/auth/profile');
    console.log('✅ Auth endpoint accessible');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running on port 5000');
      console.log('💡 Start it with: cd backend && npm run dev');
    } else if (error.response?.status === 401) {
      console.log('✅ Backend is running, auth endpoint accessible (401 expected without token)');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testBackend();
