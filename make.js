#!/usr/bin/env deno run --allow-read --allow-write --allow-env --allow-net --allow-run
// Usage: ./make.js command. Use -l to list commands.
// This is a set of tasks for building and testing Private-History-Filter in development.
import * as fs from "@std/fs";
import * as path from "@std/path";
import { desc, run, task } from "https://deno.land/x/drake@v1.5.1/mod.ts";
import JSON5 from "json5";

const projectPath = new URL(".", import.meta.url).pathname;

async function shell(procName, argsArray = []) {
  // NOTE(philc): Does drake's `sh` function work on Windows? If so, that can replace this function.
  if (Deno.build.os == "windows") {
    // if win32, prefix arguments with "/c {original command}"
    // e.g. "mkdir c:\git\private-history-filter" becomes "cmd.exe /c mkdir c:\git\private-history-filter"
    optArray.unshift("/c", procName);
    procName = "cmd.exe";
  }
  const p = Deno.run({ cmd: [procName].concat(argsArray) });
  const status = await p.status();
  if (!status.success) {
    throw new Error(`${procName} ${argsArray} exited with status ${status.code}`);
  }
}

function createFirefoxManifest(manifest) {
  manifest = JSON.parse(JSON.stringify(manifest)); // Deep clone.

  // As of 2023-07-08 Firefox doesn't yet support background.service_worker.
  delete manifest.background["service_worker"];
  Object.assign(manifest.background, {
    "scripts": ["background_script.js"],
  });

  Object.assign(manifest, {
    "browser_specific_settings": {
      "gecko": {
        // This ID is needed in development mode, or many extension APIs don't work.
        "id": "private-history-filter@github.com",
        "strict_min_version": "112.0",
      },
    },
  });

  return manifest;
}

async function parseManifestFile() {
  // Chrome's manifest.json supports JavaScript comment syntax. However, the Chrome Store rejects
  // manifests with JavaScript comments in them! So here we use the JSON5 library, rather than JSON
  // library, to parse our manifest.json and remove its comments.
  return JSON5.parse(await Deno.readTextFile("./manifest.json"));
}

// Builds a zip file for submission to the Chrome and Firefox stores. The output is in dist/.
async function buildStorePackage() {
  const excludeList = [
    "*.md",
    ".*",
    "MIT-LICENSE.txt",
    "dist",
    "deno*",
    "make.js",
  ];

  const chromeManifest = await parseManifestFile();

  await shell("rm", ["-rf", "dist/private-history-filter"]);
  await shell("mkdir", ["-p", "dist/private-history-filter", "dist/chrome-store", "dist/firefox"]);
  const rsyncOptions = ["-r", ".", "dist/private-history-filter"].concat(
    ...excludeList.map((item) => ["--exclude", item]),
  );
  await shell("rsync", rsyncOptions);

  const version = chromeManifest["version"];
  const writeDistManifest = async (manifestObject) => {
    await Deno.writeTextFile(
      "dist/private-history-filter/manifest.json",
      JSON.stringify(manifestObject, null, 2),
    );
  };

  // cd into "dist/private-history-filter" before building the zip, so that the files in the zip
  // don't each have the path prefix "dist/private-history-filter".
  // --filesync ensures that files in the archive which are no longer on disk are deleted. It's
  // equivalent to removing the zip file before the build.
  const zipCommand = "cd dist/private-history-filter && zip -r --filesync ";

  // Build the Firefox package
  const firefoxManifest = createFirefoxManifest(chromeManifest);
  await writeDistManifest(firefoxManifest);
  await shell("bash", ["-c", `${zipCommand} ../firefox/private-history-filter-firefox-${version}.zip .`]);

  // Build the Chrome Store package.
  writeDistManifest(chromeManifest);
  await shell("bash", [
    "-c",
    `${zipCommand} ../chrome-store/private-history-filter-chrome-store-${version}.zip .`,
  ]);
}

desc("Builds a zip file for submission to the Chrome store. The output is in dist/");
task("package", [], async () => {
  await buildStorePackage();
});

desc("Replaces manifest.json with a Firefox-compatible version, for development");
task("write-firefox-manifest", [], async () => {
  const firefoxManifest = createFirefoxManifest(await parseManifestFile());
  await Deno.writeTextFile("./manifest.json", JSON.stringify(firefoxManifest, null, 2));
});

run();
