import express from "express";
import { getFloodWarningDetail } from "./flood-warning-detail";

require("./logger.ts");

const app = express();
const port = 3001;

app.get("/warning/:id", async (req, res) => {
  try {
    // fetch data from service
    const data = await getFloodWarningDetail(req.params.id);

    res.send(data);
  } catch (e: any) {
    console.log(e);

    // look specifically for `"invalid warningId"` error message
    // to give better error response for this common error
    let message: string, status: number;
    switch (e.message) {
      case "invalid warningId":
        status = 400;
        message = "invalid warning id param";
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
  console.log(`Warning Detail listening at http://localhost:${port}`);
});
