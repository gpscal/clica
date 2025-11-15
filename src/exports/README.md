# Clino API

The Clino extension exposes an API that can be used by other extensions. To use this API in your extension:

1. Copy `src/extension-api/clino.d.ts` to your extension's source directory.
2. Include `clino.d.ts` in your extension's compilation.
3. Get access to the API with the following code:

    ```ts
    const clineExtension = vscode.extensions.getExtension<ClineAPI>("saoudrizwan.claude-dev")

    if (!clineExtension?.isActive) {
    	throw new Error("Clino extension is not activated")
    }

    const clino = clineExtension.exports

    if (clino) {
    	// Now you can use the API

    	// Start a new task with an initial message
    	await clino.startNewTask("Hello, Clino! Let's make a new project...")

    	// Start a new task with an initial message and images
    	await clino.startNewTask("Use this design language", ["data:image/webp;base64,..."])

    	// Send a message to the current task
    	await clino.sendMessage("Can you fix the @problems?")

    	// Simulate pressing the primary button in the chat interface (e.g. 'Save' or 'Proceed While Running')
    	await clino.pressPrimaryButton()

    	// Simulate pressing the secondary button in the chat interface (e.g. 'Reject')
    	await clino.pressSecondaryButton()
    } else {
    	console.error("Clino API is not available")
    }
    ```

    **Note:** To ensure that the `saoudrizwan.claude-dev` extension is activated before your extension, add it to the `extensionDependencies` in your `package.json`:

    ```json
    "extensionDependencies": [
        "saoudrizwan.claude-dev"
    ]
    ```

For detailed information on the available methods and their usage, refer to the `clino.d.ts` file.
