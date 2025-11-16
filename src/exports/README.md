# Clica API

The Clica extension exposes an API that can be used by other extensions. To use this API in your extension:

1. Copy `src/extension-api/clica.d.ts` to your extension's source directory.
2. Include `clica.d.ts` in your extension's compilation.
3. Get access to the API with the following code:

    ```ts
    const clineExtension = vscode.extensions.getExtension<ClineAPI>("saoudrizwan.claude-dev")

    if (!clineExtension?.isActive) {
    	throw new Error("Clica extension is not activated")
    }

    const clica = clineExtension.exports

    if (clica) {
    	// Now you can use the API

    	// Start a new task with an initial message
    	await clica.startNewTask("Hello, Clica! Let's make a new project...")

    	// Start a new task with an initial message and images
    	await clica.startNewTask("Use this design language", ["data:image/webp;base64,..."])

    	// Send a message to the current task
    	await clica.sendMessage("Can you fix the @problems?")

    	// Simulate pressing the primary button in the chat interface (e.g. 'Save' or 'Proceed While Running')
    	await clica.pressPrimaryButton()

    	// Simulate pressing the secondary button in the chat interface (e.g. 'Reject')
    	await clica.pressSecondaryButton()
    } else {
    	console.error("Clica API is not available")
    }
    ```

    **Note:** To ensure that the `saoudrizwan.claude-dev` extension is activated before your extension, add it to the `extensionDependencies` in your `package.json`:

    ```json
    "extensionDependencies": [
        "saoudrizwan.claude-dev"
    ]
    ```

For detailed information on the available methods and their usage, refer to the `clica.d.ts` file.
