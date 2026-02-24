const express = require("express");
const app = express();

const VERIFICATION_TOKEN = "ebay_production_2024_secure_token_abc123xyz";

app.use(express.json());

app.get("*", (req, res) => {
  const challengeCode = req.query.challenge_code;
  
  console.log("GET Request received");
  console.log("Challenge code:", challengeCode);
  
  if (challengeCode) {
    const response = {
      challengeResponse: challengeCode + "-" + VERIFICATION_TOKEN
    };
    
    console.log("Sending response:", JSON.stringify(response));
    
    return res.status(200).json(response);
  }
  
  res.json({ 
    status: "eBay endpoint is active"
  });
});

app.post("*", (req, res) => {
  console.log("POST Notification received");
  console.log("Body:", JSON.stringify(req.body, null, 2));
  
  res.status(200).json({ 
    status: "received"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
