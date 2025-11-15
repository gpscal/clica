---
title: CLINO
section: 1
header: User Commands
footer: Clino CLI 1.0
date: January 2025
---

# NAME

clino - orchestrate and interact with Clino AI coding agents

# SYNOPSIS

**clino** [*prompt*] [*options*]

**clino** *command* [*subcommand*] [*options*] [*arguments*]

# DESCRIPTION

Try: cat README.md | clino "Summarize this for me:"

**clino** is a command-line interface for orchestrating multiple Clino AI coding agents. Clino is an autonomous AI agent who can read, write, and execute code across your projects. He operates through a client-server architecture where **Clino Core** runs as a standalone service, and the CLI acts as a scriptable interface for managing tasks, instances, and agent interactions.

The CLI is designed for both interactive use and automation, making it ideal for CI/CD pipelines, parallel task execution, and terminal-based workflows. Multiple frontends (CLI, VSCode, JetBrains) can attach to the same Clino Core instance, enabling seamless task handoff between environments.

# MODES OF OPERATION

**Instant Task Mode**

:   The simplest invocation: **clino "prompt here"** immediately spawns an instance, creates a task, and enters chat mode. This is equivalent to running **clino instance new && clino task new && clino task chat** in sequence.

**Subcommand Mode**

:   Advanced usage with explicit control: **clino \<command\> [subcommand] [options]** provides fine-grained control over instances, tasks, authentication, and configuration.

# AGENT BEHAVIOR

Clino operates in two primary modes:

**ACT MODE**

:   Clino actively uses tools to accomplish tasks. He can read files, write code, execute commands, use a headless browser, and more. This is the default mode for task execution.

**PLAN MODE**

:   Clino gathers information and creates a detailed plan before implementation. He explores the codebase, asks clarifying questions, and presents a strategy for user approval before switching to ACT MODE.

# INSTANT TASK OPTIONS

When using the instant task syntax **clino "prompt"** the following options are available:

**-o**, **\--oneshot**

:   Full autonomous mode. Clino completes the task and stops following after completion. Example: clino -o "what's 6 + 8?"

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

**clino auth** [*provider*] [*key*]

**clino a** [*provider*] [*key*]

:   Configure authentication for AI model providers. Launches an interactive wizard if no arguments provided. If provider is specified without a key, prompts for the key or launches the appropriate OAuth flow.

## Instance Management

Clino Core instances are independent agent processes that can run in the background. Multiple instances can run simultaneously, enabling parallel task execution.

**clino instance**

**clino i**

:   Display instance management help.

**clino instance new** [**-d**|**\--default**]

**clino i n** [**-d**|**\--default**]

:   Spawn a new Clino Core instance. Use **\--default** to set it as the default instance for subsequent commands.

**clino instance list**

**clino i l**

:   List all running Clino Core instances with their addresses and status.

**clino instance default** *address*

**clino i d** *address*

:   Set the default instance to avoid specifying **\--address** in task commands.

**clino instance kill** *address* [**-a**|**\--all**]

**clino i k** *address* [**-a**|**\--all**]

:   Terminate a Clino Core instance. Use **\--all** to kill all running instances.

## Task Management

Tasks represent individual work items that Clino executes. Tasks maintain conversation history, checkpoints, and settings.

**clino task** [**-a**|**\--address** *ADDR*]

**clino t** [**-a**|**\--address** *ADDR*]

:   Display task management help. The **\--address** flag specifies which Clino Core instance to use (e.g., localhost:50052).

**clino task new** *prompt* [*options*]

**clino t n** *prompt* [*options*]

:   Create a new task in the default or specified instance. Options:

    **-s**, **\--setting** *setting* *value*
    :   Set task-specific settings

    **-y**, **\--no-interactive**, **\--yolo**
    :   Enable autonomous mode

    **-m**, **\--mode** *mode*
    :   Starting mode (act or plan)

**clino task open** *task-id* [*options*]

**clino t o** *task-id* [*options*]

:   Resume a previous task from history. Accepts the same options as **task new**.

**clino task list**

**clino t l**

:   List all tasks in history with their id and snippet

**clino task chat**

**clino t c**

:   Enter interactive chat mode for the current task. Allows back-and-forth conversation with Clino.

**clino task send** [*message*] [*options*]

**clino t s** [*message*] [*options*]

:   Send a message to Clino. If no message is provided, reads from stdin. Options:

    **-a**, **\--approve**
    :   Approve Clino's proposed action

    **-d**, **\--deny**
    :   Deny Clino's proposed action

    **-f**, **\--file** *FILE*
    :   Attach a file to the message

    **-y**, **\--no-interactive**, **\--yolo**
    :   Enable autonomous mode

    **-m**, **\--mode** *mode*
    :   Switch mode (act or plan)

**clino task view** [**-f**|**\--follow**] [**-c**|**\--follow-complete**]

**clino t v** [**-f**|**\--follow**] [**-c**|**\--follow-complete**]

:   Display the current conversation. Use **\--follow** to stream updates in real-time, or **\--follow-complete** to follow until task completion.

**clino task restore** *checkpoint*

**clino t r** *checkpoint*

:   Restore the task to a previous checkpoint state.

**clino task pause**

**clino t p**

:   Pause task execution.

## Configuration

Configuration can be set globally. Override these global settings for a task using the **\--setting** flag

**clino config**

**clino c**

**clino config set** *key* *value*

**clino c s** *key* *value*

:   Set a configuration variable.

**clino config get** *key*

**clino c g** *key*

:   Read a configuration variable.

**clino config list**

**clino c l**

:   List all configuration variables and their values.

# TASK SETTINGS

Task settings are persisted in the *~/.clino/x/tasks* directory. When resuming a task with **clino task open**, task settings are automatically restored.

Common settings include:

**yolo**

:   Enable autonomous mode (true/false)

**mode**

:   Starting mode (act/plan)

# NOTES & EXAMPLES

The **clino task send** and **clino task new** commands support reading from stdin, enabling powerful pipeline compositions:

```bash
cat requirements.txt | clino task send
echo "Refactor this code" | clino -y
```

## Instance Management

Manage multiple Clino instances:

```bash
# Start a new instance and make it default
clino instance new --default

# List all running instances
clino instance list

# Kill a specific instance
clino instance kill localhost:50052

# Kill all CLI instances
clino instance kill --all-cli
```

## Task History

Work with task history:

```bash
# List previous tasks
clino task list

# Resume a previous task
clino task open 1760501486669

# View conversation history
clino task view

# Start interactive chat with this task
clino task chat
```

# ARCHITECTURE

Clino operates on a three-layer architecture:

**Presentation Layer**

:   User interfaces (CLI, VSCode, JetBrains) that connect to Clino Core via gRPC

**Clino Core**

:   The autonomous agent service handling task management, AI model integration, state management, tool orchestration, and real-time streaming updates

**Host Provider Layer**

:   Environment-specific integrations (VSCode APIs, JetBrains APIs, shell APIs) that Clino Core uses to interact with the host system

# SEE ALSO

See the main README for documentation and usage information.

# COPYRIGHT

Copyright © 2025. Licensed under the Apache License 2.0.
