const axios = require("axios");
const qs = require("qs");
const dotenv = require("dotenv");
dotenv.config();

const refresh_token = process.env.REFRESH_TOKEN;

// Function to get access token
async function getRefreshToken(keyString) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = qs.stringify({
    grant_type: "refresh_token",
    client_id: keyString,
    refresh_token,
  });

  try {
    const response = await axios.post(
      "https://api.etsy.com/v3/public/oauth/token",
      data,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching access token:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

module.exports = getRefreshToken;
