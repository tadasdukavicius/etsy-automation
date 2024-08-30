const { url } = require("inspector");
const path = require("path");
const xlsx = require("xlsx");
const dotenv = require("dotenv");
const getRefreshToken = require("./refresh-token.js");

dotenv.config();

async function readExcelFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  const apiKeyString = process.env.API_KEY;
  const accessToken = process.env.ACCESS_TOKEN;
  const shopId = process.env.SHOP_ID;

  let headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  headers.append("x-api-key", apiKeyString);
  headers.append("Authorization", `Bearer ${accessToken}`);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i in data) {
    let urlencoded = new URLSearchParams();
    urlencoded.append("sku", data[i].sku);
    urlencoded.append("title", data[i].title);
    urlencoded.append("description", data[i].description);
    urlencoded.append("price", data[i].price);
    urlencoded.append("quantity", data[i].quantity);
    urlencoded.append("category", data[i].category);
    urlencoded.append("image_1", data[i].image_1);
    urlencoded.append("image_2", data[i].image_2);
    urlencoded.append("image_3", data[i].image_3);
    urlencoded.append("image_4", data[i].image_4);
    urlencoded.append("shipping_profile_id", data[i].shipping_profile_id);
    urlencoded.append("return_policy_id", data[i].return_policy_id);
    urlencoded.append("type", data[i].type);
    urlencoded.append("who_made", data[i].who_made);
    urlencoded.append("when_made", data[i].when_made);
    urlencoded.append("made_to_order", data[i].made_to_order);
    urlencoded.append("is_vintage", data[i].is_vintage);
    urlencoded.append("is_supply", data[i].is_supply);
    urlencoded.append("is_taxable", data[i].is_taxable);
    urlencoded.append("auto_renew", data[i].auto_renew);
    urlencoded.append("action", data[i].action);
    urlencoded.append("listing_state", data[i].listing_state);
    urlencoded.append("taxonomy_id", "132");

    let tags = [];
    tags.push(data[i].tag_1);
    tags.push(data[i].tag_2);
    tags.push(data[i].tag_3);
    tags.push(data[i].tag_4);
    tags.push(data[i].tag_5);
    tags.push(data[i].tag_6);
    tags.push(data[i].tag_7);
    tags.push(data[i].tag_8);
    tags.push(data[i].tag_9);
    tags.push(data[i].tag_10);
    tags.push(data[i].tag_11);
    tags.push(data[i].tag_12);
    tags.push(data[i].tag_13);
    urlencoded.append("tags", tags);

    let requestOptions = {
      method: "POST",
      headers,
      body: urlencoded,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://api.etsy.com/v3/application/shops/${shopId}/listings`,
        requestOptions
      );
    } catch {
      const token = getRefreshToken(apiKeyString);
      headers["Authorization"] = `Bearer ${token.access_token}`;
      const retryResponse = await axios.get(
        "https://api.etsy.com/v3/application/shops?shop_name=Terranobags",
        { headers }
      );
    }

    console.log(`Paused for 1 second before iteration ${i + 1}`);
    await delay(1000);
  }
}

const excelFilePath = path.join(__dirname, "data", "listings.xlsx");
readExcelFile(excelFilePath);
