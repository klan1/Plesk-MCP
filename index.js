import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const PLESK_URL = process.env.PLESK_URL || "https://your-plesk-server.com:8443/";
const PLESK_API_KEY = process.env.PLESK_API_KEY || "";

const pleskApi = axios.create({
  baseURL: PLESK_URL,
  headers: {
    "X-API-Key": PLESK_API_KEY,
    "Accept": "application/json"
  }
});

const server = new Server({
  name: "plesk-mcp",
  version: "2.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // V1 Tools
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
      description: "Restarts a specific system service on the Plesk server",
      inputSchema: {
        type: "object",
        properties: {
          service: { type: "string", description: "The name of the service to restart (e.g., apache, nginx, mysql)" }
        },
        required: ["service"]
      }
    },
    // V2 Security Tools
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
      description: "Add an IP address to the Fail2Ban whitelist to prevent future bans",
      inputSchema: {
        type: "object",
        properties: {
          ip: { type: "string", description: "The IP address to whitelist" }
        },
        required: ["ip"]
      }
    },
    {
      name: "plesk_firewall_list_rules",
      description: "List all current firewall rules configured on the server",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "plesk_firewall_add_rule",
      description: "Add a new firewall rule to the server",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name of the rule" },
          port: { type: "string", description: "Port number or range" },
          protocol: { type: "string", description: "Protocol (TCP/UDP)" },
          action: { type: "string", description: "Action (allow/deny)" }
        },
        required: ["name", "port", "protocol", "action"]
      }
    },
    {
      name: "plesk_firewall_remove_rule",
      description: "Remove a specific firewall rule by its ID",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "The ID of the firewall rule to remove" }
        },
        required: ["id"]
      }
    },
    // V2 Health Monitoring Tools
    {
      name: "plesk_server_health",
      description: "Get real-time resource usage: CPU, RAM, and Disk space",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "plesk_server_status",
      description: "Get general server health status and system uptime",
      inputSchema: { type: "object", properties: {} }
    },
    // V2 DNS & Mail Tools
    {
      name: "plesk_dns_get_records",
      description: "Retrieve DNS records for a specific domain",
      inputSchema: {
        type: "object",
        properties: {
          domain: { type: "string", description: "The domain name" }
        },
        required: ["domain"]
      }
    },
    {
      name: "plesk_mail_queue_status",
      description: "Check the current status and size of the mail queue",
      inputSchema: { type: "object", properties: {} }
    },
    // V2 Backup Tools
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
    // V1 Tools
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
      return { content: [{ type: "text", text: `Service ${args.service} restart requested successfully.` }] };
    }

    // V2 Security - Fail2Ban
    if (name === "plesk_fail2ban_check_ip") {
      const response = await pleskApi.get(`/api/v2/security/fail2ban/check`, { params: { ip: args.ip } });
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }
    if (name === "plesk_fail2ban_unban_ip") {
      const response = await pleskApi.post(`/api/v2/security/fail2ban/unban`, { ip: args.ip });
      return { content: [{ type: "text", text: `IP ${args.ip} has been successfully unbanned.` }] };
    }
    if (name === "plesk_fail2ban_whitelist_ip") {
      const response = await pleskApi.post(`/api/v2/security/fail2ban/whitelist`, { ip: args.ip });
      return { content: [{ type: "text", text: `IP ${args.ip} has been added to the whitelist.` }] };
    }

    // V2 Security - Firewall
    if (name === "plesk_firewall_list_rules") {
      const response = await pleskApi.get(`/api/v2/security/firewall/rules`);
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }
    if (name === "plesk_firewall_add_rule") {
      const response = await pleskApi.post(`/api/v2/security/firewall/rules`, args);
      return { content: [{ type: "text", text: `Firewall rule '${args.name}' added successfully.` }] };
    }
    if (name === "plesk_firewall_remove_rule") {
      await pleskApi.delete(`/api/v2/security/firewall/rules/${args.id}`);
      return { content: [{ type: "text", text: `Firewall rule ${args.id} removed successfully.` }] };
    }

    // V2 Health Monitoring
    if (name === "plesk_server_health") {
      const response = await pleskApi.get(`/api/v2/server/health`);
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }
    if (name === "plesk_server_status") {
      const response = await pleskApi.get(`/api/v2/server/status`);
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }

    // V2 DNS & Mail
    if (name === "plesk_dns_get_records") {
      const response = await pleskApi.get(`/api/v2/dns/records`, { params: { domain: args.domain } });
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }
    if (name === "plesk_mail_queue_status") {
      const response = await pleskApi.get(`/api/v2/mail/queue`);
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }

    // V2 Backup
    if (name === "plesk_backup_trigger") {
      const response = await pleskApi.post(`/api/v2/backup/trigger`, { domain: args.domain });
      return { content: [{ type: "text", text: `Manual backup triggered for domain ${args.domain}.` }] };
    }

    throw new Error(`Tool ${name} not found`);
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Plesk API Error: ${error.response?.data?.message || error.message}` }]
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Plesk MCP Server running on stdio");
}

main().catch(console.error);
