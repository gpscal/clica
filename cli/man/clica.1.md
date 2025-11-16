---
title: CLICA
section: 1
header: User Commands
footer: Clica CLI 1.0
date: January 2025
---

# NAME

clica - orchestrate and interact with Clica AI coding agents

# SYNOPSIS

**clica** [*prompt*] [*options*]

**clica** *command* [*subcommand*] [*options*] [*arguments*]

# DESCRIPTION

Try: cat README.md | clica "Summarize this for me:"

**clica** is a command-line interface for orchestrating multiple Clica AI coding agents. Clica is an autonomous AI agent who can read, write, and execute code across your projects. He operates through a client-server architecture where **Clica Core** runs as a standalone service, and the CLI acts as a scriptable interface for managing tasks, instances, and agent interactions.

The CLI is designed for both interactive use and automation, making it ideal for CI/CD pipelines, parallel task execution, and terminal-based workflows. Multiple frontends (CLI, VSCode, JetBrains) can attach to the same Clica Core instance, enabling seamless task handoff between environments.

# MODES OF OPERATION

**Instant Task Mode**

:   The simplest invocation: **clica "prompt here"** immediately spawns an instance, creates a task, and enters chat mode. This is equivalent to running **clica instance new && clica task new && clica task chat** in sequence.

**Subcommand Mode**

:   Advanced usage with explicit control: **clica \<command\> [subcommand] [options]** provides fine-grained control over instances, tasks, authentication, and configuration.

# AGENT BEHAVIOR

Clica operates in two primary modes:

**ACT MODE**

:   Clica actively uses tools to accomplish tasks. He can read files, write code, execute commands, use a headless browser, and more. This is the default mode for task execution.

**PLAN MODE**

:   Clica gathers information and creates a detailed plan before implementation. He explores the codebase, asks clarifying questions, and presents a strategy for user approval before switching to ACT MODE.

# INSTANT TASK OPTIONS

When using the instant task syntax **clica "prompt"** the following options are available:

**-o**, **\--oneshot**

:   Full autonomous mode. Clica completes the task and stops following after completion. Example: clica -o "what's 6 + 8?"

**-s**, **\--setting** *setting* *value*

:   Override a setting for this task

**-y**, **\--no-interactive**, **\--yolo**

:   Enable fully autonomous mode. Disables all interactivity:
    - ask_followup_question tool is disabled
    - attempt_completion happens automatically
    - execute_command runs in non-blocking mode with timeout
    - PLAN MODE automatically switches to ACT MODE

**-m**, **\--mode** *mode*

:   Starting mode. Options: **act** (default), **plan**

# GLOBAL OPTIONS

These options apply to all subcommands:

**-F**, **\--output-format** *format*

:   Output format. Options: **rich** (default), **json**, **plain**

**-h**, **\--help**

:   Display help information for the command.

**-v**, **\--verbose**

:   Enable verbose output for debugging.

# COMMANDS

## Authentication

**clica auth** [*provider*] [*key*]

**clica a** [*provider*] [*key*]

:   Configure authentication for AI model providers. Launches an interactive wizard if no arguments provided. If provider is specified without a key, prompts for the key or launches the appropriate OAuth flow.

## Instance Management

Clica Core instances are independent agent processes that can run in the background. Multiple instances can run simultaneously, enabling parallel task execution.

**clica instance**

**clica i**

:   Display instance management help.

**clica instance new** [**-d**|**\--default**]

**clica i n** [**-d**|**\--default**]

:   Spawn a new Clica Core instance. Use **\--default** to set it as the default instance for subsequent commands.

**clica instance list**

**clica i l**

:   List all running Clica Core instances with their addresses and status.

**clica instance default** *address*

**clica i d** *address*

:   Set the default instance to avoid specifying **\--address** in task commands.

**clica instance kill** *address* [**-a**|**\--all**]

**clica i k** *address* [**-a**|**\--all**]

:   Terminate a Clica Core instance. Use **\--all** to kill all running instances.

## Task Management

Tasks represent individual work items that Clica executes. Tasks maintain conversation history, checkpoints, and settings.

**clica task** [**-a**|**\--address** *ADDR*]

**clica t** [**-a**|**\--address** *ADDR*]

:   Display task management help. The **\--address** flag specifies which Clica Core instance to use (e.g., localhost:50052).

**clica task new** *prompt* [*options*]

**clica t n** *prompt* [*options*]

:   Create a new task in the default or specified instance. Options:

    **-s**, **\--setting** *setting* *value*
    :   Set task-specific settings

    **-y**, **\--no-interactive**, **\--yolo**
    :   Enable autonomous mode

    **-m**, **\--mode** *mode*
    :   Starting mode (act or plan)

**clica task open** *task-id* [*options*]

**clica t o** *task-id* [*options*]

:   Resume a previous task from history. Accepts the same options as **task new**.

**clica task list**

**clica t l**

:   List all tasks in history with their id and snippet

**clica task chat**

**clica t c**

:   Enter interactive chat mode for the current task. Allows back-and-forth conversation with Clica.

**clica task send** [*message*] [*options*]

**clica t s** [*message*] [*options*]

:   Send a message to Clica. If no message is provided, reads from stdin. Options:

    **-a**, **\--approve**
    :   Approve Clica's proposed action

    **-d**, **\--deny**
    :   Deny Clica's proposed action

    **-f**, **\--file** *FILE*
    :   Attach a file to the message

    **-y**, **\--no-interactive**, **\--yolo**
    :   Enable autonomous mode

    **-m**, **\--mode** *mode*
    :   Switch mode (act or plan)

**clica task view** [**-f**|**\--follow**] [**-c**|**\--follow-complete**]

**clica t v** [**-f**|**\--follow**] [**-c**|**\--follow-complete**]

:   Display the current conversation. Use **\--follow** to stream updates in real-time, or **\--follow-complete** to follow until task completion.

**clica task restore** *checkpoint*

**clica t r** *checkpoint*

:   Restore the task to a previous checkpoint state.

**clica task pause**

**clica t p**

:   Pause task execution.

## Configuration

Configuration can be set globally. Override these global settings for a task using the **\--setting** flag

**clica config**

**clica c**

**clica config set** *key* *value*

**clica c s** *key* *value*

:   Set a configuration variable.

**clica config get** *key*

**clica c g** *key*

:   Read a configuration variable.

**clica config list**

**clica c l**

:   List all configuration variables and their values.

# TASK SETTINGS

Task settings are persisted in the *~/.clica/x/tasks* directory. When resuming a task with **clica task open**, task settings are automatically restored.

Common settings include:

**yolo**

:   Enable autonomous mode (true/false)

**mode**

:   Starting mode (act/plan)

# NOTES & EXAMPLES

The **clica task send** and **clica task new** commands support reading from stdin, enabling powerful pipeline compositions:

```bash
cat requirements.txt | clica task send
echo "Refactor this code" | clica -y
```

## Instance Management

Manage multiple Clica instances:

```bash
# Start a new instance and make it default
clica instance new --default

# List all running instances
clica instance list

# Kill a specific instance
clica instance kill localhost:50052

# Kill all CLI instances
clica instance kill --all-cli
```

## Task History

Work with task history:

```bash
# List previous tasks
clica task list

# Resume a previous task
clica task open 1760501486669

# View conversation history
clica task view

# Start interactive chat with this task
clica task chat
```

# ARCHITECTURE

Clica operates on a three-layer architecture:

**Presentation Layer**

:   User interfaces (CLI, VSCode, JetBrains) that connect to Clica Core via gRPC

**Clica Core**

:   The autonomous agent service handling task management, AI model integration, state management, tool orchestration, and real-time streaming updates

**Host Provider Layer**

:   Environment-specific integrations (VSCode APIs, JetBrains APIs, shell APIs) that Clica Core uses to interact with the host system

# SEE ALSO

See the main README for documentation and usage information.

# COPYRIGHT

Copyright © 2025. Licensed under the Apache License 2.0.
