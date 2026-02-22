const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Railway environment variables
const SECRET = process.env.SECRET_KEY;
const API_KEY = process.env.API_KEY;       // LeakCheck API Key
const API_URL = process.env.API_URL;       // LeakCheck API endpoint
const PORT = process.env.PORT || 3000;

app.post("/proxy", async (req, res) => {
  try {
    const { secret, query } = req.body;

    // SECRET_KEY doğrulaması
    if (secret !== SECRET) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // LeakCheck API çağrısı
    const response = await axios.get(`${API_URL}?query=${encodeURIComponent(query)}`, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`
      }
    });

    // Sonucu Roblox’a geri gönder
    res.json(response.data);

  } catch (err) {
    res.status(500).json({
      error: "Request failed",
      details: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
