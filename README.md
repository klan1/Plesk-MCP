# Plesk MCP Server (v2.1.0)

The Plesk MCP Server is a professional-grade Model Context Protocol (MCP) implementation that bridges Large Language Models (LLMs) with a Plesk server using a hybrid approach: **REST API** for standard management and **SSH** for deep system-level operations.

## 🚀 Value Proposition: Proactive Infrastructure Governance

Version 2.1.0 transforms the AI into a full-fledged System Administrator. By combining API calls with direct shell execution, it eliminates the "blind spots" of standard APIs.

### Key Capabilities:
- **Smarter Security**: Full Fail2Ban management (Unban/Whitelist) and Firewall rule control.
- **Deep Health Monitoring**: Proactive detection of Disk space and **Inode exhaustion** to prevent production crashes.
- **Subscription Insight**: Direct access to internal Plesk subscription lists to identify suspended accounts.
- **System Control**: Direct service restarts and manual backup triggers.

## 🛠️ Toolset Overview

### 🛡️ Security & SSH Tools (Hybrid)
- `plesk_list_suspended_subscriptions`: Uses SSH to fetch the real status of all subscriptions.
- `plesk_fail2ban_unban_ip`: Restores access for blocked IPs.
- `plesk_fail2ban_whitelist_ip`: Ensures trusted IPs are never banned.
- `plesk_firewall_list_rules`: Audit current server traffic rules.

### 📊 Health Observability
- `plesk_server_health_detailed`: Deep check of CPU, RAM, Disk, and **Inodes**.
- `plesk_server_status`: General system uptime and stability.

### 🌐 DNS, Mail & Backups
- `plesk_dns_get_records`: Retrieve DNS configurations.
- `plesk_mail_queue_status`: Monitor outbound mail delivery.
- `plesk_backup_trigger`: Execute immediate domain backups.
- `plesk_list_domains`: List all hosted domains.

## ⚙️ Configuration

### Environment Variables
The server requires both REST and SSH credentials:
- `PLESK_URL`: Base URL (e.g., `https://plesk.example.com:8443/`)
- `PLESK_API_KEY`: Plesk REST API key.
- `PLESK_SSH_HOST`: Server IP or Hostname.
- `PLESK_SSH_PORT`: SSH port (usually 22).
- `PLESK_SSH_USER`: SSH username (e.g., `root`).
- `PLESK_SSH_PASSWORD`: SSH password (or use `PLESK_SSH_KEY`).
- `PLESK_SSH_KEY`: Private SSH key string.

## 🏗️ Implementation Details
- **Transport**: Stdio
- **Protocols**: REST API v2 + SSH (Secure Shell)
- **Language**: Node.js (ES Modules)
- **Client**: Axios & ssh2

---

**Alejandro Trujillo Jiménez**

**Klan1 Labs - R&D Team**

**Website: klan1.com**
