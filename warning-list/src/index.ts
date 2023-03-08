import express from "express";
import { getFloodWarningList } from "./flood-warning-list";

require("./logger.ts");

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Warning List listening at http://localhost:${port}`);
});
