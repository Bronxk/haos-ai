"""Constants for HAOS AI."""

from typing import Final

DOMAIN: Final = "haos_ai"
NAME: Final = "HAOS AI"
MIN_HA_VERSION: Final = "2026.7.0"
INTEGRATION_VERSION: Final = "1.0.3"

CONF_PROVIDER: Final = "provider"
CONF_MODEL: Final = "model"
CONF_BASE_URL: Final = "base_url"
CONF_API_KEY: Final = "api_key"
CONF_HISTORY_DAYS: Final = "history_days"
CONF_SCHEDULE: Final = "schedule"
CONF_SCHEDULE_TIME: Final = "schedule_time"
CONF_INCLUDE_EXACT_LOCATION: Final = "include_exact_location"
CONF_CONTEXT_CONFIRMATION: Final = "context_confirmation"
CONF_NOTIFY_NEW_SUGGESTIONS: Final = "notify_new_suggestions"
CONF_SCHEDULE_WEEKDAY: Final = "schedule_weekday"

PROVIDER_OPENAI: Final = "openai"
PROVIDER_ANTHROPIC: Final = "anthropic"
PROVIDER_DEEPSEEK: Final = "deepseek"
PROVIDER_OPENAI_COMPATIBLE: Final = "openai_compatible"
PROVIDERS: Final = (
    PROVIDER_OPENAI,
    PROVIDER_ANTHROPIC,
    PROVIDER_DEEPSEEK,
    PROVIDER_OPENAI_COMPATIBLE,
)
PROVIDER_LABELS: Final = {
    PROVIDER_OPENAI: "OpenAI",
    PROVIDER_ANTHROPIC: "Anthropic",
    PROVIDER_DEEPSEEK: "DeepSeek",
    PROVIDER_OPENAI_COMPATIBLE: "OpenAI-compatible",
}

DEFAULT_ENDPOINTS: Final = {
    PROVIDER_OPENAI: "https://api.openai.com/v1",
    PROVIDER_ANTHROPIC: "https://api.anthropic.com",
    PROVIDER_DEEPSEEK: "https://api.deepseek.com",
}

DEFAULT_MODELS: Final = {
    PROVIDER_OPENAI: "gpt-5.6",
    PROVIDER_ANTHROPIC: "claude-sonnet-5",
    PROVIDER_DEEPSEEK: "deepseek-v4-flash",
    PROVIDER_OPENAI_COMPATIBLE: "",
}

GOAL_PRESETS: Final = {
    "automation_discovery": "Find useful automations",
    "automation_cleanup": "Reduce automation hell",
    "entity_cleanup": "Clean up unavailable or unused entities",
    "reliability": "Improve reliability",
    "notification_noise": "Reduce notification noise",
    "energy_savings": "Save energy",
    "security_safety": "Improve security and safety",
    "device_health": "Maintain batteries and devices",
    "organization": "Improve naming and organization",
    "routines": "Simplify dashboards and routines",
    "privacy": "Improve privacy",
    "performance": "Find performance problems",
}

ADVISOR_MODES: Final = (
    "conservative",
    "balanced",
    "ambitious",
    "automation_hell",
)
SCAN_DEPTHS: Final = ("focused", "standard", "thorough")
AUTOMATION_COMPLEXITIES: Final = ("simple", "normal", "advanced")

SCHEDULE_MANUAL: Final = "manual"
SCHEDULE_DAILY: Final = "daily"
SCHEDULE_WEEKLY: Final = "weekly"
SCHEDULES: Final = (SCHEDULE_MANUAL, SCHEDULE_DAILY, SCHEDULE_WEEKLY)

PANEL_URL: Final = "haos-ai"
PANEL_COMPONENT: Final = "haos-ai-panel"
PANEL_ASSET_URL: Final = "/haos_ai/haos-ai-panel.js"
PANEL_MODULE_URL: Final = f"{PANEL_ASSET_URL}?v={INTEGRATION_VERSION}"

STORAGE_VERSION: Final = 1
STORAGE_KEY: Final = DOMAIN
MAX_SUGGESTIONS: Final = 200
MAX_CHAT_MESSAGES: Final = 100
RETENTION_DAYS: Final = 90

EVENT_TYPE: Final = f"{DOMAIN}/event"
DATA_RUNTIME: Final = "runtime"

DEFAULT_HISTORY_DAYS: Final = 30
DEFAULT_SCHEDULE: Final = SCHEDULE_MANUAL
DEFAULT_SCHEDULE_TIME: Final = "03:00:00"
DEFAULT_SCHEDULE_WEEKDAY: Final = 0
DEFAULT_NOTIFY_NEW_SUGGESTIONS: Final = True
DEFAULT_ADVISOR_MODE: Final = "balanced"
DEFAULT_SCAN_DEPTH: Final = "standard"
DEFAULT_AUTOMATION_COMPLEXITY: Final = "normal"

DEFAULT_CHANGE_PERMISSIONS: Final = {
    "create_automations": False,
    "update_automations": False,
    "remove_entities": False,
    "remove_devices": False,
}
