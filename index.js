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
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
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
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "plesk_list_domains") {
      const response = await pleskApi.get("/api/v2/domains");
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }

    if (name === "plesk_get_domain_details") {
      const response = await pleskApi.get(`/api/v2/domains/${args.domain}`);
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }

    if (name === "plesk_restart_service") {
      // Assuming an endpoint for service management exists in the API
      const response = await pleskApi.post(`/api/v2/services/restart`, { service: args.service });
      return { content: [{ type: "text", text: `Service ${args.service} restart requested successfully.` }] };
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
