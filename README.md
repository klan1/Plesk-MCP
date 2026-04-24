# Plesk MCP Server

This is a Model Context Protocol (MCP) server that provides a bridge between an AI assistant and a Plesk server via the Plesk REST API.

## 🚀 Features
- **Domain Management**: List and inspect domains on the server.
- **Service Control**: Ability to restart key system services.
- **Extensible**: Easy to add new tools as the Plesk API exploration continues.

## 🛠️ Installation
1. Clone this repository.
2. Run `npm install`.
3. Configure your environment variables:
   - `PLESK_URL`: Your Plesk panel URL (e.g., `https://your-plesk-server.com:8443/`)
   - `PLESK_API_KEY`: Your Plesk API key.

## ⚙️ Integration with OpenClaw
Register this server in your `mcp_config.json`:
```json
{
  "mcpServers": {
    "plesk": {
      "command": "node",
      "args": ["/path/to/plesk-mcp/index.js"],
      "env": {
        "PLESK_URL": "...",
        "PLESK_API_KEY": "..."
      }
    }
  }
}
```
