const cheerio = require("cheerio");
const { default: axios } = require("axios");

module.exports.getProgramme = async () => {
  console.log("getProgramme() --");
  try {
    const { data } = await axios.get("http://vigszinhaz.hu/program.php?mid=Ua4bWjtxnpBkyr");
    const $ = cheerio.load(data);
    const dates = $(".event-info .date")
      .map((i, el) => {
        return el.children[0].data;
      })
      .get();
    return dates || [];
  } catch (e) {
    console.error(`getProgramme() -- Error when loading programme, ${e}`);
    throw e;
  }
};
