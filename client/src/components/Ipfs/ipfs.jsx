const IPFS = require("ipfs-api"); ////const ipfsApi

const projectId = "25aFLOpT6wwyHnAAvLlpH0oPodw";
const projectSecret = "4c269229af2949eb44e23418406f1319";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfs = new IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: auth,
  },
});

export default ipfs;
