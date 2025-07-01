// 1. Load environment variables and required packages
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// 2. Initialize the Express app
const app = express();
app.use(cors()); // Allow cross-origin requests from the frontend
app.use(express.json()); // Automatically parse JSON in incoming requests

// 3. Define the API route for generating text
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body; // Get the user's input from the request body

  try {
    // 4. Call the real LLM API with the model and prompt
    const response = await axios.post(
  "https://integrate.api.nvidia.com/v1/chat/completions", // NVIDIA’s actual endpoint
  {
    model: "meta/llama3-70b-instruct", // NVIDIA's LLaMA model ID
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  },
  {
    headers: {
      "Authorization": `Bearer ${process.env.LLM_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);

    // 5. Send the model's reply back to the frontend
    const message = response.data.choices[0].message.content;
    res.json({ content: message });

  } catch (error) {
    // 6. If something goes wrong, print the error and send a failure message
    console.error("LLM API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to call the LLM API." });
  }
});

// 7. Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});