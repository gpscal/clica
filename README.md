# Clino

A CLI-only autonomous coding agent powered by Claude Sonnet and other AI models. Clino can create and edit files, run terminal commands, use the browser, and extend its capabilities through the Model Context Protocol (MCP).

## Features

- **Autonomous Coding**: AI-powered code generation, editing, and refactoring
- **File Operations**: Create, read, update, and delete files and directories
- **Command Execution**: Run shell commands and scripts with permission-based approval
- **Browser Automation**: Interact with web pages and applications
- **Multi-Model Support**: Works with Anthropic Claude, OpenAI GPT, Google Gemini, AWS Bedrock, and more
- **MCP Integration**: Extensible through Model Context Protocol servers
- **Project Understanding**: Analyzes codebases to provide context-aware assistance

## Quick Start

### Installation

```bash
npm install -g clino
```

### Usage

```bash
clino
```

This will start the Clino CLI interface where you can interact with the autonomous coding agent.

## Requirements

- Node.js 18.0.0 or higher
- Supported platforms: macOS, Linux (Windows support coming soon)
- Supported architectures: x64, arm64

## Configuration

Clino can be configured through:
- Environment variables
- Configuration files
- Command-line arguments

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed setup and deployment instructions.


## License

Apache-2.0 - see [LICENSE](./LICENSE) for details.
