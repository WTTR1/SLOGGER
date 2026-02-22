const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Railway environment variable
const SECRET = process.env.SECRET_KEY;
const PORT = process.env.PORT || 3000; // Railway PORT değişkenini kullan

app.post("/proxy", async (req, res) => {
  try {
    const { secret, url, method, body, headers } = req.body;

    if (secret !== SECRET) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const response = await axios({
      method: method || "GET",
      url: url,
      headers: headers || {},
      data: body || {}
    });

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
