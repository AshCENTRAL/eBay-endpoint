const express = require("express");
const crypto = require("crypto");
const app = express();

const VERIFICATION_TOKEN = "ebay_production_2024_secure_token_abc123xyz";

app.use(express.json());

app.get("*", (req, res) => {
  const challengeCode = req.query.challenge_code;
  
  console.log("=== GET Request ===");
  console.log("Challenge code:", challengeCode);
  
  if (challengeCode) {
    // Get the full endpoint URL
    const endpointUrl = `${req.protocol}://${req.get('host')}${req.path}`;
    
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
