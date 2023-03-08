import { AMOCStateId } from "../shared/constants";
import { getFloodWarningFTPClient } from "../shared/flood-warning-ftp-client";

export async function getFloodWarningList(stateId: string): Promise<string[]> {
  // ensure state param is valid
  let amocId: AMOCStateId | "" = "";
  if (!!stateId) {
    stateId = stateId.toUpperCase(); // make `stateId` case-insensitive
    amocId = AMOCStateId[stateId as keyof typeof AMOCStateId];
    if (!amocId) {
      return Promise.reject(new Error("invalid stateId"));
    }
  }

  const client = await getFloodWarningFTPClient();
  let warningList: string[] = [];
  try {
    const fileList = await client.list();

    // filter the files to find only `.amoc.xml` for the requested stateId
    warningList = fileList
      .filter(
        (file) =>
          file.name.endsWith(".amoc.xml") && file.name.startsWith(amocId)
      )
      .map((file) => file.name.replace(".amoc.xml", ""));
  } catch (error) {
    warningList = [];
  } finally {
    await client.close();
  }
  return Promise.resolve(warningList);
}
