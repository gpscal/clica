import { expect } from "chai"
import { describe, it } from "mocha"
import { validateDiffBlocks } from "./diff"

describe("validateDiffBlocks", () => {
	it("should pass validation for valid diff with different SEARCH and REPLACE content", () => {
		const diff = `------- SEARCH
# Old Title

Old description text
=======
# New Title

New description text
+++++++ REPLACE`

		const result = validateDiffBlocks(diff)
		expect(result.ok).to.equal(true)
	})

	it("should fail validation when SEARCH and REPLACE blocks are identical", () => {
		const diff = `------- SEARCH
# CLI Todo List Application

A simple command-line interface (CLI) todo list application written in Python.
=======
# CLI Todo List Application

A simple command-line interface (CLI) todo list application written in Python.
+++++++ REPLACE`

		const result = validateDiffBlocks(diff)
		expect(result.ok).to.equal(false)
		if (!result.ok) {
			expect(result.blockNumber).to.equal(1)
			expect(result.searchContent.trim()).to.equal(result.replaceContent.trim())
		}
	})

	it("should pass validation when REPLACE block is empty (deletion)", () => {
		const diff = `------- SEARCH
# Section to Delete

This content will be removed.
=======
+++++++ REPLACE`

		const result = validateDiffBlocks(diff)
		expect(result.ok).to.equal(true)
	})

	it("should pass validation when SEARCH block is empty (insertion)", () => {
		const diff = `------- SEARCH
=======
# New Section

This is new content being added.
+++++++ REPLACE`

		const result = validateDiffBlocks(diff)
		expect(result.ok).to.equal(true)
	})

	it("should fail validation for second block when first is valid but second has identical content", () => {
		const diff = `------- SEARCH
# First Section
=======
# First Section Modified
+++++++ REPLACE

------- SEARCH
# Second Section

This is identical in both blocks.
=======
# Second Section

This is identical in both blocks.
+++++++ REPLACE`

		const result = validateDiffBlocks(diff)
		expect(result.ok).to.equal(false)
		if (!result.ok) {
			expect(result.blockNumber).to.equal(2)
		}
	})

	it("should handle whitespace differences correctly", () => {
		const diff = `------- SEARCH
# Title
Content here
=======
# Title
  Content here
+++++++ REPLACE`

		const result = validateDiffBlocks(diff)
		// Should pass because trim() is used, but actual content has different whitespace
		expect(result.ok).to.equal(true)
	})

	it("should pass validation for multiple valid blocks", () => {
		const diff = `------- SEARCH
# Old Header
=======
# New Header
+++++++ REPLACE

------- SEARCH
Old footer text
=======
New footer text
+++++++ REPLACE`

		const result = validateDiffBlocks(diff)
		expect(result.ok).to.equal(true)
	})

	it("should handle legacy block markers", () => {
		const diff = `<<<<<<< SEARCH
# Old content
=======
# New content
>>>>>>> REPLACE`

		const result = validateDiffBlocks(diff)
		expect(result.ok).to.equal(true)
	})

	it("should fail validation with legacy markers when content is identical", () => {
		const diff = `<<<<<<< SEARCH
# Same content
=======
# Same content
>>>>>>> REPLACE`

		const result = validateDiffBlocks(diff)
		expect(result.ok).to.equal(false)
	})
})
