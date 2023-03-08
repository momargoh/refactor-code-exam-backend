import { Client } from "basic-ftp";

export enum AMOCStateId {
  NT = "IDD",
  NSW = "IDN",
  QLD = "IDQ",
  SA = "IDS",
  TAS = "IDT",
  VIC = "IDV",
  WA = "IDW",
  ACT = "IDN",
}

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

  // access BOM server via FTP client
  const client: Client = new Client();
  client.ftp.verbose = true;

  // potential for error so wrap in a try-catch
  try {
    await client.access({
      host: "ftp.bom.gov.au",
      secure: false,
    });
    await client.cd("/anon/gen/fwo/");
  } catch (e) {
    return Promise.reject(new Error("failed to access BOM server"));
  }

  // read list of warnings
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
