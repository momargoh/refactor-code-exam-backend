import express from "express";
import { Downloader } from "./floods/Downloader";
import { FloodWarningParser } from "./parser/floodWarning";
import { getFloodWarningList } from "./flood-warning-list/flood-warning-list";

require("./logger.ts");

const app = express();
const port = 3000;

const ERRORMESSAGE = "Something went wrong";

app.get("/", async (req, res) => {
  try {
    // fetch results from service
    const results = await getFloodWarningList(
      req.query.state?.toString() ?? ""
    );

    res.send(results);
  } catch (e: any) {
    console.log(e);

    // look specifically for `"invalid stateId"` error message
    // to give better error response for this common error
    let message: string, status: number;
    switch (e.message) {
      case "invalid stateId":
        status = 400;
        message = "invalid state query param";
        break;

      default:
        status = 500;
        message = e.message;
        break;
    }
    res.status(status).send({
      error: e.name,
      message: message,
    });
  }
});

app.get("/warning/:id", async (req, res) => {
  try {
    const downloader = new Downloader();
    const xmlid = req.params.id;

    const warning = await downloader.download(xmlid);
    const warningParser = new FloodWarningParser(warning);
    const text = await downloader.downloadText(xmlid);

    res.send({ ...(await warningParser.getWarning()), text: text || "" });
  } catch (error) {
    console.log(error);
    res.send(ERRORMESSAGE);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
