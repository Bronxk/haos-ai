import { afterEach, describe, expect, it, vi } from "vitest";

import "./haos-ai-panel";

afterEach(() => {
  document.body.replaceChildren();
});

describe("haos-ai-panel", () => {
  it("boots when Home Assistant assigns hass after connection", async () => {
    const sendMessagePromise = vi.fn().mockResolvedValue({
      version: "1.0.1",
      provider: "openai",
      model: "gpt-6.1-sol",
      base_url: "https://api.openai.com/v1",
      provider_options: [{ id: "openai", label: "OpenAI", default_model: "gpt-6.1-sol", default_base_url: "https://api.openai.com/v1" }],
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
      version: "1.0.1",
      provider: "deepseek",
      model: "deepseek-flash",
      base_url: "https://api.deepseek.com",
      provider_options: [{ id: "deepseek", label: "DeepSeek", default_model: "deepseek-flash", default_base_url: "https://api.deepseek.com" }],
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
      version: "1.0.1",
      provider: "openai",
      model: "gpt-6.1-sol",
      base_url: "https://api.openai.com/v1",
      provider_options: [{ id: "openai", label: "OpenAI", default_model: "gpt-6.1-sol", default_base_url: "https://api.openai.com/v1" }],
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
      version: "1.0.1",
      provider: "openai",
      model: "gpt-6.1-sol",
      base_url: "https://api.openai.com/v1",
      provider_options: [{ id: "openai", label: "OpenAI", default_model: "gpt-6.1-sol", default_base_url: "https://api.openai.com/v1" }],
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

  it("selects DeepSeek from the connected endpoint instead of defaulting to OpenAI", async () => {
    const overview = {
      version: "1.0.2",
      provider: "openai",
      model: "deepseek-flash",
      base_url: "https://api.deepseek.com",
      provider_options: [
        { id: "openai", label: "OpenAI", default_model: "gpt-6.1-sol", default_base_url: "https://api.openai.com/v1" },
        { id: "deepseek", label: "DeepSeek", default_model: "deepseek-flash", default_base_url: "https://api.deepseek.com" },
      ],
      goal_presets: [],
      options: { schedule: "manual", history_days: 30 },
      suggestions: [],
      counts: { new: 0, saved: 0, dismissed: 0 },
      scan_runs: [],
      preferences: {
        goals: [], ignored_categories: [], ignored_entities: [], notes: [], quiet_hours: null,
      },
    };
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise: vi.fn().mockResolvedValue(overview) } };
    await panel.updateComplete;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    const settingsTab = [...(panel.shadowRoot?.querySelectorAll(".tabs button") ?? [])]
      .find((button) => button.textContent?.includes("Settings")) as HTMLElement;
    settingsTab.click();
    await panel.updateComplete;

    expect(panel.shadowRoot?.querySelector<HTMLSelectElement>(".settings-fields select")?.value)
      .toBe("deepseek");
    expect(panel.shadowRoot?.textContent).toContain("I WANT AUTOMATION HELL");
  });

  it("requires a second explicit click before creating an automation", async () => {
    const suggestion = {
      id: "suggestion-approval",
      approval_revision: "revision-create",
      title: "Approved hall light",
      summary: "Create a hall light routine.",
      rationale: "The pattern is repeated.",
      kind: "automation",
      status: "new",
      confidence: 0.9,
      impact: "medium",
      created_at: new Date().toISOString(),
      evidence: [{ source_type: "history", source_id: "light.hall", observation: "Repeated pattern" }],
      automation: {
        explanation: "Turns on the hall light.",
        yaml: "alias: Hall light\ntriggers: []\nactions: []\n",
        validation: { valid: true, errors: {} },
      },
    };
    const overview = {
      version: "1.0.2",
      provider: "deepseek",
      model: "deepseek-flash",
      base_url: "https://api.deepseek.com",
      provider_options: [{ id: "deepseek", label: "DeepSeek", default_model: "deepseek-flash", default_base_url: "https://api.deepseek.com" }],
      goal_presets: [],
      options: { schedule: "manual", history_days: 30 },
      suggestions: [suggestion],
      counts: { new: 1, saved: 0, dismissed: 0 },
      scan_runs: [],
      preferences: {
        goals: [], ignored_categories: [], ignored_entities: [], notes: [], quiet_hours: null,
        change_permissions: {
          create_automations: true,
          update_automations: false,
          remove_entities: false,
          remove_devices: false,
        },
      },
    };
    const sendMessagePromise = vi.fn().mockResolvedValue(overview);
    const callApi = vi.fn().mockResolvedValue({ result: "ok" });
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise }, callApi };
    await panel.updateComplete;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    panel.shadowRoot?.querySelector<HTMLButtonElement>(".suggestion-row")?.click();
    await panel.updateComplete;
    const review = [...(panel.shadowRoot?.querySelectorAll("ha-button") ?? [])]
      .find((button) => button.textContent?.includes("Review & create")) as HTMLElement;
    review.click();
    await panel.updateComplete;
    const applyCalls = () =>
      sendMessagePromise.mock.calls.filter(
        ([message]) => message.type === "haos_ai/change/apply",
      );
    expect(applyCalls()).toHaveLength(0);

    const approve = [...(panel.shadowRoot?.querySelectorAll("ha-adaptive-dialog ha-button") ?? [])]
      .find((button) => button.textContent?.includes("Approve & create")) as HTMLElement;
    approve.click();
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    // The write must go through the backend gate, never straight to the core
    // automation config API from the browser.
    expect(callApi).not.toHaveBeenCalled();
    expect(applyCalls()).toHaveLength(1);
    expect(applyCalls()[0][0]).toEqual({
      type: "haos_ai/change/apply",
      suggestion_id: "suggestion-approval",
      expected_revision: "revision-create",
      confirm: true,
      operation: "create_automation",
      config: expect.objectContaining({ alias: "Hall light" }),
    });
  });

  it("diffs the stored automation before approving an update", async () => {
    const suggestion = {
      id: "suggestion-update",
      approval_revision: "revision-update",
      title: "Tighten hall light",
      summary: "Update the hall light routine.",
      rationale: "The trigger is too broad.",
      kind: "automation",
      status: "new",
      confidence: 0.9,
      impact: "medium",
      created_at: new Date().toISOString(),
      evidence: [{ source_type: "automation", source_id: "automation.hall", observation: "Broad trigger" }],
      automation: {
        explanation: "Narrows the trigger.",
        yaml: "alias: Hall light\nmode: single\n",
        validation: { valid: true, errors: {} },
        target_id: "hall-light-id",
      },
    };
    const overview = {
      version: "1.0.4",
      provider: "openai",
      model: "gpt-6.1-sol",
      base_url: "https://api.openai.com/v1",
      provider_options: [{ id: "openai", label: "OpenAI", default_model: "gpt-6.1-sol", default_base_url: "https://api.openai.com/v1" }],
      goal_presets: [],
      options: { schedule: "manual", history_days: 30 },
      suggestions: [suggestion],
      counts: { new: 1, saved: 0, dismissed: 0 },
      scan_runs: [],
      preferences: {
        goals: [], ignored_categories: [], ignored_entities: [], notes: [], quiet_hours: null,
        change_permissions: {
          create_automations: false,
          update_automations: true,
          remove_entities: false,
          remove_devices: false,
        },
      },
    };
    const sendMessagePromise = vi.fn(
      async (message: Record<string, unknown>): Promise<any> =>
        message.type === "haos_ai/automation/current"
          ? { found: true, config_hash: "hash-current", yaml: "alias: Hall light\nmode: restart\n" }
          : overview,
    );
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise } };
    await panel.updateComplete;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    panel.shadowRoot?.querySelector<HTMLButtonElement>(".suggestion-row")?.click();
    await panel.updateComplete;
    const review = [...(panel.shadowRoot?.querySelectorAll("ha-button") ?? [])]
      .find((button) => button.textContent?.includes("Review & update")) as HTMLElement;
    review.click();
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    expect(sendMessagePromise).toHaveBeenCalledWith({
      type: "haos_ai/automation/current",
      automation_id: "hall-light-id",
    });
    const removed = panel.shadowRoot?.querySelector(".diff-line.removed");
    const added = panel.shadowRoot?.querySelector(".diff-line.added");
    expect(removed?.textContent).toContain("mode: restart");
    expect(added?.textContent).toContain("mode: single");
  });

  it("clears only the currently selected inbox view after confirmation", async () => {
    const overview = {
      version: "1.0.2",
      provider: "openai",
      model: "gpt-6.1-sol",
      base_url: "https://api.openai.com/v1",
      provider_options: [{ id: "openai", label: "OpenAI", default_model: "gpt-6.1-sol", default_base_url: "https://api.openai.com/v1" }],
      goal_presets: [], options: { schedule: "manual" }, scan_runs: [],
      suggestions: [{
        id: "clear-me", title: "Clear me", summary: "Summary", rationale: "Reason",
        kind: "hygiene", status: "new", confidence: 0.8, impact: "low",
        created_at: new Date().toISOString(), evidence: [],
      }],
      counts: { new: 1, saved: 0, dismissed: 0 },
      preferences: { goals: [], ignored_categories: [], ignored_entities: [], notes: [], quiet_hours: null },
    };
    const sendMessagePromise = vi.fn().mockResolvedValue(overview);
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise } };
    await panel.updateComplete;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    panel.shadowRoot?.querySelector<HTMLElement>('.inbox-heading-actions ha-icon-button')?.click();
    await panel.updateComplete;
    const clear = [...(panel.shadowRoot?.querySelectorAll("ha-adaptive-dialog ha-button") ?? [])]
      .find((button) => button.textContent?.includes("Clear 1")) as HTMLElement;
    clear.click();
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    expect(sendMessagePromise).toHaveBeenCalledWith({
      type: "haos_ai/suggestions/clear",
      status: "new",
    });
  });

  it("renders the new-conversation control with a slotted icon", async () => {
    // `ha-icon-button` has no `icon` property, so the glyph has to be
    // slotted. Passing icon="mdi:plus" left the control blank, which is why
    // the new-conversation button could not be found in the panel.
    const overview = {
      version: "1.0.4",
      provider: "openai",
      model: "gpt-6.1-sol",
      base_url: "https://api.openai.com/v1",
      provider_options: [{ id: "openai", label: "OpenAI", default_model: "gpt-6.1-sol", default_base_url: "https://api.openai.com/v1" }],
      goal_presets: [],
      options: { schedule: "manual" },
      scan_runs: [],
      threads: [],
      suggestions: [],
      counts: { new: 0, saved: 0, dismissed: 0 },
      preferences: { goals: [], ignored_categories: [], ignored_entities: [], notes: [], quiet_hours: null },
    };
    const sendMessagePromise = vi.fn().mockImplementation(({ type }) => {
      if (type === "haos_ai/chat/threads") return Promise.resolve([]);
      if (type === "haos_ai/chat/thread") return Promise.resolve([]);
      return Promise.resolve(overview);
    });
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise } };
    await panel.updateComplete;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    const chatTab = [
      ...(panel.shadowRoot?.querySelectorAll(".tabs button") ?? []),
    ].find((button) => button.textContent?.includes("Chat")) as HTMLElement;
    chatTab.click();
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;

    const button = panel.shadowRoot?.querySelector(
      '.thread-heading ha-icon-button[label="New conversation"]',
    );
    expect(button).not.toBeNull();
    expect(button?.hasAttribute("icon")).toBe(false);
    expect(button?.querySelector('ha-icon[icon="mdi:plus"]')).not.toBeNull();
  });

  const makeOverview = (suggestions: Record<string, unknown>[] = []) => ({
    version: "1.0.2",
    provider: "deepseek",
    model: "deepseek-flash",
    base_url: "https://api.deepseek.com",
    provider_options: [{ id: "deepseek", label: "DeepSeek", default_model: "deepseek-flash", default_base_url: "https://api.deepseek.com" }],
    goal_presets: [],
    options: { schedule: "manual", history_days: 30 },
    suggestions,
    counts: { new: suggestions.length, saved: 0, dismissed: 0 },
    scan_runs: [],
    preferences: {
      goals: [], ignored_categories: [], ignored_entities: [], notes: [], quiet_hours: null,
      change_permissions: {
        create_automations: true,
        update_automations: false,
        remove_entities: false,
        remove_devices: false,
      },
    },
  });
  const makeSuggestion = (extra: Record<string, unknown> = {}) => ({
    id: "suggestion-x",
    approval_revision: "revision-x",
    title: "Hall light",
    summary: "Create a hall light routine.",
    rationale: "The pattern is repeated.",
    kind: "automation",
    status: "new",
    confidence: 0.9,
    impact: "medium",
    created_at: new Date().toISOString(),
    evidence: [],
    automation: {
      explanation: "Turns on the hall light.",
      yaml: "alias: Hall light\ntriggers: []\nactions: []\n",
      validation: { valid: true, errors: {} },
    },
    ...extra,
  });
  const settle = async (panel: HTMLElement & { updateComplete: Promise<unknown> }) => {
    await panel.updateComplete;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    await panel.updateComplete;
  };
  const buttonByText = (panel: HTMLElement, text: string) =>
    [...(panel.shadowRoot?.querySelectorAll("ha-button") ?? [])].find((b) =>
      b.textContent?.includes(text),
    ) as HTMLElement | undefined;

  it("hides the approve button and shows Applied for applied suggestions", async () => {
    const sendMessagePromise = vi.fn().mockResolvedValue(
      makeOverview([makeSuggestion({ applied_at: "2026-05-01T10:00:00Z", applied_change_id: "chg-1" })]),
    );
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise } };
    await settle(panel);
    panel.shadowRoot?.querySelector<HTMLButtonElement>(".suggestion-row")?.click();
    await panel.updateComplete;

    expect(buttonByText(panel, "Review & create")).toBeUndefined();
    const label = panel.shadowRoot?.querySelector(".saved-label");
    expect(label?.textContent).toContain("Applied");
    expect(label?.getAttribute("title")).toContain("Applied");
    expect(buttonByText(panel, "Save")).toBeDefined();
  });

  it("falls back to execCommand when the clipboard API is unavailable", async () => {
    const sendMessagePromise = vi.fn().mockResolvedValue(makeOverview([makeSuggestion()]));
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", { value: execCommand, configurable: true });
    vi.stubGlobal("navigator", { clipboard: undefined });
    try {
      const panel = document.createElement("haos-ai-panel");
      document.body.append(panel);
      panel.hass = { connection: { sendMessagePromise } };
      await settle(panel);
      panel.shadowRoot?.querySelector<HTMLButtonElement>(".suggestion-row")?.click();
      await panel.updateComplete;
      buttonByText(panel, "Copy")?.click();
      await settle(panel);

      expect(execCommand).toHaveBeenCalledWith("copy");
      expect(panel.shadowRoot?.querySelector(".alert")).toBeNull();
      expect(document.querySelector("textarea")).toBeNull();

      execCommand.mockReturnValue(false);
      buttonByText(panel, "Copy")?.click();
      await settle(panel);
      expect(panel.shadowRoot?.querySelector(".alert")?.textContent).toContain(
        "Could not copy",
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("defers revoking the download object URL", async () => {
    vi.useFakeTimers();
    const createObjectURL = vi.fn().mockReturnValue("blob:x");
    const revokeObjectURL = vi.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    try {
      const sendMessagePromise = vi.fn().mockResolvedValue(makeOverview([makeSuggestion()]));
      const panel = document.createElement("haos-ai-panel");
      document.body.append(panel);
      panel.hass = { connection: { sendMessagePromise } };
      await vi.advanceTimersByTimeAsync(0);
      await panel.updateComplete;
      panel.shadowRoot?.querySelector<HTMLButtonElement>(".suggestion-row")?.click();
      await panel.updateComplete;
      buttonByText(panel, "Download")?.click();

      expect(click).toHaveBeenCalled();
      expect(revokeObjectURL).not.toHaveBeenCalled();
      expect(document.querySelector("a[download]")).toBeNull();
      await vi.advanceTimersByTimeAsync(1000);
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:x");
    } finally {
      click.mockRestore();
      vi.useRealTimers();
    }
  });

  it("clears the busy state on a failed progress event", async () => {
    let handler: ((event: { data: Record<string, unknown> }) => void) | undefined;
    const subscribeEvents = vi.fn(async (cb) => {
      handler = cb;
      return vi.fn();
    });
    const sendMessagePromise = vi.fn().mockResolvedValue(makeOverview());
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise, subscribeEvents } };
    await settle(panel);

    handler?.({ data: { stage: "provider" } });
    await panel.updateComplete;
    expect(panel.shadowRoot?.querySelector("[role=progressbar]")).not.toBeNull();
    handler?.({ data: { stage: "failed" } });
    await panel.updateComplete;
    expect(panel.shadowRoot?.querySelector("[role=progressbar]")).toBeNull();
  });

  it("reloads the overview when a foreign scan completes", async () => {
    let handler: ((event: { data: Record<string, unknown> }) => void) | undefined;
    const subscribeEvents = vi.fn(async (cb) => {
      handler = cb;
      return vi.fn();
    });
    const sendMessagePromise = vi.fn().mockResolvedValue(makeOverview());
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise, subscribeEvents } };
    await settle(panel);
    const overviewCalls = () =>
      sendMessagePromise.mock.calls.filter(([m]) => m.type === "haos_ai/overview").length;
    const before = overviewCalls();
    handler?.({ data: { stage: "complete" } });
    await settle(panel);
    expect(overviewCalls()).toBe(before + 1);
  });

  it("resubscribes after being detached and re-attached", async () => {
    const unsubscribe = vi.fn();
    const subscribeEvents = vi.fn(async () => unsubscribe);
    const sendMessagePromise = vi.fn().mockResolvedValue(makeOverview());
    const panel = document.createElement("haos-ai-panel");
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise, subscribeEvents } };
    await settle(panel);
    expect(subscribeEvents).toHaveBeenCalledTimes(1);

    panel.remove();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    document.body.append(panel);
    await settle(panel);
    expect(subscribeEvents).toHaveBeenCalledTimes(2);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
  const deferred = <T,>() => {
    let resolve!: (value: T) => void;
    let reject!: (reason: unknown) => void;
    const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
  };
  const setupRacePanel = async (handler: (message: Record<string, any>) => unknown, suggestions = [makeSuggestion()]) => {
    const overview = makeOverview(suggestions);
    const send = vi.fn((message: Record<string, any>) => message.type === "haos_ai/overview" ? Promise.resolve(overview) : handler(message));
    const panel = document.createElement("haos-ai-panel") as any;
    document.body.append(panel);
    panel.hass = { connection: { sendMessagePromise: send } };
    await settle(panel);
    panel.selectedId = suggestions[0]?.id;
    await settle(panel);
    return { panel, send, overview };
  };
  const editYaml = async (panel: any, yaml: string) => {
    const editor = panel.shadowRoot.querySelector(".yaml-editor") as HTMLTextAreaElement;
    editor.value = yaml;
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    await panel.updateComplete;
  };

  it("discards validation after newer YAML edits, including edits restored to the original text", async () => {
    const result = deferred<any>();
    const { panel } = await setupRacePanel(() => result.promise);
    const original = panel.draftYaml;
    const pending = panel.validateDraft();
    await editYaml(panel, "alias: unsaved edits\n");
    await editYaml(panel, original);
    result.resolve({ yaml: "alias: stale normalized result\n", validation: { valid: true, errors: {} } });
    await pending;
    expect(panel.draftYaml).toBe(original);
    expect(panel.draftValidation).toBeUndefined();
    expect(panel.busy).toBe(false);
  });

  it("discards validation and validation errors after selecting a different suggestion", async () => {
    const result = deferred<any>();
    const other = makeSuggestion({ id: "other", approval_revision: "other-revision", automation: { yaml: "alias: Other\n", validation: { valid: false, errors: {} } } });
    const { panel } = await setupRacePanel(() => result.promise, [makeSuggestion(), other]);
    const pending = panel.validateDraft();
    panel.selectedId = "other";
    await panel.updateComplete;
    result.reject(new Error("stale failure"));
    await pending;
    expect(panel.draftYaml).toBe("alias: Other\n");
    expect(panel.draftValidation.valid).toBe(false);
    expect(panel.draftError).toBe("");
  });

  it("only accepts the newest overlapping validation result", async () => {
    const first = deferred<any>();
    const second = deferred<any>();
    let calls = 0;
    const { panel } = await setupRacePanel(() => ++calls === 1 ? first.promise : second.promise);
    const older = panel.validateDraft();
    const newer = panel.validateDraft();
    first.resolve({ yaml: "alias: Older\n", validation: { valid: true, errors: {} } });
    await older;
    expect(panel.busy).toBe(true);
    second.resolve({ yaml: "alias: Newer\n", validation: { valid: true, errors: {} } });
    await newer;
    expect(panel.draftYaml).toBe("alias: Newer\n");
    expect(panel.busy).toBe(false);
  });

  it("does not route an A chat reply into B or overwrite B's input", async () => {
    const response = deferred<any>();
    const bMessages = [{ id: "b", role: "user", content: "Question B" }];
    const { panel, send } = await setupRacePanel((message) => {
      if (message.type === "haos_ai/chat") return response.promise;
      if (message.type === "haos_ai/chat/thread") return Promise.resolve(bMessages);
      return Promise.resolve([]);
    });
    panel.threadId = "A";
    panel.chatText = "Question A";
    const pending = panel.sendChat();
    await panel.selectThread("B");
    panel.chatText = "new B draft";
    response.resolve({ message: { id: "reply-a", role: "assistant", content: "ANSWER A" } });
    await pending;
    expect(panel.chat).toEqual(bMessages);
    expect(panel.chatText).toBe("new B draft");
    expect(send).toHaveBeenCalledWith({ type: "haos_ai/chat", thread_id: "A", text: "Question A" });
  });

  it("keeps B's history when an earlier A history resolves last", async () => {
    const a = deferred<any>();
    const b = deferred<any>();
    const { panel } = await setupRacePanel((message) => message.thread_id === "A" ? a.promise : b.promise);
    const loadA = panel.selectThread("A");
    const loadB = panel.selectThread("B");
    b.resolve([{ id: "B" }]);
    await loadB;
    a.resolve([{ id: "A" }]);
    await loadA;
    expect(panel.threadId).toBe("B");
    expect(panel.chat).toEqual([{ id: "B" }]);
  });

  it("invalidates pending history and replies when starting or deleting a conversation", async () => {
    const history = deferred<any>();
    const response = deferred<any>();
    const deletion = deferred<any>();
    const { panel } = await setupRacePanel((message) => {
      if (message.type === "haos_ai/chat/thread") return history.promise;
      if (message.type === "haos_ai/chat") return response.promise;
      if (message.type === "haos_ai/chat/thread/delete") return deletion.promise;
      return Promise.resolve([]);
    });
    const oldHistory = panel.selectThread("A");
    panel.newThread();
    history.resolve([{ id: "stale" }]);
    await oldHistory;
    expect(panel.chat).toEqual([]);
    panel.threadId = "A";
    panel.chatText = "pending";
    const pending = panel.sendChat();
    const deleted = panel.deleteThread();
    response.resolve({ message: { id: "late-answer" } });
    await pending;
    deletion.resolve({ deleted: true });
    await deleted;
    expect(panel.threadId).not.toBe("A");
    expect(panel.chat).toEqual([]);
  });

  it("does not navigate away from B when deleting A finishes", async () => {
    const deletion = deferred<any>();
    const { panel } = await setupRacePanel((message) => message.type === "haos_ai/chat/thread/delete" ? deletion.promise : Promise.resolve([]));
    panel.threadId = "A";
    const pending = panel.deleteThread();
    await panel.selectThread("B");
    deletion.resolve({ deleted: true });
    await pending;
    expect(panel.threadId).toBe("B");
  });

  it("keeps receipt selection and payload coherent across out-of-order requests and back navigation", async () => {
    const a = deferred<any>();
    const b = deferred<any>();
    const { panel } = await setupRacePanel((message) => message.receipt_id === "A" ? a.promise : b.promise);
    panel.tab = "activity";
    const openA = panel.openReceipt("A");
    const openB = panel.openReceipt("B");
    b.resolve({ id: "B", payload_preview: {}, redactions: [], categories: [] });
    await openB;
    a.resolve({ id: "A", payload_preview: {}, redactions: [], categories: [] });
    await openA;
    expect(panel.selectedReceiptId).toBe("B");
    expect(panel.receipt.id).toBe("B");
    const late = deferred<any>();
    panel.hass = { connection: { sendMessagePromise: () => late.promise } };
    const reopen = panel.openReceipt("B");
    panel.changeTab("inbox");
    late.resolve({ id: "B" });
    await reopen;
    expect(panel.selectedReceiptId).toBeUndefined();
    expect(panel.receipt).toBeUndefined();
  });

  it("requires a loaded matching diff and sends the reviewed revision and content hash", async () => {
    const current = deferred<any>();
    const { panel, send } = await setupRacePanel((message) => message.type === "haos_ai/automation/current" ? current.promise : Promise.resolve({ reload_failed: false }), [makeSuggestion({ automation: { yaml: "alias: New\n", target_id: "hall", validation: { valid: true, errors: {} } } })]);
    panel.changePermissions.update_automations = true;
    panel.openChangeApproval(panel.selected);
    await panel.updateComplete;
    const approve = buttonByText(panel, "Approve & update");
    expect(approve?.hasAttribute("disabled")).toBe(true);
    await panel.approveChange();
    expect(send.mock.calls.some(([message]) => message.type === "haos_ai/change/apply")).toBe(false);
    current.resolve({ found: true, yaml: "alias: Old\n", config_hash: "reviewed-hash" });
    await settle(panel);
    expect(approve?.hasAttribute("disabled")).toBe(false);
    await panel.approveChange();
    expect(send).toHaveBeenCalledWith({ type: "haos_ai/change/apply", suggestion_id: "suggestion-x", expected_revision: "revision-x", expected_config_hash: "reviewed-hash", confirm: true, operation: "update_automation", config: { alias: "New" } });
  });

  it("does not accept a stale diff after another approval opens", async () => {
    const first = deferred<any>();
    const second = deferred<any>();
    let calls = 0;
    const suggestions = [makeSuggestion({ automation: { yaml: "alias: New A\n", target_id: "A", validation: { valid: true, errors: {} } } }), makeSuggestion({ id: "B", approval_revision: "rev-b", automation: { yaml: "alias: New B\n", target_id: "B", validation: { valid: true, errors: {} } } })];
    const { panel } = await setupRacePanel(() => ++calls === 1 ? first.promise : second.promise, suggestions);
    panel.changePermissions.update_automations = true;
    panel.openChangeApproval(panel.selected);
    panel.selectedId = "B";
    await panel.updateComplete;
    panel.openChangeApproval(panel.selected);
    second.resolve({ found: true, yaml: "alias: Old B\n", config_hash: "hash-b" });
    await settle(panel);
    first.resolve({ found: true, yaml: "alias: Old A\n", config_hash: "hash-a" });
    await settle(panel);
    expect(panel.pendingChange.configHash).toBe("hash-b");
    expect(panel.shadowRoot.querySelector(".diff").textContent).not.toContain("Old A");
    expect(panel.diffLoading).toBe(false);
  });

  it("rejects approval after newer edits or refreshed suggestion revisions", async () => {
    const { panel, send, overview } = await setupRacePanel(() => Promise.resolve({ reload_failed: false }));
    panel.openChangeApproval(panel.selected);
    await editYaml(panel, "alias: Newer edit\n");
    await panel.approveChange();
    expect(send.mock.calls.some(([message]) => message.type === "haos_ai/change/apply")).toBe(false);
    overview.suggestions[0].approval_revision = "new-backend-revision";
    await panel.loadOverview();
    expect(panel.draftApprovalRevision).toBe("revision-x");
    panel.draftValidation = { valid: true, errors: {} };
    panel.openChangeApproval(panel.selected);
    await panel.approveChange();
    expect(send.mock.calls.some(([message]) => message.type === "haos_ai/change/apply")).toBe(false);
  });

  it("warns that saved automation is not active when reload fails and preserves newer edits", async () => {
    const applied = deferred<any>();
    const { panel } = await setupRacePanel(() => applied.promise);
    panel.openChangeApproval(panel.selected);
    const pending = panel.approveChange();
    await editYaml(panel, "alias: Newer unsaved edit\n");
    applied.resolve({ reload_failed: true });
    await pending;
    await panel.updateComplete;
    expect(panel.draftYaml).toBe("alias: Newer unsaved edit\n");
    expect(panel.shadowRoot.querySelector(".alert").textContent).toContain("Automation saved");
    expect(panel.error).toContain("Reload automations manually");
    expect(panel.settingsNotice).toBe("");
  });

  it("discards pending receipt refresh when the Activity back button is used", async () => {
    const late = deferred<any>();
    let requests = 0;
    const receipt = { id: "A", categories: [], redactions: [], payload_preview: {} };
    const { panel } = await setupRacePanel(() => ++requests === 1 ? Promise.resolve(receipt) : late.promise);
    panel.tab = "activity";
    await panel.openReceipt("A");
    await panel.updateComplete;
    const back = panel.shadowRoot.querySelector(".receipt-content .mobile-back");
    expect(back).not.toBeNull();
    const pending = panel.openReceipt("A");
    back.click();
    late.resolve(receipt);
    await pending;
    expect(panel.selectedReceiptId).toBeUndefined();
    expect(panel.receipt).toBeUndefined();
  });

  it.each([
    { found: false, yaml: "", config_hash: "" },
    { found: true, yaml: "alias: old\n", config_hash: "" },
  ])("refuses update approval when the diff cannot be reviewed: %j", async (current) => {
    const { panel, send } = await setupRacePanel(() => Promise.resolve(current), [makeSuggestion({ automation: { yaml: "alias: New\n", target_id: "hall", validation: { valid: true, errors: {} } } })]);
    panel.changePermissions.update_automations = true;
    panel.openChangeApproval(panel.selected);
    await settle(panel);
    expect(buttonByText(panel, "Approve & update")?.hasAttribute("disabled")).toBe(true);
    await panel.approveChange();
    expect(send.mock.calls.some(([message]) => message.type === "haos_ai/change/apply")).toBe(false);
  });

  it("reloads the same chat from persisted history and discards its older history request", async () => {
    const oldHistory = deferred<any>();
    const reply = deferred<any>();
    const stored = [{ id: "user", role: "user", content: "A question" }, { id: "assistant", role: "assistant", content: "A answer" }];
    let historyRequests = 0;
    const { panel } = await setupRacePanel((message) => {
      if (message.type === "haos_ai/chat") return reply.promise;
      if (message.type === "haos_ai/chat/thread") return ++historyRequests === 1 ? oldHistory.promise : Promise.resolve(stored);
      return Promise.resolve([]);
    });
    const load = panel.selectThread("A");
    panel.chatText = "A question";
    const pending = panel.sendChat();
    reply.resolve({ message: stored[1] });
    await pending;
    oldHistory.resolve([{ id: "stale" }]);
    await load;
    expect(panel.chat).toEqual(stored);
  });

});
