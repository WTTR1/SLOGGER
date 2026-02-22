const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const SECRET = process.env.SECRET_KEY;

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

app.listen(3000, () => {
  console.log("Proxy running");
});
