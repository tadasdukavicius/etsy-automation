const axios = require("axios");
const { AuthorizationCode } = require("simple-oauth2");
const dotenv = require("dotenv");
const qs = require("qs");
const getRefreshToken = require("./refresh-token.js");
dotenv.config();

// Load environment variables
const etsyKeyString = process.env.API_KEY;

// Example token object (replace with your actual token details)
const token = {
  access_token: process.env.ACCESS_TOKEN,
  token_type: "Bearer",
  expires_in: 3600,
};

// Function to get the shop ID from Etsy API
async function getShopId(keyString, token) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${token.access_token}`,
    "x-api-key": keyString,
  };

  try {
    // Make a request to the Etsy API to get shop information
    const response = await axios.get(
      "https://api.etsy.com/v3/application/shops?shop_name=Terranobags",
      { headers }
    );
    console.log("Shop Info:", response.data);
  } catch (error) {
    // Check if the access token is expired and needs to be refreshed
    const token = await getRefreshToken(etsyKeyString);
    console.log("Access Token:", token);

    // Retry the request with the new token
    headers["Authorization"] = `Bearer ${token.access_token}`;
    const retryResponse = await axios.get(
      "https://api.etsy.com/v3/application/shops?shop_name=Terranobags",
      { headers }
    );
    console.log("Shop Info:", retryResponse.data);
  }
}

// Example usage
getShopId(etsyKeyString, token);
