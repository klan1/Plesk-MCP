# Plesk MCP Server Design

## Overview
The Plesk MCP server provides a Model Context Protocol interface to manage a Plesk server. It allows LLMs to perform administrative tasks via the Plesk REST API.

## Architecture
- **Transport**: Stdio
- **API**: Plesk REST API v2
- **Authentication**: API Key passed via `X-API-Key` header

## Current Capabilities
- `plesk_list_domains`: List all domains.
- `plesk_get_domain_details`: Detailed info for a domain.
- `plesk_restart_service`: Restart system services.

## Planned Capabilities (v2)

### 1. Security Management
- **Fail2Ban**:
  - `plesk_fail2ban_check_ip`: Check if an IP is banned.
  - `plesk_fail2ban_unban_ip`: Remove an IP from the ban list.
  - `plesk_fail2ban_whitelist_ip`: Add an IP to the whitelist.
- **Firewall**:
  - `plesk_firewall_list_rules`: List current firewall rules.
  - `plesk_firewall_add_rule`: Create a new firewall rule.
  - `plesk_firewall_remove_rule`: Delete a firewall rule.

### 2. Server Health Monitoring
- `plesk_server_health`: Get CPU, RAM, and Disk usage.
- `plesk_server_status`: General server health and uptime.

### 3. DNS & Email Tools
- `plesk_dns_get_records`: Check DNS records for a domain.
- `plesk_mail_queue_status`: Check the current mail queue status.

### 4. Backup Management
- `plesk_backup_trigger`: Trigger a manual backup for a specific domain.

## API Endpoint Mapping (Proposed/TBD)
- Domains: `/api/v2/domains`
- Services: `/api/v2/services`
- Security: `/api/v2/security/...`
- Health: `/api/v2/server/...`
- DNS: `/api/v2/dns/...`
- Mail: `/api/v2/mail/...`
- Backup: `/api/v2/backup/...`
