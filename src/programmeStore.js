const AWS = require("aws-sdk");

const s3 = new AWS.S3();

const getDates = async () => {
  try {
    const result = await s3
      .getObject({
        Bucket: process.env.BUCKET,
        Key: "dates.json",
      })
      .promise();
    const dates = JSON.parse(result.Body.toString("utf-8"));
    return dates;
  } catch (e) {
    console.error(`getDates() -- Error: ${e}`);
  }
  return [];
};

const saveDates = (dates) => {
  return s3
    .putObject({
      Bucket: process.env.BUCKET,
      Key: "dates.json",
      Body: JSON.stringify(dates),
    })
    .promise();
};

module.exports = {
  saveDates,
  getDates,
};
