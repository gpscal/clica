#!/usr/bin/env node
/**
 * Complete Cline to Clica rebranding script
 * This script replaces all remaining instances of "Cline" with "Clica"
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "fs"
import { join } from "path"

const rootDir = process.cwd()

// Files/directories to skip
const skipPatterns = [
	"node_modules",
	".git",
	"dist",
	"dist-standalone",
	"out",
	"build",
	".vscode",
	".next",
	"CHANGELOG.md", // Keep changelog history as-is
	"LICENSE", // Preserve original license
	"complete-rebrand.mjs", // This script itself
]

// Patterns to replace (order matters - more specific first)
const replacements = [
	// URLs
	{ from: /docs\.cline\.bot/g, to: "docs.clica.bot" },
	{ from: /cline\.bot/g, to: "clica.bot" },
	{ from: /cline\.ai/g, to: "clica.ai" },

	// GitHub URLs (if applicable)
	{ from: /github\.com\/cline\/cline/g, to: "github.com/clica/clica" },

	// Type/Interface/Class names
	{ from: /ClineMessage/g, to: "ClicaMessage" },
	{ from: /ClineApiReqInfo/g, to: "ClicaApiReqInfo" },
	{ from: /ClineAsk/g, to: "ClicaAsk" },
	{ from: /ClineSay/g, to: "ClicaSay" },
	{ from: /ClineApi/g, to: "ClicaApi" },
	{ from: /ClineFeature/g, to: "ClicaFeature" },
	{ from: /ClineError/g, to: "ClicaError" },
	{ from: /ClineRules/g, to: "ClicaRules" },
	{ from: /ClineIgnore/g, to: "ClicaIgnore" },
	{ from: /ClineDefaultTool/g, to: "ClicaDefaultTool" },
	{ from: /ClineToolSet/g, to: "ClicaToolSet" },
	{ from: /ClinePlanMode/g, to: "ClicaPlanMode" },
	{ from: /OpenClineSidebarPanel/g, to: "OpenClicaSidebarPanel" },
	{ from: /ToggleClineRule/g, to: "ToggleClicaRule" },

	// Variable/function names
	{ from: /clineMessages/g, to: "clicaMessages" },
	{ from: /clineRules/g, to: "clicaRules" },
	{ from: /globalClineRules/g, to: "globalClicaRules" },
	{ from: /localClineRules/g, to: "localClicaRules" },

	// Command tokens
	{ from: /__cline_command/g, to: "__clica_command" },

	// Proto package references
	{ from: /proto\/cline/g, to: "proto/clica" },
	{ from: /@clica\/cline/g, to: "@clica/clica" },

	// User-facing strings (case-sensitive, whole word)
	{ from: /\bCline\b/g, to: "Clica" },
	{ from: /\bCline's\b/g, to: "Clica's" },
	{ from: /\bcline\b/g, to: "clica" },
]

// Binary file extensions to skip
const binaryExtensions = [
	".png",
	".jpg",
	".jpeg",
	".gif",
	".ico",
	".svg",
	".wasm",
	".node",
	".exe",
	".dll",
	".so",
	".dylib",
	".zip",
	".tar",
	".gz",
	".map",
]

function shouldSkip(path) {
	const relativePath = path.replace(rootDir + "/", "")

	// Skip specific patterns
	if (skipPatterns.some((pattern) => relativePath.includes(pattern))) {
		return true
	}

	// Skip binary files
	if (binaryExtensions.some((ext) => path.endsWith(ext))) {
		return true
	}

	return false
}

function processFile(filePath) {
	if (shouldSkip(filePath)) {
		return false
	}

	try {
		let content = readFileSync(filePath, "utf8")
		let modified = false

		// Apply all replacements
		for (const { from, to } of replacements) {
			const newContent = content.replace(from, to)
			if (newContent !== content) {
				content = newContent
				modified = true
			}
		}

		if (modified) {
			writeFileSync(filePath, content, "utf8")
			console.log(`✓ Updated: ${filePath.replace(rootDir + "/", "")}`)
			return true
		}
	} catch (error) {
		if (error.code === "EISDIR") {
			// Skip directories
			return false
		}
		console.error(`✗ Error processing ${filePath}:`, error.message)
	}

	return false
}

function walkDirectory(dir) {
	let updatedCount = 0

	try {
		const entries = readdirSync(dir)

		for (const entry of entries) {
			const fullPath = join(dir, entry)

			if (shouldSkip(fullPath)) {
				continue
			}

			const stat = statSync(fullPath)

			if (stat.isDirectory()) {
				updatedCount += walkDirectory(fullPath)
			} else if (stat.isFile()) {
				if (processFile(fullPath)) {
					updatedCount++
				}
			}
		}
	} catch (error) {
		console.error(`✗ Error reading directory ${dir}:`, error.message)
	}

	return updatedCount
}

console.log("🔄 Starting Cline → Clica rebranding...\n")

const updatedFiles = walkDirectory(rootDir)

console.log(`\n✅ Rebranding complete! Updated ${updatedFiles} files.`)
console.log("\n📝 Next steps:")
console.log("1. Run: npm run check-types (to verify TypeScript compilation)")
console.log("2. Run: npm test -- --update-snapshots (to update test snapshots)")
console.log("3. Review changes: git diff")
console.log("4. Build: npm run compile")
