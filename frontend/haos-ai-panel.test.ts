import { afterEach, describe, expect, it, vi } from "vitest";

import "./haos-ai-panel";

afterEach(() => {
  document.body.replaceChildren();
});

describe("haos-ai-panel", () => {
  it("boots when Home Assistant assigns hass after connection", async () => {
    const sendMessagePromise = vi.fn().mockResolvedValue({
      version: "1.0.0",
      provider: "openai",
      model: "gpt-5.6",
      base_url: "https://api.openai.com/v1",
      provider_options: [{ id: "openai", label: "OpenAI", default_model: "gpt-5.6", default_base_url: "https://api.openai.com/v1" }],
      goal_presets: [{ id: "automation_cleanup", label: "Reduce automation hell" }],
      options: { schedule: "manual", history_days: 30 },
      suggestions: [],
      counts: { new: 0, saved: 0, dismissed: 0 },
      scan_runs: [],
      preferences: {
        goals: [],
        ignored_categories: [],
        ignored_entities: [],
        notes: [],
        quiet_hours: null,
      },
    });
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);

    panel.hass = { connection: { sendMessagePromise } };
    await panel.updateComplete;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    expect(sendMessagePromise).toHaveBeenCalledWith({
      type: "haos_ai/overview",
    });
    expect(panel.shadowRoot?.textContent).toContain("No new suggestions");
    expect(panel.shadowRoot?.textContent).not.toContain("Loading HAOS AI");
  });

  it("does not contact the backend until hass is available", async () => {
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    await panel.updateComplete;

    expect(panel.shadowRoot?.textContent).toContain("Loading HAOS AI");
  });

  it("shows an automation's plain-language explanation before its YAML", async () => {
    const sendMessagePromise = vi.fn().mockResolvedValue({
      version: "1.0.0",
      provider: "deepseek",
      model: "deepseek-v4-flash",
      base_url: "https://api.deepseek.com",
      provider_options: [{ id: "deepseek", label: "DeepSeek", default_model: "deepseek-v4-flash", default_base_url: "https://api.deepseek.com" }],
      goal_presets: [{ id: "automation_cleanup", label: "Reduce automation hell" }],
      options: { schedule: "manual", history_days: 30 },
      suggestions: [
        {
          id: "suggestion-1",
          title: "Light the hall after the door opens",
          summary: "A useful entry routine.",
          rationale: "The events repeatedly occur together.",
          kind: "automation",
          status: "new",
          confidence: 0.9,
          impact: "medium",
          created_at: new Date().toISOString(),
          evidence: [
            {
              source_type: "history",
              source_id: "binary_sensor.front_door",
              observation: "Repeatedly followed by the hall light.",
            },
          ],
          automation: {
            explanation:
              "When the front door opens, the hall light turns on.",
            yaml: "alias: Hall light",
            validation: { valid: true, errors: {} },
          },
        },
      ],
      counts: { new: 1, saved: 0, dismissed: 0 },
      scan_runs: [],
      preferences: {
        goals: [],
        ignored_categories: [],
        ignored_entities: [],
        notes: [],
        quiet_hours: null,
      },
    });
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise } };
    await panel.updateComplete;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    const row = panel.shadowRoot?.querySelector<HTMLButtonElement>(
      ".suggestion-row",
    );
    row?.click();
    await panel.updateComplete;

    const text = panel.shadowRoot?.textContent ?? "";
    expect(text).toContain("What the automation does");
    expect(text).toContain(
      "When the front door opens, the hall light turns on.",
    );
    expect(text.indexOf("What the automation does")).toBeLessThan(
      text.indexOf("Automation draft"),
    );

    const revise = [...(panel.shadowRoot?.querySelectorAll("ha-button") ?? [])].find(
      (button) => button.textContent?.includes("Revise in chat"),
    ) as HTMLElement | undefined;
    revise?.click();
    await panel.updateComplete;

    expect(
      panel.shadowRoot?.querySelector(".tabs button.active")?.textContent,
    ).toContain("Chat");
    expect(
      panel.shadowRoot?.querySelector<HTMLTextAreaElement>(".composer textarea")
        ?.value,
    ).toContain("alias: Hall light");
  });

  it("loads the local privacy ledger only when Activity is opened", async () => {
    const overview = {
      version: "1.0.0",
      provider: "openai",
      model: "gpt-5.6",
      base_url: "https://api.openai.com/v1",
      provider_options: [{ id: "openai", label: "OpenAI", default_model: "gpt-5.6", default_base_url: "https://api.openai.com/v1" }],
      goal_presets: [{ id: "automation_cleanup", label: "Reduce automation hell" }],
      options: { schedule: "manual", history_days: 30 },
      suggestions: [],
      counts: { new: 0, saved: 0, dismissed: 0 },
      scan_runs: [],
      threads: [],
      preferences: {
        goals: [],
        ignored_categories: [],
        ignored_entities: [],
        notes: [],
        quiet_hours: null,
      },
    };
    const sendMessagePromise = vi.fn().mockImplementation(({ type }) =>
      Promise.resolve(
        type === "haos_ai/activity"
          ? { scan_runs: [], receipts: [] }
          : overview,
      ),
    );
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise } };
    await panel.updateComplete;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    const activityTab = [...(panel.shadowRoot?.querySelectorAll(".tabs button") ?? [])]
      .find((button) => button.textContent?.includes("Activity")) as HTMLElement;
    activityTab.click();
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    expect(sendMessagePromise).toHaveBeenCalledWith({ type: "haos_ai/activity" });
    expect(panel.shadowRoot?.textContent).toContain("Privacy ledger");
  });

  it("searches and accepts pasted entity IDs in the ignored-entity picker", async () => {
    const overview = {
      version: "1.0.0",
      provider: "openai",
      model: "gpt-5.6",
      base_url: "https://api.openai.com/v1",
      provider_options: [{ id: "openai", label: "OpenAI", default_model: "gpt-5.6", default_base_url: "https://api.openai.com/v1" }],
      goal_presets: [{ id: "automation_cleanup", label: "Reduce automation hell" }],
      options: { schedule: "manual", history_days: 30 },
      suggestions: [],
      counts: { new: 0, saved: 0, dismissed: 0 },
      scan_runs: [],
      threads: [],
      preferences: {
        goals: [],
        ignored_categories: [],
        ignored_entities: [],
        notes: [],
        quiet_hours: null,
      },
    };
    const sendMessagePromise = vi.fn().mockResolvedValue(overview);
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = {
      states: {
        "light.kitchen": {
          entity_id: "light.kitchen",
          state: "on",
          attributes: { friendly_name: "Kitchen lights" },
        },
      },
      connection: { sendMessagePromise },
    };
    await panel.updateComplete;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    const settingsTab = [...(panel.shadowRoot?.querySelectorAll(".tabs button") ?? [])]
      .find((button) => button.textContent?.includes("Settings")) as HTMLElement;
    settingsTab.click();
    await panel.updateComplete;

    const input = panel.shadowRoot?.querySelector<HTMLInputElement>(
      ".entity-picker > input",
    );
    expect(input).toBeTruthy();
    input!.value = "kitchen";
    input!.dispatchEvent(new InputEvent("input", { bubbles: true }));
    await panel.updateComplete;
    expect(panel.shadowRoot?.textContent).toContain("Kitchen lights");

    const paste = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(paste, "clipboardData", {
      value: { getData: () => "sensor.pasted_one, binary_sensor.offline_item" },
    });
    input!.dispatchEvent(paste);
    await panel.updateComplete;
    const text = panel.shadowRoot?.textContent ?? "";
    expect(text).toContain("sensor.pasted_one");
    expect(text).toContain("binary_sensor.offline_item");
    expect(text).toContain("Not currently found");
  });
});
