import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export default (importMeta) => dirname(fileURLToPath(importMeta.url));
