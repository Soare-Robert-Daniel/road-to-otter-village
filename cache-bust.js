#!/usr/bin/env bun

/**
 * Cache Busting Script for main.mjs
 *
 * This script calculates a checksum of main.mjs and updates index.html
 * to include a cache-busting query parameter based on the file content.
 *
 * Usage:
 *   bun run cache-bust.js
 *   bun run cache-bust.js --dry-run    # Preview changes without applying them
 *   bun run cache-bust.js --verbose    # Show detailed output
 */

import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const PROJECT_ROOT = import.meta.dir;
const MAIN_JS_PATH = join(PROJECT_ROOT, "main.mjs");
const INDEX_HTML_PATH = join(PROJECT_ROOT, "index.html");

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isVerbose = args.includes("--verbose");

/**
 * Log function that respects verbose flag
 * @param {string} message - Message to log
 */
function log(message) {
  if (
    isVerbose ||
    message.startsWith("✅") ||
    message.startsWith("❌") ||
    message.startsWith("🎉")
  ) {
    console.log(message);
  }
}

/**
 * Check if required files exist
 */
function checkFiles() {
  if (!existsSync(MAIN_JS_PATH)) {
    console.error(`❌ main.mjs not found at: ${MAIN_JS_PATH}`);
    process.exit(1);
  }

  if (!existsSync(INDEX_HTML_PATH)) {
    console.error(`❌ index.html not found at: ${INDEX_HTML_PATH}`);
    process.exit(1);
  }

  log("✅ Required files found");
}

/**
 * Calculate MD5 checksum of a file
 * @param {string} filePath - Path to the file
 * @returns {string} - MD5 hash of the file content
 */
function calculateChecksum(filePath) {
  try {
    const fileContent = readFileSync(filePath);
    return createHash("md5").update(fileContent).digest("hex");
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Update index.html with cache-busting parameter
 * @param {string} checksum - The checksum to use for cache busting
 */
function updateIndexHtml(checksum) {
  try {
    let htmlContent = readFileSync(INDEX_HTML_PATH, "utf8");

    // Pattern to match the script tag with main.mjs
    const scriptPattern =
      /<script\s+src="\.\/main\.mjs(?:\?v=[^"]*)?"\s+type="module"\s+async><\/script>/;

    // New script tag with cache-busting parameter
    const newScriptTag = `<script src="./main.mjs?v=${checksum}" type="module" async></script>`;

    if (scriptPattern.test(htmlContent)) {
      // Check if the checksum is already up to date
      const currentMatch = htmlContent.match(/main\.mjs\?v=([^"]*)/);
      if (currentMatch && currentMatch[1] === checksum) {
        console.log(
          `✅ Cache-busting parameter is already up to date: v=${checksum}`
        );
        return;
      }

      if (isDryRun) {
        console.log(
          `🔍 DRY RUN: Would update cache-busting parameter to: v=${checksum}`
        );
        if (currentMatch) {
          console.log(`🔍 Current parameter: v=${currentMatch[1]}`);
        }
        return;
      }

      // Replace existing script tag
      htmlContent = htmlContent.replace(scriptPattern, newScriptTag);
      log(`✅ Updated cache-busting parameter: v=${checksum}`);
    } else {
      console.error("❌ Could not find main.mjs script tag in index.html");
      process.exit(1);
    }

    if (!isDryRun) {
      // Write the updated content back to the file
      writeFileSync(INDEX_HTML_PATH, htmlContent, "utf8");
      console.log("✅ Successfully updated index.html");
    }
  } catch (error) {
    console.error("Error updating index.html:", error.message);
    process.exit(1);
  }
}

/**
 * Main function
 */
function main() {
  if (isDryRun) {
    console.log("🔍 DRY RUN MODE - No files will be modified");
  }

  console.log("🚀 Starting cache busting process...");

  // Check if required files exist
  checkFiles();

  // Calculate checksum of main.mjs
  log("📊 Calculating checksum for main.mjs...");
  const checksum = calculateChecksum(MAIN_JS_PATH);
  console.log(`📋 Checksum: ${checksum}`);

  // Update index.html with the new checksum
  log("📝 Updating index.html...");
  updateIndexHtml(checksum);

  if (!isDryRun) {
    console.log("🎉 Cache busting completed successfully!");
  } else {
    console.log("🎉 Dry run completed!");
  }
}

// Run the script
main();
