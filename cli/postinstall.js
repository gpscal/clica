#!/usr/bin/env node

/**
 * Postinstall script to make clica binary available in PATH
 * This script creates a symlink or copies the binary to a directory in PATH
 */

const fs = require("fs")
const path = require("path")
const os = require("os")

const BINARY_NAME = "clica"
const BINARY_PATH = path.join(__dirname, "bin", BINARY_NAME)

// Common PATH directories (in order of preference)
const PATH_DIRS = [
	"/usr/local/bin", // macOS/Linux system-wide (requires sudo)
	path.join(os.homedir(), ".local", "bin"), // User-local (preferred)
	path.join(os.homedir(), "bin"), // Alternative user-local
]

function findWritablePathDir() {
	for (const dir of PATH_DIRS) {
		try {
			// Check if directory exists or can be created
			if (!fs.existsSync(dir)) {
				try {
					fs.mkdirSync(dir, { recursive: true })
				} catch (err) {
					continue // Can't create, try next
				}
			}

			// Check if we can write to it
			const testFile = path.join(dir, ".clica-install-test")
			try {
				fs.writeFileSync(testFile, "test")
				fs.unlinkSync(testFile)
				return dir
			} catch (err) {}
		} catch (err) {}
	}
	return null
}

function installBinary() {
	// Check if binary exists
	if (!fs.existsSync(BINARY_PATH)) {
		console.warn(`Warning: ${BINARY_NAME} binary not found at ${BINARY_PATH}`)
		console.warn("Skipping PATH installation. Binary may not be built yet.")
		return
	}

	// Find a writable directory in PATH
	const targetDir = findWritablePathDir()

	if (!targetDir) {
		console.warn(`Warning: Could not find a writable directory in PATH.`)
		console.warn(`Please manually add ${path.dirname(BINARY_PATH)} to your PATH.`)
		return
	}

	const targetPath = path.join(targetDir, BINARY_NAME)

	try {
		// Remove existing symlink or file if it exists
		if (fs.existsSync(targetPath)) {
			fs.unlinkSync(targetPath)
		}

		// Create symlink (preferred) or copy (fallback)
		try {
			fs.symlinkSync(BINARY_PATH, targetPath, "file")
			console.log(`✓ Created symlink: ${targetPath} -> ${BINARY_PATH}`)
		} catch (err) {
			// If symlink fails (e.g., on Windows or permission issues), copy instead
			fs.copyFileSync(BINARY_PATH, targetPath)
			fs.chmodSync(targetPath, 0o755)
			console.log(`✓ Copied binary to: ${targetPath}`)
		}

		console.log(`\n${BINARY_NAME} is now available in your PATH!`)
		console.log(`Run '${BINARY_NAME} --help' to verify installation.`)
	} catch (err) {
		console.error(`Error installing ${BINARY_NAME} to PATH:`, err.message)
		console.error(`Please manually add ${path.dirname(BINARY_PATH)} to your PATH.`)
		process.exit(1)
	}
}

// Only run if this is a global install or if explicitly requested
const isGlobalInstall =
	process.env.npm_config_global === "true" || process.argv.includes("--global") || process.env.CLICA_FORCE_INSTALL === "true"

if (isGlobalInstall) {
	installBinary()
} else {
	// For local installs, just verify the binary exists
	if (fs.existsSync(BINARY_PATH)) {
		console.log(`✓ ${BINARY_NAME} binary found at ${BINARY_PATH}`)
		console.log(`  To make it available globally, run: npm install -g ${BINARY_NAME}`)
	}
}
