
/**
 * This function is used to get the request data from the request object.
 * 
 * @param {Body} req 
 * 
 * @returns {Promise} - returns a promise with the body of the request
 */
export function getReqData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
}