#!/usr/bin/env node
/**
 * Complete Cline to Clino rebranding script
 * This script replaces all remaining instances of "Cline" with "Clino"
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
	{ from: /docs\.cline\.bot/g, to: "docs.clino.bot" },
	{ from: /cline\.bot/g, to: "clino.bot" },
	{ from: /cline\.ai/g, to: "clino.ai" },

	// GitHub URLs (if applicable)
	{ from: /github\.com\/cline\/cline/g, to: "github.com/clino/clino" },

	// Type/Interface/Class names
	{ from: /ClineMessage/g, to: "ClinoMessage" },
	{ from: /ClineApiReqInfo/g, to: "ClinoApiReqInfo" },
	{ from: /ClineAsk/g, to: "ClinoAsk" },
	{ from: /ClineSay/g, to: "ClinoSay" },
	{ from: /ClineApi/g, to: "ClinoApi" },
	{ from: /ClineFeature/g, to: "ClinoFeature" },
	{ from: /ClineError/g, to: "ClinoError" },
	{ from: /ClineRules/g, to: "ClinoRules" },
	{ from: /ClineIgnore/g, to: "ClinoIgnore" },
	{ from: /ClineDefaultTool/g, to: "ClinoDefaultTool" },
	{ from: /ClineToolSet/g, to: "ClinoToolSet" },
	{ from: /ClinePlanMode/g, to: "ClinoPlanMode" },
	{ from: /OpenClineSidebarPanel/g, to: "OpenClinoSidebarPanel" },
	{ from: /ToggleClineRule/g, to: "ToggleClinoRule" },

	// Variable/function names
	{ from: /clineMessages/g, to: "clinoMessages" },
	{ from: /clineRules/g, to: "clinoRules" },
	{ from: /globalClineRules/g, to: "globalClinoRules" },
	{ from: /localClineRules/g, to: "localClinoRules" },

	// Command tokens
	{ from: /__cline_command/g, to: "__clino_command" },

	// Proto package references
	{ from: /proto\/cline/g, to: "proto/clino" },
	{ from: /@clino\/cline/g, to: "@clino/clino" },

	// User-facing strings (case-sensitive, whole word)
	{ from: /\bCline\b/g, to: "Clino" },
	{ from: /\bCline's\b/g, to: "Clino's" },
	{ from: /\bcline\b/g, to: "clino" },
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

console.log("🔄 Starting Cline → Clino rebranding...\n")

const updatedFiles = walkDirectory(rootDir)

console.log(`\n✅ Rebranding complete! Updated ${updatedFiles} files.`)
console.log("\n📝 Next steps:")
console.log("1. Run: npm run check-types (to verify TypeScript compilation)")
console.log("2. Run: npm test -- --update-snapshots (to update test snapshots)")
console.log("3. Review changes: git diff")
console.log("4. Build: npm run compile")
