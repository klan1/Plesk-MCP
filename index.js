import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { Client } from "ssh2";

// Configuration from Env
const PLESK_URL = process.env.PLESK_URL || "https://your-plesk-server.com:8443/";
const PLESK_API_KEY = process.env.PLESK_API_KEY || "";
const SSH_HOST = process.env.PLESK_SSH_HOST || "your-server-ip";
const SSH_PORT = parseInt(process.env.PLESK_SSH_PORT || "22");
const SSH_USER = process.env.PLESK_SSH_USER || "root";
const SSH_PASSWORD = process.env.PLESK_SSH_PASSWORD || "";
const SSH_KEY = process.env.PLESK_SSH_KEY || "";

const pleskApi = axios.create({
  baseURL: PLESK_URL,
  headers: {
    "X-API-Key": PLESK_API_KEY,
    "Accept": "application/json"
  }
});

// Helper to execute SSH commands
async function executeSshCommand(command) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) return reject(err);
        let data = '';
        stream.on('data', (chunk) => { data += chunk; });
        stream.on('close', () => {
          conn.end();
          resolve(data.trim());
        });
      });
    }).on('error', (err) => reject(err)).connect({
      host: SSH_HOST,
      port: SSH_PORT,
      username: SSH_USER,
      password: SSH_PASSWORD,
      privateKey: SSH_KEY ? Buffer.from(SSH_KEY) : undefined,
    });
  });
}

const server = new Server({
  name: "plesk-mcp",
  version: "2.1.0"
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // REST Tools
    {
      name: "plesk_list_domains",
      description: "Retrieves a list of all domains on the Plesk server",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "plesk_get_domain_details",
      description: "Gets detailed configuration and status for a specific domain",
      inputSchema: {
        type: "object",
        properties: {
          domain: { type: "string", description: "The domain name" }
        },
        required: ["domain"]
      }
    },
    {
      name: "plesk_restart_service",
      description: "Restarts a specific system service (apache, nginx, mysql)",
      inputSchema: {
        type: "object",
        properties: {
          service: { type: "string", description: "The service name" }
        },
        required: ["service"]
      }
    },
    // Security Tools
    {
      name: "plesk_fail2ban_check_ip",
      description: "Check if a specific IP address is currently banned by Fail2Ban",
      inputSchema: {
        type: "object",
        properties: {
          ip: { type: "string", description: "The IP address to check" }
        },
        required: ["ip"]
      }
    },
    {
      name: "plesk_fail2ban_unban_ip",
      description: "Remove a specific IP address from the Fail2Ban ban list",
      inputSchema: {
        type: "object",
        properties: {
          ip: { type: "string", description: "The IP address to unban" }
        },
        required: ["ip"]
      }
    },
    {
      name: "plesk_fail2ban_whitelist_ip",
      description: "Add an IP address to the Fail2Ban whitelist",
      inputSchema: {
        type: "object",
        properties: {
          ip: { type: "string", description: "The IP address to whitelist" }
        },
        required: ["ip"]
      }
    },
    // SSH Powered Tools (V2.1)
    {
      name: "plesk_list_suspended_subscriptions",
      description: "Lists all suspended subscriptions using Plesk internal CLI",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "plesk_server_health_detailed",
      description: "Comprehensive health check: CPU, RAM, Disk space and Inode usage",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "plesk_backup_trigger",
      description: "Trigger a manual backup for a specific domain",
      inputSchema: {
        type: "object",
        properties: {
          domain: { type: "string", description: "The domain to back up" }
        },
        required: ["domain"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // REST API Tools
    if (name === "plesk_list_domains") {
      const response = await pleskApi.get("/api/v2/domains");
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }
    if (name === "plesk_get_domain_details") {
      const response = await pleskApi.get(`/api/v2/domains/${args.domain}`);
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }
    if (name === "plesk_restart_service") {
      const response = await pleskApi.post(`/api/v2/services/restart`, { service: args.service });
      return { content: [{ type: "text", text: `Service ${args.service} restart requested.` }] };
    }
    if (name === "plesk_fail2ban_check_ip") {
      const response = await pleskApi.get(`/api/v2/security/fail2ban/check`, { params: { ip: args.ip } });
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }
    if (name === "plesk_fail2ban_unban_ip") {
      const response = await pleskApi.post(`/api/v2/security/fail2ban/unban`, { ip: args.ip });
      return { content: [{ type: "text", text: `IP ${args.ip} unbanned.` }] };
    }
    if (name === "plesk_fail2ban_whitelist_ip") {
      const response = await pleskApi.post(`/api/v2/security/fail2ban/whitelist`, { ip: args.ip });
      return { content: [{ type: "text", text: `IP ${args.ip} whitelisted.` }] };
    }

    // SSH Powered Tools (V2.1)
    if (name === "plesk_list_suspended_subscriptions") {
      const output = await executeSshCommand("plesk bin subscription --list");
      return { content: [{ type: "text", text: `Full Subscription List:\n${output}` }] };
    }
    if (name === "plesk_server_health_detailed") {
      const disk = await executeSshCommand("df -h");
      const inodes = await executeSshCommand("df -i");
      const load = await executeSshCommand("uptime");
      return { content: [{ type: "text", text: `Server Health Report:\n\n--- LOAD ---\n${load}\n\n--- DISK SPACE ---\n${disk}\n\n--- INODES ---\n${inodes}` }] };
    }
    if (name === "plesk_backup_trigger") {
      const response = await pleskApi.post(`/api/v2/backup/trigger`, { domain: args.domain });
      return { content: [{ type: "text", text: `Backup triggered for ${args.domain}.` }] };
    }

    throw new Error(`Tool ${name} not found`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Plesk Error: ${error.response?.data?.message || error.message}` }]
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Plesk MCP Server v2.1 (Hybrid REST/SSH) running on stdio");
}

main().catch(console.error);
