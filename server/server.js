const Hapi = require("hapi");
const axios = require("axios");

let config = {};
try {
  config = require("./config/local");
} catch (ex) {}

const server = Hapi.server({
  port: process.env.PORT || 8000,
  routes: {
    cors: {
      origin: ["*"]
    }
  }
});

server.route({
  method: "GET",
  path: "/query={query}",
  handler: async (req, h) => {
    let text;

    await axios
      .get("https://api.esv.org/v3/passage/html", {
        params: {
          q: req.params.query,
          "include-passage-references": false,
          "include-first-verse-numbers": false,
          "include-footnotes": false,
          "include-short-copyright": false
        },
        headers: { Authorization: process.env.token || config.token }
      })
      .then(res => {
        text = res.data;
      })
      .catch(err => {
        console.log(err);
      });

    return h.response(text);
  }
});

async function start() {
  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

start();
