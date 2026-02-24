const express = require("express");
const app = express();

// YOUR VERIFICATION TOKEN - Change this to your own!
const VERIFICATION_TOKEN = "ebay_production_2024_secure_token_abc123xyz";

// Enable JSON parsing for POST requests
app.use(express.json());

// Handle GET requests (eBay's challenge validation)
app.get("*", (req, res) => {
  const challengeCode = req.query.challenge_code;
  
  console.log("=== GET Request ===");
  console.log("Challenge code:", challengeCode);
  console.log("Full query:", req.query);
  
  if (challengeCode) {
    const response = {
      challengeResponse: `${challengeCode}-${VERIFICATION_TOKEN}`
    };
    
    console.log("Sending response:", JSON.stringify(response));
    
    return res
      .status(200)
      .header("Content-Type", "application/json")
      .json(response);
  }
  
  // No challenge code - endpoint status check
  res.json({ 
    status: "eBay endpoint is active",
    timestamp: new Date().toISOString()
  });
});

// Handle POST requests (actual eBay notifications)
app.post("*", (req, res) => {
  console.log("=== POST Notification ===");
  console.log("Body:", JSON.stringify(req.body, null, 2));
  console.log("Headers:", req.headers);
  
  res.status(200).json({ 
    status: "received",
    timestamp: new Date().toISOString()
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 eBay endpoint server running on port ${PORT}`);
  console.log(`📍 Verification token: ${VERIFICATION_TOKEN}`);
});
```

4. Click **"Commit new file"**

### Step 3: Deploy to Render

1. Go back to Render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect account"** and authorize GitHub
4. Select your **`ebay-endpoint`** repository
5. Click **"Connect"**

### Step 4: Configure Render Service

- **Name:** `ebay-endpoint`
- **Environment:** **Node**
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** **Free**

Click **"Create Web Service"**

### Step 5: Wait for Deployment

- Wait 2-3 minutes for build to complete
- Once you see **"Live"** status, your endpoint is ready!

### Step 6: Get Your URL

At the top of your Render dashboard, you'll see your service URL:
```
https://ebay-endpoint-xxxx.onrender.com
```

Copy this URL!

### Step 7: Test Your Endpoint

Open in browser:
```
https://ebay-endpoint-xxxx.onrender.com?challenge_code=test123
