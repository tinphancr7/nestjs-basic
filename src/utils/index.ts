import { Types } from "mongoose";
import NodeRSA from "node-rsa";

export function toObjectId(id: any): Types.ObjectId {
  return new Types.ObjectId(id);
}

export function encryptObject(publicKey: string, body: object) {
  const key = new NodeRSA();
  key.importKey(publicKey, "pkcs8-public-pem");
  return key.encrypt(JSON.stringify(body), "base64");
}
