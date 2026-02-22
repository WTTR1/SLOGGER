const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Environment Variables
const SECRET = process.env.SECRET_KEY;   // Roblox doğrulaması için
const API_KEY = process.env.API_KEY;      // LeakCheck API Key
const API_URL = process.env.API_URL;      // https://leakcheck.io/mass
const PORT = process.env.PORT || 3000;

app.post("/proxy", async (req, res) => {
  try {
    const { secret, query } = req.body;

    // SECRET_KEY doğrulaması
    if (secret !== SECRET) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // LeakCheck /mass endpoint’e POST isteği (API_KEY ile)
    const response = await axios.post(API_URL, { email: query }, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`
      }
    });

    // Yanıtı Roblox’a geri gönder
    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: "Request failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
