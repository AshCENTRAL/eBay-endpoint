const express = require("express");
const crypto = require("crypto");
const app = express();

const VERIFICATION_TOKEN = "ebay_production_2024_secure_token_abc123xyz";

// Trust proxy - important for Render
app.set('trust proxy', true);
app.use(express.json());

app.get("*", (req, res) => {
  const challengeCode = req.query.challenge_code;
  
  console.log("=== GET Request ===");
  console.log("Challenge code:", challengeCode);
  console.log("Full URL:", req.url);
  console.log("Query params:", req.query);
  
  if (challengeCode) {
    // Force HTTPS for the endpoint URL
    const endpointUrl = `https://${req.get('host')}${req.path}`;
    
    console.log("Endpoint URL:", endpointUrl);
    console.log("Verification Token:", VERIFICATION_TOKEN);
    
    // Hash: challenge_code + verification_token + endpoint_url
    const hashString = challengeCode + VERIFICATION_TOKEN + endpointUrl;
    const hash = crypto.createHash('sha256').update(hashString).digest('hex');
    
    console.log("Hash string:", hashString);
    console.log("SHA256 hash:", hash);
    
    const response = {
      challengeResponse: hash
    };
    
    console.log("Sending response:", JSON.stringify(response));
    
    return res
      .status(200)
      .header("Content-Type", "application/json")
      .json(response);
  }
  
  // No challenge code
  console.log("No challenge code provided");
  res.json({ status: "eBay endpoint is active" });
});

app.post("*", (req, res) => {
  console.log("=== POST Notification ===");
  console.log("Body:", JSON.stringify(req.body, null, 2));
  
  res.status(200).json({ status: "received" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  console.log("Verification token: " + VERIFICATION_TOKEN);
});
