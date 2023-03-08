// http://www.bom.gov.au/schema/v1.7/amoc.xsd
var parseString = require("xml2js").parseString;

/**
 * NOTE: I've refactored this to return a Promise, in keeping with the coding
 * style of the rest of the app, avoiding the use of callbacks.
 * @param xml
 * @returns
 */
export async function parseXml(xml: string): Promise<{ [key: string]: any }> {
  return new Promise((resolve, reject) => {
    try {
      parseString(xml, function (err: any, result: { [key: string]: any }) {
        if (!!err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
