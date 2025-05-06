#!/usr/bin/env tsx
import { API_BASE_URL_DEV, API_BASE_URL_PROD } from "@/lib/constants/misc";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import openapiTS, { astToString } from "openapi-typescript";
import * as path from "path";
import ts from "typescript";
import { URL } from "url";

// pick up `development`|`production` from CLI, default to "development"
const rawEnv = process.argv[2] as string | undefined;
const envType = rawEnv === "production" ? "production" : "development";

const apiBaseUrl =
  envType === "development" ? API_BASE_URL_DEV : API_BASE_URL_PROD;

if (!apiBaseUrl) {
  console.error(`Error: API_BASE_URL_${envType.toUpperCase()} is not defined.`);
  process.exit(1);
}

console.log(`🛠  gen-openapi-types → using ${envType} @ ${apiBaseUrl}`);

// build our URLs / paths
const openApiUrl = `${apiBaseUrl.replace(/\/+$/, "")}/openapi.json`;
const tempFilePath = path.join(process.cwd(), "openapi.json");
const outputDir = path.join(process.cwd(), "lib", "types");
const outputPath = path.join(outputDir, "openapi-fetch.d.ts");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadSchema(): Promise<void> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(openApiUrl);
    const client = urlObj.protocol === "https:" ? https : http;

    console.log(`🌐  Downloading schema from ${openApiUrl}`);
    const req = client.get(openApiUrl, (res) => {
      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
        return reject(
          new Error(`Failed to fetch schema: HTTP ${res.statusCode}`)
        );
      }
      const out = fs.createWriteStream(tempFilePath);
      res.pipe(out);
      out.on("finish", () => (out.close(), resolve()));
    });

    req.on("error", (err) => reject(err));
  });
}

async function main(): Promise<void> {
  try {
    await downloadSchema();

    console.log("⚙️  Generating TypeScript types…");
    const schemaText = fs.readFileSync(tempFilePath, "utf8");
    const ast = await openapiTS(schemaText, {
      transform(schemaObject) {
        // date-time → Date | null
        if (schemaObject.format === "date-time") {
          const DATE = ts.factory.createTypeReferenceNode("Date");
          const NULL = ts.factory.createLiteralTypeNode(
            ts.factory.createNull()
          );
          return {
            schema: schemaObject.nullable
              ? ts.factory.createUnionTypeNode([DATE, NULL])
              : DATE,
            questionToken: true,
          };
        }
        // binary → File | null
        if (schemaObject.format === "binary") {
          const FILE = ts.factory.createTypeReferenceNode("File");
          const NULL = ts.factory.createLiteralTypeNode(
            ts.factory.createNull()
          );
          return {
            schema: schemaObject.nullable
              ? ts.factory.createUnionTypeNode([FILE, NULL])
              : FILE,
            questionToken: true,
          };
        }
      },
    });

    fs.writeFileSync(outputPath, astToString(ast), "utf8");
    fs.unlinkSync(tempFilePath);

    console.log(
      `✅  Types written to ${path.relative(process.cwd(), outputPath)}`
    );
  } catch (err) {
    console.error(
      "❌  gen-openapi-types failed:",
      err instanceof Error ? err.message : err
    );
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    process.exit(1);
  }
}

main();
