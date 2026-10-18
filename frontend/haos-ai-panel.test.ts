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
      confirm: true,
      operation: "create_automation",
      config: expect.objectContaining({ alias: "Hall light" }),
    });
  });

  it("diffs the stored automation before approving an update", async () => {
    const suggestion = {
      id: "suggestion-update",
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
          ? { found: true, yaml: "alias: Hall light\nmode: restart\n" }
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
});
