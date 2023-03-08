import { Client } from "basic-ftp";

/**
 * NOTE: If there was a need to access other parts of the BOM server, you could instead create a base function that creates the Client, accesses the server and takes the CWD as an input parameter. Then you could refactor this function to simply pass in that CWD and create other functions for specifically accessing other parts of the server.
 * @returns FTP Client in the working directory of the flood warning data
 */
export async function getFloodWarningFTPClient(): Promise<Client> {
  const client: Client = new Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: "ftp.bom.gov.au",
      secure: false,
    });
    await client.cd("/anon/gen/fwo/");
    return Promise.resolve(client);
  } catch (e) {
    return Promise.reject("failed to access flood warning FTP server");
  }
}
