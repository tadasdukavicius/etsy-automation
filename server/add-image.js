const request = require("request");
const fs = require("fs");
const path = require("path");
const https = require("https");
// const { Readable } = require("stream");

function downloadImage(url, savePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(savePath);
    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close(resolve); // Resolve the promise when the file is done
          console.log("Download complete!");
        });
      })
      .on("error", (err) => {
        fs.unlink(savePath, () => {}); // Delete the file if error occurs
        reject(err); // Reject the promise on error
        console.error("Error downloading the image:", err.message);
      });
  });
}

async function addListingImage(listing_id, access_token, image_url, index) {
  const savePath = path.join(__dirname, `/data/downloaded_image_${index}.png`);
  await downloadImage(image_url, savePath);

  // const readableStream = await fetch(image_url).then((r) =>
  //   Readable.fromWeb(r.body)
  // );
  // console.log(readableStream);
  // console.log("image_url", image_url);

  const test = fs.createReadStream(`./data/downloaded_image_${index}.png`);

  let options = {
    method: "POST",
    url: `https://openapi.etsy.com/v3/application/shops/43371490/listings/${listing_id}/images`,
    headers: {
      "Content-Type": "multipart/form-data",
      "x-api-key": "1oz5mcrhjoygchh26getouzg",
      Authorization: `Bearer ${access_token}`,
    },
    formData: {
      image: {
        value: test,
        options: {
          filename: "image.png",
          contentType: null,
        },
      },
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

module.exports = addListingImage;
