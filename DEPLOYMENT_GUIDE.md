# Clino Deployment Guide

This guide covers setting up and deploying Clino CLI in a new environment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
- [Configuration](#configuration)
- [Building from Source](#building-from-source)
- [Development Setup](#development-setup)
- [Environment Variables](#environment-variables)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm equivalent)
- **Operating System**: macOS, Linux (Windows support coming soon)
- **Architecture**: x64 or arm64

### Required Tools

- **Go**: 1.21 or higher (for building CLI binary)
- **Git**: For cloning the repository
- **Make**: Optional, for using Makefile targets

### Optional Dependencies

- **Protobuf Compiler**: For protocol buffer compilation
- **TypeScript**: For development

## Installation Methods

### Method 1: npm Global Installation (Recommended)

```bash
# Install globally
npm install -g clino

# Verify installation
clino --version
```

### Method 2: Build from Source

See [Building from Source](#building-from-source) section below.

### Method 3: Using npx (No Installation)

```bash
# Run without installing
npx clino

# Or with specific version
npx clino@latest
```

## Configuration

### Initial Setup

1. **Run Clino for the first time**:
   ```bash
   clino
   ```

2. **Configure API Keys**:
   Clino will prompt you to configure your API keys. You can set them via:
   
   - **Environment Variables** (recommended):
     ```bash
     export ANTHROPIC_API_KEY="your-key-here"
     export OPENAI_API_KEY="your-key-here"
     # Or for OpenRouter
     export OPENROUTER_API_KEY="your-key-here"
     ```
   
   - **Configuration File**: Clino stores configuration in `~/.clino/data/settings.json`

3. **Verify Configuration**:
   ```bash
   clino --config
   ```

### Configuration File Location

- **macOS/Linux**: `~/.clino/data/`
- **Windows**: `%APPDATA%\clino\data\`

Configuration files:
- `settings.json` - User settings and preferences
- `globalState.json` - Global application state
- `secrets.json` - Encrypted API keys and secrets
- `workspaceState.json` - Workspace-specific state

## Building from Source

### Step 1: Clone the Repository

```bash
git clone https://github.com/clino/clino.git
cd clino
```

### Step 2: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Go dependencies (if building CLI)
cd cli
go mod download
cd ..
```

### Step 3: Build Protocol Buffers

```bash
# Build TypeScript protobuf definitions
npm run protos

# Build Go protobuf definitions
npm run protos-go
```

### Step 4: Build the Core Service

```bash
# Build standalone core (Node.js)
npm run compile-standalone

# This creates: dist-standalone/clino-core.js
```

### Step 5: Build the CLI Binary

```bash
# Build CLI for current platform
npm run compile-cli

# Build CLI for all platforms
npm run compile-cli-all-platforms

# CLI binaries will be in: cli/bin/
```

### Step 6: Install Locally

```bash
# Link the CLI globally
npm link

# Or install from local build
npm install -g .
```

## Development Setup

### Prerequisites for Development

```bash
# Install all dependencies including dev dependencies
npm install

# Install development tools
npm install -g typescript ts-node
```

### Development Workflow

1. **Watch Mode for Core Service**:
   ```bash
   # Terminal 1: Watch TypeScript compilation
   npm run watch:tsc

   # Terminal 2: Watch esbuild
   npm run watch:esbuild
   ```

2. **Development CLI Watch**:
   ```bash
   # Auto-rebuild and restart CLI on changes
   npm run dev:cli:watch
   ```

3. **Run Tests**:
   ```bash
   # Run unit tests
   npm run test:unit

   # Run all tests
   npm test
   ```

4. **Linting and Formatting**:
   ```bash
   # Check types
   npm run check-types

   # Lint code
   npm run lint

   # Format code
   npm run format

   # Auto-fix issues
   npm run format:fix
   ```

### Project Structure

```
clino/
├── cli/                    # Go CLI frontend
│   ├── bin/                # Compiled binaries
│   ├── cmd/                # CLI commands
│   └── pkg/                # Go packages
├── src/                    # TypeScript source
│   ├── core/               # Core functionality
│   ├── standalone/         # Standalone core entry point
│   ├── hosts/              # Host implementations
│   └── shared/             # Shared utilities
├── dist-standalone/        # Built standalone core
├── proto/                  # Protocol buffer definitions
└── scripts/                # Build and utility scripts
```

## Environment Variables

### API Configuration

```bash
# Anthropic API
export ANTHROPIC_API_KEY="sk-ant-..."

# OpenAI API
export OPENAI_API_KEY="sk-..."

# OpenRouter API
export OPENROUTER_API_KEY="sk-or-..."

# Google Gemini API
export GOOGLE_API_KEY="..."

# AWS Bedrock (requires AWS credentials)
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_REGION="us-east-1"
```

### Clino Configuration

```bash
# Clino directory (default: ~/.clino)
export CLINE_DIR="$HOME/.clino"

# Installation directory
export INSTALL_DIR="/path/to/clino"

# Workspace storage directory
export WORKSPACE_STORAGE_DIR="/path/to/workspace-storage"

# Development mode
export IS_DEV="true"

# Environment (production, staging, development)
export CLINE_ENVIRONMENT="production"
```

### Telemetry and Error Reporting

```bash
# Disable telemetry
export TELEMETRY_DISABLED="true"

# PostHog telemetry
export POSTHOG_TELEMETRY_ENABLED="true"

# OpenTelemetry
export OTEL_TELEMETRY_ENABLED="true"
export OTEL_EXPORTER_OTLP_ENDPOINT="https://..."
```

## Verification

### Check Installation

```bash
# Check version
clino --version

# Check help
clino --help

# Check configuration
clino --config
```

### Test Basic Functionality

```bash
# Start Clino
clino

# In the Clino prompt, try:
# - "Hello, can you help me?"
# - "List files in current directory"
# - "Create a test file"
```

### Verify Core Service

```bash
# Check if core service is running
ps aux | grep clino-core

# Check gRPC port (default: 50051)
lsof -i :50051
```

## Troubleshooting

### Common Issues

#### 1. "Command not found: clino"

**Solution**:
```bash
# Check if npm global bin is in PATH
echo $PATH | grep npm

# Add npm global bin to PATH (if missing)
export PATH="$PATH:$(npm config get prefix)/bin"

# Reinstall
npm install -g clino
```

#### 2. "Cannot connect to core service"

**Solution**:
```bash
# Check if core service is running
ps aux | grep clino-core

# Check port availability
lsof -i :50051

# Restart Clino
clino
```

#### 3. "API key not found"

**Solution**:
```bash
# Set API key via environment variable
export ANTHROPIC_API_KEY="your-key"

# Or configure via Clino
clino
# Then use: /config set api_key your-key
```

#### 4. Permission Denied Errors

**Solution**:
```bash
# Make CLI binary executable
chmod +x cli/bin/clino

# Check file permissions
ls -la cli/bin/clino
```

#### 5. Build Failures

**Solution**:
```bash
# Clean build artifacts
npm run clean:build

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run compile-standalone
npm run compile-cli
```

### Debug Mode

Enable debug logging:

```bash
# Set debug environment variable
export DEBUG="clino:*"

# Run Clino
clino
```

### Logs Location

- **macOS/Linux**: `~/.clino/data/logs/`
- **Windows**: `%APPDATA%\clino\data\logs\`

### Getting Help

- **GitHub Issues**: [https://github.com/clino/clino/issues](https://github.com/clino/clino/issues)
- **Discord**: [https://discord.gg/clino](https://discord.gg/clino)
- **Documentation**: [https://docs.clino.bot](https://docs.clino.bot)

## Production Deployment

### Docker Deployment (Coming Soon)

```bash
# Build Docker image
docker build -t clino:latest .

# Run container
docker run -it --rm \
  -e ANTHROPIC_API_KEY="your-key" \
  -v $(pwd):/workspace \
  clino:latest
```

### Systemd Service (Linux)

Create `/etc/systemd/system/clino.service`:

```ini
[Unit]
Description=Clino CLI Service
After=network.target

[Service]
Type=simple
User=your-user
Environment="ANTHROPIC_API_KEY=your-key"
ExecStart=/usr/local/bin/clino
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable clino
sudo systemctl start clino
```

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Secrets Storage**: Use environment variables or secure secret management
3. **File Permissions**: Ensure proper file permissions on configuration files
4. **Network Security**: Use HTTPS for all API communications
5. **Sandboxing**: Consider running Clino in a sandboxed environment for production

## Next Steps

- Read the [User Guide](./USER_GUIDE.md) for usage instructions
- Check [Contributing Guidelines](./CONTRIBUTING.md) for development
- Explore [Documentation](https://docs.clino.bot) for advanced features
