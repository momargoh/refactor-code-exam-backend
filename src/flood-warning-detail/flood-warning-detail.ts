import {
  AMOCProductType,
  AMOCServiceType,
  AMOCStateId,
} from "../shared/constants";
import { getFloodWarningFTPClient } from "../shared/flood-warning-ftp-client";

export interface FloodWarningDetail {
  productType: AMOCProductType;
  service: AMOCServiceType;
  start: string; // NOTE could make this a Date
  expiry: string; // NOTE could make this a Date
}

export interface FloodWarningDetailWithText extends FloodWarningDetail {
  text: string;
}

export async function getFloodWarningDetail(
  warningId: string
): Promise<string[]> {
  const f: FloodWarningDetailWithText = { one: "none" };

  const client = await getFloodWarningFTPClient();
  const fileList = await client.list();

  // filter the files to find only `.amoc.xml` for the requested stateId
  const warningList: string[] = fileList
    .filter(
      (file) => file.name.endsWith(".amoc.xml") && file.name.startsWith(amocId)
    )
    .map((file) => file.name);

  return Promise.resolve(warningList);
}
