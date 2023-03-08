import fs from "fs";
import {
  AMOCProductType,
  AMOCServiceType,
  AMOCStateId,
} from "../shared/constants";
import { getFloodWarningFTPClient } from "../shared/flood-warning-ftp-client";
import { parseXml } from "../shared/parser";

export interface FloodWarningDetail {
  productType: AMOCProductType;
  service: AMOCServiceType;
  start: string;
  expiry: string;
  text: string;
}

export async function getFloodWarningDetail(
  warningId: string
): Promise<FloodWarningDetail> {
  const client = await getFloodWarningFTPClient();

  try {
    // first, try to download the `.xml` file
    // if this doesn't exist we throw an error
    try {
      await client.downloadTo(
        `./${warningId}.amoc.xml`,
        `${warningId}.amoc.xml`
      );
    } catch (error) {
      client.close();
      return Promise.reject(new Error(`invalid warningId`));
    }
    // parse the `.xml`
    // if the contents cannot be successfully read it will throw an error
    let fileContents: string;
    let parsedXml: { [key: string]: any };
    try {
      fileContents = fs.readFileSync(`./${warningId}.amoc.xml`, {
        encoding: "utf-8",
      });
      parsedXml = await parseXml(fileContents);
    } catch (error) {
      client.close();
      return Promise.reject(new Error(`failed to read ${warningId}.amoc.xml`));
    }

    // now let's fetch the data we're after
    // except for the text which we'll read later
    const service: AMOCServiceType | "Unknown" =
      AMOCServiceType[
        (parsedXml.amoc["service"] ?? [])[0] as keyof typeof AMOCServiceType
      ];
    const productType: AMOCProductType | "Unknown" =
      AMOCProductType[
        (parsedXml.amoc["product-type"] ??
          [])[0] as keyof typeof AMOCProductType
      ];
    const issueTime: string = (parsedXml.amoc["issue-time-utc"] || [])[0];
    const expiryTime: string = (parsedXml.amoc["expiry-time"] || [])[0];

    // now let's fetch the warning text from the `.txt` file
    let text: string;
    try {
      await client.downloadTo(`./${warningId}.txt`, `${warningId}.txt`);
      text = fs.readFileSync(`./${warningId}.txt`, {
        encoding: "utf-8",
      });
    } catch (error) {
      client.close();
      return Promise.reject(new Error(`failed to read ${warningId}.txt`));
    }

    client.close();
    return Promise.resolve({
      service: service,
      productType: productType,
      expiry: expiryTime,
      start: issueTime,
      text: text,
    });
  } catch (error) {
    client.close();
    console.log(error);
    return Promise.reject(error);
  }
}
