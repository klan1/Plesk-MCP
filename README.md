# Plesk MCP Server (v2.0.0)

The Plesk MCP Server is a high-performance Model Context Protocol (MCP) implementation that bridges Large Language Models (LLMs) with the Plesk REST API. By transforming administrative tasks into a set of standardized tools, it allows AI agents to manage hosting environments with precision and safety.

## 🚀 Value Proposition: The V2 Leap

Version 2.0.0 evolves the server from a simple domain viewer to a comprehensive administrative suite. The core value proposition of V2 is **Proactive Infrastructure Governance**.

### Key V2 Enhancements:
- **Security Hardening**: Integrated Fail2Ban and Firewall controls allow the AI to actively defend the server against brute-force attacks and unauthorized access in real-time.
- **Health Observability**: Real-time monitoring of CPU, RAM, and Disk usage enables the AI to detect resource bottlenecks and predict potential outages before they happen.
- **Service Reliability**: Direct access to DNS records and mail queue status streamlines the troubleshooting of delivery failures and resolution issues.
- **Data Assurance**: The ability to trigger manual backups ensures that critical changes can be preceded by a safety snapshot.

## 🛠️ Toolset Overview

### 🛡️ Security Management
- `plesk_fail2ban_check_ip`: Verify if an IP is banned.
- `plesk_fail2ban_unban_ip`: Restore access for a blocked IP.
- `plesk_fail2ban_whitelist_ip`: Prevent future bans for trusted IPs.
- `plesk_firewall_list_rules`: Audit current traffic rules.
- `plesk_firewall_add_rule`: Deploy new security rules.
- `plesk_firewall_remove_rule`: Clean up obsolete rules.

### 📊 Health Monitoring
- `plesk_server_health`: Get current resource utilization (CPU/RAM/Disk).
- `plesk_server_status`: Check overall system uptime and stability.

### 🌐 DNS & Email
- `plesk_dns_get_records`: Retrieve and analyze DNS configurations.
- `plesk_mail_queue_status`: Monitor outbound mail delivery performance.

### 📦 Backups & Core
- `plesk_backup_trigger`: Execute immediate domain backups.
- `plesk_list_domains`: List all hosted domains.
- `plesk_get_domain_details`: Deep-dive into domain configurations.
- `plesk_restart_service`: Manage system services (Apache, Nginx, MySQL).

## ⚙️ Configuration

### Environment Variables
The server requires the following environment variables:
- `PLESK_URL`: The base URL of your Plesk server (e.g., `https://plesk.example.com:8443/`).
- `PLESK_API_KEY`: Your Plesk REST API key.

## 🏗️ Implementation Details
- **Transport**: Stdio
- **API**: Plesk REST API v2
- **Language**: Node.js (ES Modules)
- **Client**: Axios

---
**Developed by the R&D Team**
*Engineering reliability and AI-driven infrastructure.*
