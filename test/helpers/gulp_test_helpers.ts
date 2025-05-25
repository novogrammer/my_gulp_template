import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { exec } from 'child_process';

export {};

// Common paths
export const ROOT = path.resolve(__dirname, '../..');
export const SRC = path.join(ROOT, "src");
export const DIST = path.join(ROOT, "dist");

/**
 * Run a command asynchronously
 */
export function runAsync(cmd: string, opts: { cwd: string }) {
  return new Promise((resolve, reject) => {
    exec(cmd, opts, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve({ stdout, stderr });
    });
  });
}

/**
 * Conditional describe function that only runs tests if this is the template project
 */
export const isTemplate = process.env.npm_package_name === 'my_gulp_template';
export const describeIfTemplate = isTemplate ? describe : describe.skip;

/**
 * Check if a file exists
 */
export function expectFileExists(filePath: string) {
  expect(existsSync(filePath)).toBe(true);
}

/**
 * Compare file sizes between two files
 */
export async function expectFileSizeEqualAsync(srcPath: string, destPath: string) {
  const srcStat = await fs.stat(srcPath);
  const destStat = await fs.stat(destPath);
  expect(destStat.size).toBe(srcStat.size);
}

/**
 * Check if a file is in WebP format
 */
export async function expectIsWebPFormatAsync(filePath: string) {
  const buffer = await fs.readFile(filePath);
  // 「RIFF」(0–3) と「WEBP」(8–11) のみ検証
  expect(buffer.slice(0, 4).toString('ascii')).toBe('RIFF');
  expect(buffer.slice(8, 12).toString('ascii')).toBe('WEBP');
}

/**
 * Check if a file is JavaScript
 */
export async function expectIsJavaScriptAsync(filePath: string) {
  const js = await fs.readFile(filePath, 'utf8');
  expect(js).toMatch(/'use strict';/);
}

/**
 * Check if a file is HTML
 */
export async function expectIsHTMLAsync(filePath: string) {
  const html = await fs.readFile(filePath, 'utf8');
  expect(html).toMatch(/<!DOCTYPE html>/);
}

/**
 * Check if a file is CSS
 */
export async function expectIsCSSAsync(filePath: string) {
  const css = await fs.readFile(filePath, 'utf8');
  expect(css).toMatch(/@charset "UTF-8";/);
}
