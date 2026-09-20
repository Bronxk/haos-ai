import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { parse } from "yaml";

type Unsubscribe = () => void;

interface HassEvent<T = Record<string, unknown>> {
  data: T;
}

interface HomeAssistant {
  connection: {
    sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
    subscribeEvents?<T>(
      callback: (event: HassEvent<T>) => void,
      eventType: string,
    ): Promise<Unsubscribe>;
  };
  callApi?<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    parameters?: unknown,
  ): Promise<T>;
  themes?: { darkMode?: boolean };
  states?: Record<string, HassState>;
  areas?: Record<string, HassArea>;
  entities?: Record<string, HassRegistryEntry>;
  localize?(key: string, ...args: unknown[]): string;
}

interface HassArea {
  area_id: string;
  name: string;
}

interface HassRegistryEntry {
  entity_id: string;
  area_id?: string | null;
  labels?: string[];
}

interface HassState {
  entity_id: string;
  state: string;
  attributes: { friendly_name?: string; [key: string]: unknown };
}

interface PanelInfo {
  config?: Record<string, unknown>;
}

interface Evidence {
  source_type: string;
  source_id: string;
  observation: string;
  period?: string;
  /** False when the cited source could not be resolved in this installation. */
  verified?: boolean;
}

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

interface Suggestion {
  id: string;
  title: string;
  summary: string;
  rationale: string;
  kind: "automation" | "hygiene";
  status: "new" | "saved" | "dismissed";
  confidence: number;
  impact: "low" | "medium" | "high";
  created_at: string;
  last_seen_at?: string;
  occurrences?: number;
  dismissal_reason?: string | null;
  evidence: Evidence[];
  automation?: {
    explanation?: string;
    config?: { description?: string };
    yaml: string;
    validation: ValidationResult;
    target_id?: string | null;
  };
  operation?: {
    type: "remove_entity" | "remove_device";
    target_id: string;
    label: string;
    config_entry_id?: string | null;
  };
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface ThreadSummary {
  id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
  message_count: number;
}

interface ScanRun {
  id: string;
  created_at: string;
  completed_at?: string;
  recommendation_count: number;
  recurrence_count?: number;
  privacy_receipt_id: string;
  usage?: Record<string, number>;
}

interface ReceiptSummary {
  id: string;
  created_at: string;
  provider: string;
  model: string;
  purpose: "scan" | "chat";
  categories: string[];
  redaction_count: number;
  usage?: Record<string, number>;
}

interface PrivacyReceipt extends ReceiptSummary {
  redactions: string[];
  payload_preview: Record<string, unknown>;
}

interface BudgetStatus {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  requests: number;
  budget: number;
  remaining: number | null;
  ratio: number;
  exceeded: boolean;
  warning: boolean;
}

interface AppliedChange {
  id: string;
  kind:
    | "create_automation"
    | "update_automation"
    | "remove_entity"
    | "remove_device";
  target_id: string;
  label: string;
  suggestion_id?: string | null;
  suggestion_title?: string;
  applied_at: string;
  outcome: "pending" | "kept" | "disabled" | "reverted" | "unknown";
  outcome_detail?: string;
  checked_at?: string | null;
}

interface ScanProfile {
  enabled: boolean;
  provider?: string | null;
  model?: string | null;
  base_url?: string | null;
  active?: boolean;
}

interface Activity {
  scan_runs: ScanRun[];
  receipts: ReceiptSummary[];
  budget?: BudgetStatus;
  applied_changes?: AppliedChange[];
}

interface Overview {
  version: string;
  provider: string;
  model: string;
  base_url: string;
  scan_profile?: ScanProfile;
  budget?: BudgetStatus;
  applied_changes?: AppliedChange[];
  provider_options: ProviderOption[];
  goal_presets: GoalPreset[];
  options: {
    history_days?: number;
    include_exact_location?: boolean;
    schedule?: string;
    schedule_time?: string;
    schedule_weekday?: number;
    notify_new_suggestions?: boolean;
  };
  suggestions: Suggestion[];
  counts: { new: number; saved: number; dismissed: number };
  scan_runs: ScanRun[];
  threads?: ThreadSummary[];
  preferences: {
    goals: string[];
    ignored_categories: string[];
    ignored_entities: string[];
    ignored_domains?: string[];
    ignored_areas?: string[];
    ignored_labels?: string[];
    monthly_token_budget?: number;
    notes: string[];
    quiet_hours: { start: string; end: string } | null;
    advisor_mode?: "conservative" | "balanced" | "ambitious";
    scan_depth?: "focused" | "standard" | "thorough";
    automation_complexity?: "simple" | "normal" | "advanced";
    change_permissions?: ChangePermissions;
    fix_existing_first?: boolean;
    avoid_new_hardware?: boolean;
    dismissal_feedback?: Array<Record<string, unknown>>;
  };
}

interface ProviderOption {
  id: string;
  label: string;
  default_model: string;
  default_base_url: string;
}

interface GoalPreset {
  id: string;
  label: string;
}

interface ContextPreview {
  provider: string;
  model: string;
  purpose: string;
  payload: Record<string, unknown>;
  redactions: string[];
}

interface ProgressEvent {
  stage: "context" | "provider" | "tool" | "validate" | "complete";
  progress?: number;
  tool?: string;
  scan_id?: string;
  thread_id?: string;
}

interface ChangePermissions {
  create_automations: boolean;
  update_automations: boolean;
  remove_entities: boolean;
  remove_devices: boolean;
}

interface PendingChange {
  kind:
    | "create_automation"
    | "update_automation"
    | "remove_entity"
    | "remove_device";
  suggestionId: string;
  targetId: string;
  label: string;
  configEntryId?: string;
}

type Tab = "inbox" | "chat" | "activity" | "settings";
type Filter = "new" | "saved" | "dismissed" | "all";
type Dialog =
  | "feedback"
  | "rename"
  | "delete-thread"
  | "clear-inbox"
  | "approve-change"
  | null;

const FEEDBACK_REASONS = [
  "Already handled",
  "Wrong entity or evidence",
  "Not useful for this home",
  "Too intrusive",
  "Maybe later",
] as const;

const WEEKDAY_KEYS = [
  "weekday.monday",
  "weekday.tuesday",
  "weekday.wednesday",
  "weekday.thursday",
  "weekday.friday",
  "weekday.saturday",
  "weekday.sunday",
] as const;

/**
 * English source strings for the panel.
 *
 * `t()` prefers Home Assistant's own translation for the same key, so a
 * translated Home Assistant instance localizes the panel without a rebuild,
 * and this table stays the guaranteed fallback.
 */
const PANEL_STRINGS: Record<string, string> = {
  "weekday.monday": "Monday",
  "weekday.tuesday": "Tuesday",
  "weekday.wednesday": "Wednesday",
  "weekday.thursday": "Thursday",
  "weekday.friday": "Friday",
  "weekday.saturday": "Saturday",
  "weekday.sunday": "Sunday",

  "budget.title": "Monthly token budget",
  "budget.description":
    "Cap what HAOS AI may spend with your provider each calendar month.",
  "budget.field": "Token budget per month",
  "budget.unlimited": "0 means no cap",
  "budget.used": "Used this month",
  "budget.remaining": "Remaining",
  "budget.requests": "Provider requests",
  "budget.no_cap": "No cap set",
  "budget.warning":
    "This month's token budget is nearly spent. Scans and chat stop when it runs out.",
  "budget.exceeded":
    "This month's token budget is spent. Scans and chat are paused until you raise it.",
  "evidence.unverified": "Not found in this installation",

  "scan_profile.title": "Separate model for scans",
  "scan_profile.description":
    "Scans are long and tool-heavy. Run them on a cheaper model and keep chat on a strong one.",
  "scan_profile.enable": "Use a separate provider for scans",
  "scan_profile.enable_help":
    "When off, scans and chat both use the connection above.",
  "scan_profile.provider": "Scan provider",
  "scan_profile.model": "Scan model",
  "scan_profile.api_key": "Scan API key",
  "scan_profile.base_url": "Scan API base URL",
  "scan_profile.active": "Scans run on this profile",
  "scan_profile.inactive": "Scans use the main connection",

  "ignore.entities": "Ignored entities",
  "ignore.entities_help":
    "Search by name or entity ID. You can also paste comma-, space-, or line-separated IDs.",
  "ignore.domains": "Ignored domains",
  "ignore.domains_help":
    "Every entity in these domains is withheld before the request is built.",
  "ignore.areas": "Ignored areas",
  "ignore.areas_help":
    "Entities and devices in these areas are never sent, including their history.",
  "ignore.labels": "Ignored labels",
  "ignore.labels_help":
    "Anything carrying one of these labels is withheld from every request.",
  "ignore.enforced":
    "These exclusions are applied locally before anything is sent. They are not requests to the model.",
  "ignore.not_found": "Not currently found",
  "ignore.stop": "Stop ignoring",

  "applied.title": "Applied changes",
  "applied.description":
    "What happened to the changes you approved, checked automatically after a few days.",
  "applied.empty": "No approved changes yet.",
  "applied.outcome.pending": "Checking soon",
  "applied.outcome.kept": "Kept",
  "applied.outcome.disabled": "Turned off",
  "applied.outcome.reverted": "Reverted",
  "applied.outcome.unknown": "Unknown",

  "diff.title": "Changes to this automation",
  "diff.current": "Currently in Home Assistant",
  "diff.proposed": "Proposed",
  "diff.identical": "The draft matches the stored automation exactly.",
  "diff.unavailable": "The stored automation could not be read for comparison.",
  "diff.loading": "Loading the stored automation…",

  "action.cancel": "Cancel",
};

/** Read a panel string, preferring Home Assistant's translation catalog. */
function panelString(hass: HomeAssistant | undefined, key: string): string {
  // The catalog only accepts slug keys, so a dotted panel key is flattened for
  // the lookup while the compiled table keeps the readable dotted form. The
  // section has to be a documented one: hassfest rejects unknown top-level
  // sections such as a bespoke "panel".
  const lookup = `component.haos_ai.common.${key.replaceAll(".", "_")}`;
  const translated = hass?.localize?.(lookup);
  if (translated && translated !== lookup) {
    return translated;
  }
  return PANEL_STRINGS[key] ?? key;
}

interface DiffLine {
  type: "same" | "added" | "removed";
  text: string;
}

/**
 * Line diff over two YAML documents.
 *
 * Replacing an automation is destructive, so the approval dialog has to show
 * exactly which lines change rather than two blobs to eyeball.
 */
function diffLines(before: string, after: string): DiffLine[] {
  const left = before.replace(/\s+$/, "").split("\n");
  const right = after.replace(/\s+$/, "").split("\n");
  // Longest common subsequence table; automation YAML is small enough that
  // the quadratic table is cheaper than a smarter algorithm.
  const lengths: number[][] = Array.from({ length: left.length + 1 }, () =>
    new Array<number>(right.length + 1).fill(0),
  );
  for (let i = left.length - 1; i >= 0; i--) {
    for (let j = right.length - 1; j >= 0; j--) {
      lengths[i][j] =
        left[i] === right[j]
          ? lengths[i + 1][j + 1] + 1
          : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
    }
  }
  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      result.push({ type: "same", text: left[i] });
      i++;
      j++;
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      result.push({ type: "removed", text: left[i] });
      i++;
    } else {
      result.push({ type: "added", text: right[j] });
      j++;
    }
  }
  for (; i < left.length; i++) result.push({ type: "removed", text: left[i] });
  for (; j < right.length; j++) result.push({ type: "added", text: right[j] });
  return result;
}

@customElement("haos-ai-panel")
export class HaosAiPanel extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public panel?: PanelInfo;

  @state() private overview?: Overview;
  @state() private tab: Tab = "inbox";
  @state() private filter: Filter = "new";
  @state() private selectedId?: string;
  @state() private loading = true;
  @state() private busy = false;

  /** True while an action dialog is waiting for its backend call to settle. */
  @state() private dialogPending = false;

  /** Keyboard cursor for the ignored-entity picker, -1 when none is active. */
  @state() private entityHighlight = -1;
  @state() private error = "";
  @state() private preview?: ContextPreview;
  @state() private progress?: ProgressEvent;
  @state() private chat: ChatMessage[] = [];
  @state() private chatText = "";
  @state() private threadId = "main";
  @state() private threads: ThreadSummary[] = [];
  @state() private activity?: Activity;
  @state() private receipt?: PrivacyReceipt;
  @state() private selectedReceiptId?: string;
  @state() private selectedGoals: string[] = [];
  @state() private ignoredEntities: string[] = [];
  @state() private ignoredEntityQuery = "";
  @state() private ignoredEntityError = "";
  @state() private ignoredDomains: string[] = [];
  @state() private ignoredAreas: string[] = [];
  @state() private ignoredLabels: string[] = [];
  @state() private ignoredDomainQuery = "";
  @state() private ignoredAreaQuery = "";
  @state() private ignoredLabelQuery = "";
  @state() private monthlyTokenBudget = 0;
  @state() private advisorMode = "balanced";
  @state() private scanDepth = "standard";
  @state() private automationComplexity = "normal";
  @state() private fixExistingFirst = true;
  @state() private avoidNewHardware = true;
  @state() private changePermissions: ChangePermissions = {
    create_automations: false,
    update_automations: false,
    remove_entities: false,
    remove_devices: false,
  };
  @state() private quietStart = "22:00";
  @state() private quietEnd = "07:00";
  @state() private providerDraft = "";
  @state() private modelDraft = "";
  @state() private baseUrlDraft = "";
  @state() private apiKeyDraft = "";
  @state() private showConnectionAdvanced = false;
  @state() private historyDays = 30;
  @state() private includeExactLocation = false;
  @state() private schedule = "manual";
  @state() private scheduleTime = "03:00";
  @state() private scheduleWeekday = 0;
  @state() private notifyNewSuggestions = true;
  @state() private settingsNotice = "";
  @state() private copied = false;
  @state() private draftYaml = "";
  @state() private draftValidation?: ValidationResult;
  @state() private draftError = "";
  @state() private dialog: Dialog = null;
  @state() private feedbackReason = "";
  @state() private feedbackNote = "";
  @state() private renameText = "";
  @state() private pendingChange?: PendingChange;
  @state() private scanProfileEnabled = false;
  @state() private scanProviderDraft = "";
  @state() private scanModelDraft = "";
  @state() private scanBaseUrlDraft = "";
  @state() private scanApiKeyDraft = "";
  @state() private diffLines?: DiffLine[];
  @state() private diffError = "";
  @state() private diffLoading = false;

  private started = false;
  private unsubscribeProgress?: Unsubscribe;
  private progressTimer?: number;

  public connectedCallback(): void {
    super.connectedCallback();
    this.start();
  }

  public disconnectedCallback(): void {
    this.unsubscribeProgress?.();
    if (this.progressTimer) window.clearTimeout(this.progressTimer);
    super.disconnectedCallback();
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("hass")) this.start();
    if (changed.has("selectedId")) {
      const yaml = this.selected?.automation?.yaml ?? "";
      this.draftYaml = yaml;
      this.draftValidation = this.selected?.automation?.validation;
      this.draftError = "";
      this.draftDirty = false;
    }
  }

  private start(): void {
    if (!this.hass || this.started) return;
    this.started = true;
    void this.subscribeToProgress();
    void this.loadOverview();
  }

  private async subscribeToProgress(): Promise<void> {
    if (!this.hass?.connection.subscribeEvents) return;
    this.unsubscribeProgress = await this.hass.connection.subscribeEvents<ProgressEvent>(
      (event) => {
        this.progress = event.data;
        this.busy = event.data.stage !== "complete";
        if (event.data.stage === "complete") {
          if (this.progressTimer) window.clearTimeout(this.progressTimer);
          this.progressTimer = window.setTimeout(() => {
            this.progress = undefined;
            this.busy = false;
          }, 1400);
        }
      },
      "haos_ai_progress",
    );
  }

  private async call<T>(type: string, extra = {}): Promise<T> {
    if (!this.hass) throw new Error("Home Assistant is not ready");
    return this.hass.connection.sendMessagePromise<T>({ type, ...extra });
  }

  /** Resolve one panel string for the active Home Assistant language. */
  private t(key: string): string {
    return panelString(this.hass, key);
  }

  private describeError(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error && "message" in error) {
      return String((error as { message: unknown }).message);
    }
    return "Something went wrong. Check Home Assistant logs for details.";
  }

  private overviewRequest = 0;

  private draftDirty = false;

  private async loadOverview(): Promise<void> {
    if (!this.hass) return;
    // Only the very first load owns the full-screen loader; a refresh after a
    // save must not blank out a panel the user is working in.
    const isRefresh = this.overview !== undefined;
    const request = ++this.overviewRequest;
    if (!isRefresh) this.loading = true;
    try {
      const overview = await this.call<Overview>("haos_ai/overview");
      if (request !== this.overviewRequest) return;
      this.overview = overview;
      if (!isRefresh) this.hydrateSettings(overview);
      this.syncDraft(overview);
      this.threads = Array.isArray(overview.threads)
        ? overview.threads
        : [];
      const prunedSelection =
        !!this.selectedId &&
        !overview.suggestions.some((item) => item.id === this.selectedId);
      if (prunedSelection) {
        this.selectedId = undefined;
        // The detail pane just disappeared, and on mobile that leaves an empty
        // view when the active filter no longer matches anything, so fall back
        // to the full list rather than stranding the user.
        if (
          this.filter !== "all" &&
          !overview.suggestions.some((item) => item.status === this.filter)
        ) {
          this.filter = "all";
        }
      }
      this.error = "";
    } catch (error) {
      this.error = this.describeError(error);
    } finally {
      if (!isRefresh) this.loading = false;
    }
  }

  /** Resync the selected draft unless the user has edited it locally. */
  private syncDraft(overview: Overview): void {
    if (!this.selectedId || this.draftDirty) return;
    const item = overview.suggestions.find(
      (entry) => entry.id === this.selectedId,
    );
    if (!item?.automation) return;
    this.draftYaml = item.automation.yaml ?? "";
    this.draftValidation = item.automation.validation;
    this.draftError = "";
  }

  private hydrateSettings(overview: Overview): void {
    const preferences = overview.preferences;
    this.selectedGoals = [...(preferences.goals ?? [])];
    this.ignoredEntities = [...(preferences.ignored_entities ?? [])];
    this.ignoredDomains = [...(preferences.ignored_domains ?? [])];
    this.ignoredAreas = [...(preferences.ignored_areas ?? [])];
    this.ignoredLabels = [...(preferences.ignored_labels ?? [])];
    this.monthlyTokenBudget = preferences.monthly_token_budget ?? 0;
    this.advisorMode = preferences.advisor_mode ?? "balanced";
    this.scanDepth = preferences.scan_depth ?? "standard";
    this.automationComplexity =
      preferences.automation_complexity ?? "normal";
    this.fixExistingFirst = preferences.fix_existing_first !== false;
    this.avoidNewHardware = preferences.avoid_new_hardware !== false;
    this.changePermissions = {
      create_automations:
        preferences.change_permissions?.create_automations === true,
      update_automations:
        preferences.change_permissions?.update_automations === true,
      remove_entities: preferences.change_permissions?.remove_entities === true,
      remove_devices: preferences.change_permissions?.remove_devices === true,
    };
    this.quietStart = preferences.quiet_hours?.start ?? "22:00";
    this.quietEnd = preferences.quiet_hours?.end ?? "07:00";
    this.providerDraft = this.resolveProvider(overview);
    this.modelDraft = overview.model;
    this.baseUrlDraft = overview.base_url;
    this.apiKeyDraft = "";
    const scanProfile = overview.scan_profile;
    this.scanProfileEnabled = scanProfile?.enabled === true;
    const fallbackProvider =
      overview.provider_options[0]?.id ?? this.providerDraft;
    this.scanProviderDraft = scanProfile?.provider ?? fallbackProvider;
    this.scanModelDraft = scanProfile?.model ?? "";
    this.scanBaseUrlDraft = scanProfile?.base_url ?? "";
    this.scanApiKeyDraft = "";
    this.historyDays = overview.options.history_days ?? 30;
    this.includeExactLocation =
      overview.options.include_exact_location === true;
    this.schedule = overview.options.schedule ?? "manual";
    this.scheduleTime = (overview.options.schedule_time ?? "03:00:00").slice(
      0,
      5,
    );
    this.scheduleWeekday = overview.options.schedule_weekday ?? 0;
    this.notifyNewSuggestions =
      overview.options.notify_new_suggestions !== false;
  }

  private resolveProvider(overview: Overview): string {
    const endpoint = overview.base_url.toLocaleLowerCase();
    const model = overview.model.toLocaleLowerCase();
    const inferred = overview.provider_options.find((option) => {
      if (
        option.id !== "openai_compatible" &&
        option.default_base_url &&
        endpoint.startsWith(option.default_base_url.toLocaleLowerCase())
      ) {
        return true;
      }
      return option.id === "deepseek" && model.startsWith("deepseek");
    });
    if (inferred) return inferred.id;
    const exact = overview.provider_options.find(
      (option) => option.id === overview.provider,
    );
    return exact?.id ?? overview.provider_options[0]?.id ?? "openai";
  }

  private get filteredSuggestions(): Suggestion[] {
    const items = this.overview?.suggestions ?? [];
    return this.filter === "all"
      ? items
      : items.filter((item) => item.status === this.filter);
  }

  private get selected(): Suggestion | undefined {
    return this.overview?.suggestions.find(
      (item) => item.id === this.selectedId,
    );
  }

  private async openPreview(): Promise<void> {
    this.busy = true;
    this.error = "";
    try {
      this.preview = await this.call<ContextPreview>("haos_ai/context_preview");
    } catch (error) {
      this.error = this.describeError(error);
    } finally {
      this.busy = false;
    }
  }

  private async runScan(): Promise<void> {
    this.preview = undefined;
    this.busy = true;
    this.progress = { stage: "context", progress: 0.05 };
    this.error = "";
    try {
      await this.call("haos_ai/scan", { confirm_context: true });
      await this.loadOverview();
      this.filter = "new";
      if (this.tab === "activity") await this.loadActivity();
    } catch (error) {
      this.error = this.describeError(error);
      this.progress = undefined;
    } finally {
      this.busy = false;
    }
  }

  private async updateSuggestion(
    suggestionId: string,
    status: Suggestion["status"],
    reason?: string,
  ): Promise<void> {
    this.busy = true;
    try {
      await this.call("haos_ai/suggestion/update", {
        suggestion_id: suggestionId,
        status,
        ...(reason ? { reason } : {}),
      });
      await this.loadOverview();
      if (status === "dismissed") this.selectedId = undefined;
    } catch (error) {
      this.error = this.describeError(error);
    } finally {
      this.busy = false;
    }
  }

  private openFeedback(item: Suggestion): void {
    this.selectedId = item.id;
    this.feedbackReason = "";
    this.feedbackNote = "";
    this.dialog = "feedback";
  }

  private async submitFeedback(): Promise<void> {
    const item = this.selected;
    if (!item || !this.feedbackReason) return;
    const reason = [this.feedbackReason, this.feedbackNote.trim()]
      .filter(Boolean)
      .join(": ");
    this.dialog = null;
    await this.updateSuggestion(item.id, "dismissed", reason);
  }

  private async loadThreads(): Promise<void> {
    try {
      const threads = await this.call<ThreadSummary[]>("haos_ai/chat/threads");
      this.threads = Array.isArray(threads) ? threads : [];
    } catch (error) {
      this.error = this.describeError(error);
    }
  }

  private async loadThread(): Promise<void> {
    try {
      const messages = await this.call<ChatMessage[]>("haos_ai/chat/thread", {
        thread_id: this.threadId,
      });
      this.chat = Array.isArray(messages) ? messages : [];
    } catch (error) {
      this.error = this.describeError(error);
    }
  }

  private async selectThread(threadId: string): Promise<void> {
    this.threadId = threadId;
    this.chat = [];
    await this.loadThread();
  }

  private newThread(): void {
    this.threadId = crypto.randomUUID().replaceAll("-", "").slice(0, 40);
    this.chat = [];
    this.chatText = "";
  }

  private openRenameThread(): void {
    const current = this.threads.find((item) => item.id === this.threadId);
    this.renameText = current?.title ?? "Conversation";
    this.dialog = "rename";
  }

  private async renameThread(): Promise<void> {
    const title = this.renameText.trim();
    if (!title) return;
    this.dialog = null;
    try {
      await this.call("haos_ai/chat/thread/rename", {
        thread_id: this.threadId,
        title,
      });
      await this.loadThreads();
    } catch (error) {
      this.error = this.describeError(error);
    }
  }

  private async deleteThread(): Promise<void> {
    // Keep the dialog open, with its buttons disabled, until the call settles:
    // closing first left the user staring at an unchanged panel.
    this.dialogPending = true;
    try {
      await this.call("haos_ai/chat/thread/delete", {
        thread_id: this.threadId,
      });
      this.newThread();
      await this.loadThreads();
    } catch (error) {
      this.error = this.describeError(error);
    } finally {
      this.dialogPending = false;
      this.dialog = null;
    }
  }

  private async sendChat(): Promise<void> {
    const value = this.chatText.trim();
    if (!value || this.busy) return;
    this.chatText = "";
    this.chat = [
      ...this.chat,
      {
        id: `pending-${Date.now()}`,
        role: "user",
        content: value,
        created_at: new Date().toISOString(),
      },
    ];
    this.busy = true;
    this.progress = { stage: "provider" };
    this.error = "";
    try {
      const response = await this.call<{ message: ChatMessage }>("haos_ai/chat", {
        thread_id: this.threadId,
        text: value,
      });
      this.chat = [...this.chat, response.message];
      await this.loadThreads();
    } catch (error) {
      this.error = this.describeError(error);
      await this.loadThread();
    } finally {
      this.busy = false;
      this.progress = undefined;
    }
  }

  private async loadActivity(): Promise<void> {
    try {
      this.activity = await this.call<Activity>("haos_ai/activity");
    } catch (error) {
      this.error = this.describeError(error);
    }
  }

  private async openReceipt(receiptId: string): Promise<void> {
    this.selectedReceiptId = receiptId;
    this.receipt = undefined;
    try {
      this.receipt = await this.call<PrivacyReceipt>("haos_ai/privacy_receipt", {
        receipt_id: receiptId,
      });
    } catch (error) {
      this.error = this.describeError(error);
    }
  }

  private async savePreferences(): Promise<void> {
    if (!this.overview) return;
    this.busy = true;
    this.settingsNotice = "";
    try {
      await this.call("haos_ai/preferences/update", {
        preferences: {
          ...this.overview.preferences,
          goals: this.selectedGoals,
          ignored_entities: this.ignoredEntities,
          ignored_domains: this.ignoredDomains,
          ignored_areas: this.ignoredAreas,
          ignored_labels: this.ignoredLabels,
          monthly_token_budget: this.monthlyTokenBudget,
          advisor_mode: this.advisorMode,
          scan_depth: this.scanDepth,
          automation_complexity: this.automationComplexity,
          fix_existing_first: this.fixExistingFirst,
          avoid_new_hardware: this.avoidNewHardware,
          change_permissions: this.changePermissions,
          quiet_hours: { start: this.quietStart, end: this.quietEnd },
        },
      });
      await this.loadOverview();
      this.settingsNotice = "Advisor preferences saved.";
    } catch (error) {
      this.error = this.describeError(error);
    } finally {
      this.busy = false;
    }
  }

  private connectionOptions(): Record<string, unknown> {
    return {
      history_days: this.historyDays,
      include_exact_location: this.includeExactLocation,
      schedule: this.schedule,
      schedule_time: `${this.scheduleTime}:00`,
      schedule_weekday: this.scheduleWeekday,
      notify_new_suggestions: this.notifyNewSuggestions,
    };
  }

  private async saveConnection(): Promise<void> {
    if (!this.overview) return;
    this.busy = true;
    this.settingsNotice = "";
    try {
      await this.call("haos_ai/config/update", {
        connection: {
          provider: this.providerDraft,
          model: this.modelDraft.trim(),
          base_url: this.baseUrlDraft.trim(),
          api_key: this.apiKeyDraft,
        },
        scan_profile: this.scanProfileEnabled
          ? {
              enabled: true,
              provider: this.scanProviderDraft,
              model: this.scanModelDraft.trim(),
              base_url: this.scanBaseUrlDraft.trim(),
              api_key: this.scanApiKeyDraft,
            }
          : { enabled: false },
        options: this.connectionOptions(),
      });
      this.apiKeyDraft = "";
      this.scanApiKeyDraft = "";
      this.settingsNotice =
        "Connection verified and saved. HAOS AI is reloading…";
      window.setTimeout(() => void this.loadOverview(), 1600);
    } catch (error) {
      this.error = this.describeError(error);
    } finally {
      this.busy = false;
    }
  }

  private async saveOptions(): Promise<void> {
    this.busy = true;
    this.settingsNotice = "";
    try {
      await this.call("haos_ai/options/update", {
        options: this.connectionOptions(),
      });
      this.settingsNotice = "Privacy and schedule settings saved.";
      window.setTimeout(() => void this.loadOverview(), 1200);
    } catch (error) {
      this.error = this.describeError(error);
    } finally {
      this.busy = false;
    }
  }

  private toggleGoal(goalId: string): void {
    this.selectedGoals = this.selectedGoals.includes(goalId)
      ? this.selectedGoals.filter((value) => value !== goalId)
      : [...this.selectedGoals, goalId];
    this.settingsNotice = "";
  }

  private providerChanged(provider: string): void {
    const previous = this.overview?.provider_options.find(
      (item) => item.id === this.providerDraft,
    );
    const next = this.overview?.provider_options.find(
      (item) => item.id === provider,
    );
    const usingPreviousDefault =
      !this.modelDraft || this.modelDraft === previous?.default_model;
    const usingPreviousEndpoint =
      !this.baseUrlDraft || this.baseUrlDraft === previous?.default_base_url;
    this.providerDraft = provider;
    if (next && usingPreviousDefault) this.modelDraft = next.default_model;
    if (next && usingPreviousEndpoint) this.baseUrlDraft = next.default_base_url;
    this.apiKeyDraft = "";
    this.settingsNotice = "";
  }

  private openClearInbox(): void {
    if (this.filteredSuggestions.length === 0) return;
    this.dialog = "clear-inbox";
  }

  private async clearInbox(): Promise<void> {
    const status = this.filter === "all" ? undefined : this.filter;
    this.dialog = null;
    this.busy = true;
    try {
      await this.call("haos_ai/suggestions/clear", {
        ...(status ? { status } : {}),
      });
      this.selectedId = undefined;
      await this.loadOverview();
    } catch (error) {
      this.error = this.describeError(error);
    } finally {
      this.busy = false;
    }
  }

  private changeFor(item: Suggestion): PendingChange | undefined {
    if (item.automation) {
      return {
        kind: item.automation.target_id
          ? "update_automation"
          : "create_automation",
        suggestionId: item.id,
        targetId: item.automation.target_id ?? "new automation",
        label: item.title,
      };
    }
    if (!item.operation) return undefined;
    return {
      kind: item.operation.type,
      suggestionId: item.id,
      targetId: item.operation.target_id,
      label: item.operation.label,
      configEntryId: item.operation.config_entry_id ?? undefined,
    };
  }

  private canApply(change: PendingChange): boolean {
    return {
      create_automation: this.changePermissions.create_automations,
      update_automation: this.changePermissions.update_automations,
      remove_entity: this.changePermissions.remove_entities,
      remove_device: this.changePermissions.remove_devices,
    }[change.kind];
  }

  private openChangeApproval(item: Suggestion): void {
    const change = this.changeFor(item);
    if (!change || !this.canApply(change)) return;
    this.pendingChange = change;
    this.diffLines = undefined;
    this.diffError = "";
    this.dialog = "approve-change";
    if (change.kind === "update_automation") void this.loadDiff(change.targetId);
  }

  /** Fetch the stored automation so the approval dialog can show a real diff. */
  private async loadDiff(automationId: string): Promise<void> {
    this.diffLoading = true;
    this.diffError = "";
    try {
      const current = await this.call<{ found: boolean; yaml: string }>(
        "haos_ai/automation/current",
        { automation_id: automationId },
      );
      if (!current.found) {
        this.diffError = this.t("diff.unavailable");
        return;
      }
      this.diffLines = diffLines(current.yaml, this.draftYaml);
    } catch (error) {
      this.diffError = this.describeError(error);
    } finally {
      this.diffLoading = false;
    }
  }

  private async approveChange(): Promise<void> {
    const change = this.pendingChange;
    if (!change || !this.canApply(change) || !this.hass) return;
    const isAutomation =
      change.kind === "create_automation" || change.kind === "update_automation";
    // The dialog stays up, with its buttons disabled, until the write settles.
    this.dialogPending = true;
    this.busy = true;
    this.error = "";
    try {
      let config: unknown;
      if (isAutomation) {
        if (!this.draftValidation?.valid) {
          throw new Error("Validate the current automation draft before approval.");
        }
        config = parse(this.draftYaml);
        if (!config || typeof config !== "object" || Array.isArray(config)) {
          throw new Error("Automation YAML must contain one object.");
        }
      } else if (change.kind === "remove_device" && !change.configEntryId) {
        throw new Error("The device's integration reference is missing.");
      }
      // Every kind goes through the same backend gate, which re-checks the
      // permission, re-validates, and confirms the target is still current.
      await this.call("haos_ai/change/apply", {
        suggestion_id: change.suggestionId,
        confirm: true,
        operation: change.kind,
        ...(isAutomation ? { config } : {}),
      });
      this.pendingChange = undefined;
      this.diffLines = undefined;
      this.draftDirty = false;
      this.dialog = null;
      this.settingsNotice = "Approved change applied by Home Assistant.";
      await this.loadOverview();
      if (this.tab === "activity") await this.loadActivity();
    } catch (error) {
      this.error = this.describeError(error);
      // Close on failure too, so the alert inside the panel is readable.
      this.dialog = null;
    } finally {
      this.busy = false;
      this.dialogPending = false;
    }
  }

  private get matchingEntities(): HassState[] {
    const query = this.ignoredEntityQuery.trim().toLocaleLowerCase();
    if (!query) return [];
    return Object.values(this.hass?.states ?? {})
      .filter((entity) => !this.ignoredEntities.includes(entity.entity_id))
      .filter((entity) => {
        const name = entity.attributes.friendly_name ?? "";
        return `${entity.entity_id} ${name}`.toLocaleLowerCase().includes(query);
      })
      .slice(0, 8);
  }

  private addIgnoredEntities(values: string[]): void {
    const valid: string[] = [];
    const invalid: string[] = [];
    for (const raw of values) {
      const entityId = raw.trim().replace(/^['"]|['"]$/g, "");
      if (!entityId) continue;
      if (/^[a-z0-9_]+\.[a-z0-9_]+$/.test(entityId)) valid.push(entityId);
      else invalid.push(entityId);
    }
    this.ignoredEntities = [
      ...this.ignoredEntities,
      ...valid.filter((value) => !this.ignoredEntities.includes(value)),
    ];
    this.ignoredEntityError = invalid.length
      ? `Could not add: ${invalid.slice(0, 3).join(", ")}`
      : "";
    this.ignoredEntityQuery = "";
    this.settingsNotice = "";
  }

  /** Domains present in this installation, minus the ones already ignored. */
  private get availableDomains(): string[] {
    const domains = new Set<string>();
    for (const entityId of Object.keys(this.hass?.states ?? {})) {
      const domain = entityId.split(".", 1)[0];
      if (domain && !this.ignoredDomains.includes(domain)) domains.add(domain);
    }
    return [...domains].sort();
  }

  private get availableAreas(): HassArea[] {
    return Object.values(this.hass?.areas ?? {})
      .filter((area) => !this.ignoredAreas.includes(area.area_id))
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  private get availableLabels(): string[] {
    const labels = new Set<string>();
    for (const entry of Object.values(this.hass?.entities ?? {})) {
      for (const label of entry.labels ?? []) {
        if (!this.ignoredLabels.includes(label)) labels.add(label);
      }
    }
    return [...labels].sort();
  }

  private areaName(areaId: string): string {
    return this.hass?.areas?.[areaId]?.name ?? areaId;
  }

  private addIgnoredScope(
    scope: "domains" | "areas" | "labels",
    value: string,
  ): void {
    const cleaned = value.trim();
    if (!cleaned) return;
    if (scope === "domains") {
      if (!this.ignoredDomains.includes(cleaned)) {
        this.ignoredDomains = [...this.ignoredDomains, cleaned];
      }
      this.ignoredDomainQuery = "";
    } else if (scope === "areas") {
      if (!this.ignoredAreas.includes(cleaned)) {
        this.ignoredAreas = [...this.ignoredAreas, cleaned];
      }
      this.ignoredAreaQuery = "";
    } else {
      if (!this.ignoredLabels.includes(cleaned)) {
        this.ignoredLabels = [...this.ignoredLabels, cleaned];
      }
      this.ignoredLabelQuery = "";
    }
    this.settingsNotice = "";
  }

  private removeIgnoredScope(
    scope: "domains" | "areas" | "labels",
    value: string,
  ): void {
    if (scope === "domains") {
      this.ignoredDomains = this.ignoredDomains.filter((item) => item !== value);
    } else if (scope === "areas") {
      this.ignoredAreas = this.ignoredAreas.filter((item) => item !== value);
    } else {
      this.ignoredLabels = this.ignoredLabels.filter((item) => item !== value);
    }
    this.settingsNotice = "";
  }

  private handleEntityKeydown(event: KeyboardEvent): void {
    const matches = this.matchingEntities;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!matches.length) return;
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = this.entityHighlight + step;
      // Wrap around so the list stays reachable from either end.
      this.entityHighlight = (next + matches.length) % matches.length;
      return;
    }
    if (event.key === "Escape") {
      this.entityHighlight = -1;
      return;
    }
    if (event.key !== "Enter" && event.key !== ",") return;
    event.preventDefault();
    const selected =
      this.entityHighlight >= 0 ? matches[this.entityHighlight] : matches[0];
    this.addIgnoredEntities([
      selected?.entity_id ?? this.ignoredEntityQuery.trim(),
    ]);
  }

  private handleEntityPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData("text") ?? "";
    const values = text.split(/[\s,;]+/).filter(Boolean);
    if (!values.some((value) => value.includes("."))) return;
    event.preventDefault();
    this.addIgnoredEntities(values);
  }

  private async validateDraft(): Promise<void> {
    this.draftError = "";
    let config: unknown;
    try {
      config = parse(this.draftYaml);
    } catch (error) {
      this.draftError = `YAML syntax: ${this.describeError(error)}`;
      return;
    }
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      this.draftError = "Automation YAML must contain one object.";
      return;
    }
    this.busy = true;
    try {
      const result = await this.call<{
        validation: ValidationResult;
        yaml: string;
      }>("haos_ai/automation/validate", { config });
      this.draftYaml = result.yaml;
      this.draftValidation = result.validation;
      // The validated draft is what the user is working on; keep it.
      this.draftDirty = true;
    } catch (error) {
      this.draftError = this.describeError(error);
    } finally {
      this.busy = false;
    }
  }

  private async copyYaml(yaml = this.draftYaml): Promise<void> {
    await navigator.clipboard.writeText(yaml);
    this.copied = true;
    window.setTimeout(() => (this.copied = false), 1600);
  }

  private downloadYaml(item: Suggestion): void {
    if (!this.draftYaml) return;
    const blob = new Blob([this.draftYaml], { type: "application/x-yaml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "automation"}.yaml`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private async copyAndOpenEditor(): Promise<void> {
    await this.copyYaml();
    this.navigate("/config/automation/new");
  }

  private reviseInChat(item: Suggestion): void {
    this.newThread();
    this.chatText = `Help me revise this proposed automation. Keep it read only, explain the changes, and return one complete Home Assistant YAML block.\n\nTitle: ${item.title}\n\nCurrent YAML:\n\`\`\`yaml\n${this.draftYaml}\n\`\`\``;
    this.changeTab("chat");
  }

  private extractYaml(content: string): string | undefined {
    const match = content.match(/```(?:yaml|yml)?\s*\n([\s\S]*?)```/i);
    return match?.[1].trim();
  }

  private useChatYaml(content: string): void {
    const yaml = this.extractYaml(content);
    if (!yaml || !this.selected) return;
    this.draftYaml = yaml;
    this.draftValidation = undefined;
    this.draftError = "";
    // The user loaded this deliberately, so a refresh must not overwrite it.
    this.draftDirty = true;
    this.tab = "inbox";
  }

  private navigate(path: string): void {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new Event("location-changed"));
  }

  private evidencePath(evidence: Evidence): string | undefined {
    const source = evidence.source_id;
    if (evidence.source_type === "history" && source.includes(".")) {
      return `/history?entity_id=${encodeURIComponent(source)}`;
    }
    if (
      ["entity", "registry", "automation"].includes(evidence.source_type) &&
      source.includes(".")
    ) {
      return `/config/entities/entity/${encodeURIComponent(source)}`;
    }
    if (evidence.source_type === "integration" && source) {
      return `/config/integrations/integration/${encodeURIComponent(source)}`;
    }
    return undefined;
  }

  protected firstUpdated(): void {
    if (this.tab === "chat") void this.loadThread();
  }

  private changeTab(tab: Tab): void {
    this.tab = tab;
    if (tab === "chat") {
      void this.loadThreads();
      if (this.chat.length === 0) void this.loadThread();
    }
    if (tab === "activity") void this.loadActivity();
  }

  protected render() {
    return html`
      <div class="shell">
        ${this.renderHeader()}
        ${this.progress ? this.renderProgress() : nothing}
        ${this.renderBudgetBanner()}
        <main>
          ${this.error ? this.renderAlert() : nothing}
          ${this.loading
            ? this.renderLoading()
            : this.tab === "inbox"
              ? this.renderInbox()
              : this.tab === "chat"
                ? this.renderChat()
                : this.tab === "activity"
                  ? this.renderActivity()
                  : this.renderSettings()}
        </main>
      </div>
      ${this.preview ? this.renderPreviewDialog() : nothing}
      ${this.dialog ? this.renderActionDialog() : nothing}
    `;
  }

  private renderHeader() {
    return html`
      <header class="app-header">
        <div class="title-lockup">
          ${this.renderLogo()}
          <h1>HAOS AI</h1>
        </div>
        <nav class="tabs" aria-label="HAOS AI sections" role="tablist">
          ${this.navButton("inbox", "Inbox", this.overview?.counts.new)}
          ${this.navButton("chat", "Chat")}
          ${this.navButton("activity", "Activity")}
          ${this.navButton("settings", "Settings")}
        </nav>
        <ha-button
          class="scan-action"
          appearance="accent"
          ?disabled=${this.busy || this.loading}
          @click=${this.openPreview}
        >
          <ha-icon icon="mdi:creation-outline" slot="start"></ha-icon>
          Run scan
        </ha-button>
      </header>
    `;
  }

  private get budget(): BudgetStatus | undefined {
    return this.activity?.budget ?? this.overview?.budget;
  }

  private renderBudgetBanner() {
    const budget = this.budget;
    if (!budget?.budget || (!budget.warning && !budget.exceeded)) return nothing;
    return html`
      <div
        class="budget-banner ${budget.exceeded ? "exceeded" : "warning"}"
        role=${budget.exceeded ? "alert" : "status"}
      >
        <ha-icon
          icon=${budget.exceeded
            ? "mdi:alert-octagon-outline"
            : "mdi:gauge-low"}
        ></ha-icon>
        <span>
          ${budget.exceeded
            ? this.t("budget.exceeded")
            : this.t("budget.warning")}
          <small>
            ${budget.total_tokens.toLocaleString()} /
            ${budget.budget.toLocaleString()}
          </small>
        </span>
        <ha-button appearance="plain" @click=${() => this.changeTab("settings")}>
          ${this.t("budget.title")}
        </ha-button>
      </div>
    `;
  }

  private renderLogo() {
    return html`
      <span class="logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="img">
          <path class="logo-house" d="M3.5 10.1 12 3.5l8.5 6.6v9.1H3.5z" />
          <path
            class="logo-spark"
            d="m12 7.25.85 2.35 2.4.9-2.4.9L12 13.75l-.85-2.35-2.4-.9 2.4-.9z"
          />
          <circle cx="7.2" cy="16.6" r="1" />
          <circle cx="16.8" cy="16.6" r="1" />
          <path class="logo-link" d="M8.2 16.6h7.6" />
        </svg>
      </span>
    `;
  }

  private navButton(tab: Tab, label: string, count?: number) {
    return html`
      <button
        role="tab"
        class=${this.tab === tab ? "active" : ""}
        aria-selected=${this.tab === tab ? "true" : "false"}
        @click=${() => this.changeTab(tab)}
      >
        ${label}${count ? html`<span class="count">${count}</span>` : nothing}
      </button>
    `;
  }

  private renderProgress() {
    const value = Math.max(0, Math.min(1, this.progress?.progress ?? 0.5));
    return html`
      <div class="progress-panel" role="status" aria-live="polite">
        <div class="progress-copy">
          <strong>${this.progressLabel(this.progress!)}</strong>
          <span>${this.progressDetail(this.progress!)}</span>
        </div>
        <div
          class="progress-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${Math.round(value * 100)}
        >
          <span style=${`--progress: ${value * 100}%`}></span>
        </div>
      </div>
    `;
  }

  private progressLabel(event: ProgressEvent): string {
    return {
      context: "Collecting local context",
      provider: "Asking the advisor",
      tool: "Inspecting your setup",
      validate: "Validating suggestions",
      complete: "Advisor request complete",
    }[event.stage];
  }

  private progressDetail(event: ProgressEvent): string {
    if (event.tool) return event.tool.replaceAll("_", " ");
    if (event.stage === "provider") return "This can take a few minutes.";
    if (event.stage === "complete") return "The local inbox is up to date.";
    return "Read-only operation";
  }

  private renderAlert() {
    return html`
      <div class="alert" role="alert">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${this.error}</span>
        <ha-icon-button
          label="Dismiss error"
          @click=${() => (this.error = "")}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }

  private renderLoading() {
    return html`
      <section class="loading-state" aria-busy="true">
        ${this.renderLogo()}
        <p>Loading HAOS AI…</p>
      </section>
    `;
  }

  private renderInbox() {
    const suggestions = this.filteredSuggestions;
    return html`
      <section class="inbox-layout ${this.selected ? "has-selection" : ""}">
        <aside class="list-pane">
          <div class="pane-heading">
            <div>
              <h2>Suggestions</h2>
              <p>Nothing is applied automatically.</p>
            </div>
            <div class="inbox-heading-actions">
              <span class="total">${suggestions.length}</span>
              <ha-icon-button
                label=${this.filter === "all"
                  ? "Clear entire inbox"
                  : `Clear ${this.filter} suggestions`}
                ?disabled=${this.busy || suggestions.length === 0}
                @click=${this.openClearInbox}
              >
                <ha-icon icon="mdi:inbox-remove-outline"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div class="filters" aria-label="Suggestion filters">
            ${(["new", "saved", "dismissed", "all"] as Filter[]).map(
              (filter) => html`
                <button
                  class=${this.filter === filter ? "active" : ""}
                  aria-pressed=${this.filter === filter ? "true" : "false"}
                  @click=${() => {
                    this.filter = filter;
                    this.selectedId = undefined;
                  }}
                >
                  ${filter}
                  <span>
                    ${filter === "all"
                      ? this.overview?.suggestions.length ?? 0
                      : this.overview?.counts[filter] ?? 0}
                  </span>
                </button>
              `,
            )}
          </div>
          <div class="suggestion-list">
            ${suggestions.length === 0
              ? html`
                  <div class="empty compact">
                    <ha-icon icon="mdi:inbox-outline"></ha-icon>
                    <h3>No ${this.filter === "all" ? "" : this.filter} suggestions</h3>
                    <p>
                      ${this.filter === "new"
                        ? "Run a scan when you want the advisor to look for useful routines and setup issues."
                        : "Items you organise here remain local to Home Assistant."}
                    </p>
                  </div>
                `
              : suggestions.map((item) => this.renderSuggestionRow(item))}
          </div>
        </aside>
        <article class="detail-pane">
          ${this.selected
            ? this.renderSuggestionDetail(this.selected)
            : html`
                <div class="empty">
                  ${this.renderLogo()}
                  <h2>Select a suggestion</h2>
                  <p>
                    Review the evidence, validation result, and automation draft
                    before deciding what to keep.
                  </p>
                </div>
              `}
        </article>
      </section>
    `;
  }

  private renderSuggestionRow(item: Suggestion) {
    return html`
      <button
        class="suggestion-row ${this.selectedId === item.id ? "selected" : ""}"
        aria-pressed=${this.selectedId === item.id ? "true" : "false"}
        @click=${() => (this.selectedId = item.id)}
      >
        <ha-icon
          icon=${item.kind === "automation"
            ? "mdi:robot-outline"
            : "mdi:wrench-check-outline"}
        ></ha-icon>
        <span class="row-content">
          <strong>${item.title}</strong>
          <span class="summary">${item.summary}</span>
          <span class="meta">
            ${item.impact} impact · ${this.relativeDate(item.last_seen_at ?? item.created_at)}
            ${(item.occurrences ?? 1) > 1
              ? ` · seen in ${item.occurrences} scans`
              : ""}
          </span>
        </span>
        <span class="confidence" title="Model confidence">
          ${Math.round(item.confidence * 100)}%
        </span>
      </button>
    `;
  }

  private renderSuggestionDetail(item: Suggestion) {
    const validation = this.draftValidation ?? item.automation?.validation;
    const proposedChange = this.changeFor(item);
    const changeAllowed = proposedChange
      ? this.canApply(proposedChange)
      : false;
    const explanation =
      item.automation?.explanation ??
      item.automation?.config?.description ??
      item.summary;
    return html`
      <div class="detail-content">
        <ha-button
          class="mobile-back"
          appearance="plain"
          @click=${() => (this.selectedId = undefined)}
        >
          <ha-icon icon="mdi:arrow-left" slot="start"></ha-icon>
          Suggestions
        </ha-button>

        <header class="detail-heading">
          <div class="detail-title">
            <div class="detail-icon ${item.kind}">
              <ha-icon
                icon=${item.kind === "automation"
                  ? "mdi:robot-outline"
                  : "mdi:wrench-check-outline"}
              ></ha-icon>
            </div>
            <div>
              <h2>${item.title}</h2>
              <p>${item.summary}</p>
            </div>
          </div>
          <span class="status-badge ${item.impact}">${item.impact} impact</span>
        </header>

        <section class="detail-section">
          <h3>Why this surfaced</h3>
          <p>${item.rationale}</p>
          <div class="evidence-list">
            ${item.evidence.map((evidence) => this.renderEvidence(evidence))}
          </div>
        </section>

        ${item.automation
          ? html`
              <section class="detail-section">
                <h3>What the automation does</h3>
                <p>${explanation}</p>
              </section>
              <section class="detail-section yaml-section">
                <div class="section-heading">
                  <div>
                    <h3>Automation draft</h3>
                    <p>Edit locally and validate again before copying.</p>
                  </div>
                  <span
                    class="status-badge ${validation?.valid ? "valid" : "invalid"}"
                  >
                    ${validation?.valid ? "Validated" : "Check YAML"}
                  </span>
                </div>
                ${this.draftError
                  ? html`<div class="inline-error" role="alert">${this.draftError}</div>`
                  : nothing}
                ${validation && !validation.valid
                  ? html`
                      <div class="validation-errors">
                        ${Object.entries(validation.errors).map(
                          ([field, message]) =>
                            html`<p><strong>${field}:</strong> ${message}</p>`,
                        )}
                      </div>
                    `
                  : nothing}
                <textarea
                  class="yaml-editor"
                  aria-label="Automation YAML"
                  spellcheck="false"
                  .value=${this.draftYaml}
                  @input=${(event: InputEvent) => {
                    this.draftYaml = (event.target as HTMLTextAreaElement).value;
                    this.draftValidation = undefined;
                    this.draftDirty = true;
                  }}
                ></textarea>
                <div class="yaml-actions">
                  <ha-button appearance="outlined" @click=${this.validateDraft}>
                    <ha-icon icon="mdi:check-decagram-outline" slot="start"></ha-icon>
                    Validate
                  </ha-button>
                  <ha-button appearance="plain" @click=${() => this.copyYaml()}>
                    <ha-icon icon="mdi:content-copy" slot="start"></ha-icon>
                    ${this.copied ? "Copied" : "Copy"}
                  </ha-button>
                  <ha-button appearance="plain" @click=${() => this.downloadYaml(item)}>
                    <ha-icon icon="mdi:download-outline" slot="start"></ha-icon>
                    Download
                  </ha-button>
                  <ha-button appearance="plain" @click=${this.copyAndOpenEditor}>
                    <ha-icon icon="mdi:open-in-new" slot="start"></ha-icon>
                    Copy & open editor
                  </ha-button>
                  <ha-button appearance="plain" @click=${() => this.reviseInChat(item)}>
                    <ha-icon icon="mdi:message-processing-outline" slot="start"></ha-icon>
                    Revise in chat
                  </ha-button>
                </div>
              </section>
            `
          : nothing}

        <footer class="decision-bar">
          <span>
            <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
            ${proposedChange && changeAllowed
              ? "No automatic writes. Every change requires your approval."
              : "HAOS AI is read-only unless you enable an approval capability."}
          </span>
          <div class="decision-actions">
            ${item.status !== "dismissed"
              ? html`
                  <ha-button appearance="plain" @click=${() => this.openFeedback(item)}>
                    Dismiss
                  </ha-button>
                `
              : html`
                  <ha-button
                    appearance="plain"
                    @click=${() => this.updateSuggestion(item.id, "new")}
                  >
                    Restore
                  </ha-button>
                `}
            ${proposedChange && changeAllowed && item.status !== "dismissed"
              ? html`
                  <ha-button
                    appearance="accent"
                    ?disabled=${this.busy ||
                    ((proposedChange.kind === "create_automation" ||
                      proposedChange.kind === "update_automation") &&
                      !validation?.valid)}
                    @click=${() => this.openChangeApproval(item)}
                  >
                    <ha-icon icon="mdi:shield-check-outline" slot="start"></ha-icon>
                    ${proposedChange.kind === "create_automation"
                      ? "Review & create"
                      : proposedChange.kind === "update_automation"
                        ? "Review & update"
                      : "Review removal"}
                  </ha-button>
                `
              : nothing}
            ${item.status !== "saved"
              ? html`
                  <ha-button
                    appearance="accent"
                    @click=${() => this.updateSuggestion(item.id, "saved")}
                  >
                    <ha-icon icon="mdi:bookmark-outline" slot="start"></ha-icon>
                    Save
                  </ha-button>
                `
              : html`<span class="saved-label">
                  <ha-icon icon="mdi:bookmark-check"></ha-icon> Saved
                </span>`}
          </div>
        </footer>
      </div>
    `;
  }

  private renderEvidence(evidence: Evidence) {
    const path = this.evidencePath(evidence);
    return html`
      <div class="evidence-row">
        <ha-icon
          icon=${evidence.source_type === "history"
            ? "mdi:chart-timeline-variant"
            : evidence.source_type === "integration"
              ? "mdi:puzzle-outline"
              : "mdi:information-outline"}
        ></ha-icon>
        <div>
          <strong>${evidence.source_id}</strong>
          <p>${evidence.observation}</p>
          ${evidence.period ? html`<small>${evidence.period}</small>` : nothing}
          ${evidence.verified
            ? nothing
            : html`<small class="evidence-unverified"
                >${this.t("evidence.unverified")}</small
              >`}
        </div>
        ${path
          ? html`
              <ha-icon-button
                label="Open in Home Assistant"
                @click=${() => this.navigate(path)}
              >
                <ha-icon icon="mdi:open-in-new"></ha-icon>
              </ha-icon-button>
            `
          : nothing}
      </div>
    `;
  }

  private renderChat() {
    const current = this.threads.find((item) => item.id === this.threadId);
    return html`
      <section class="chat-layout">
        <aside class="thread-pane">
          <div class="pane-heading thread-heading">
            <h2>Conversations</h2>
            <ha-icon-button
              label="New conversation"
              @click=${this.newThread}
            >
              <ha-icon icon="mdi:plus"></ha-icon>
            </ha-icon-button>
          </div>
          <div class="thread-list">
            ${this.threads.length
              ? this.threads.map(
                  (thread) => html`
                    <button
                      class=${thread.id === this.threadId ? "selected" : ""}
                      @click=${() => this.selectThread(thread.id)}
                    >
                      <ha-icon icon="mdi:message-text-outline"></ha-icon>
                      <span>
                        <strong>${thread.title}</strong>
                        <small>${thread.message_count} messages</small>
                      </span>
                    </button>
                  `,
                )
              : html`<p class="thread-empty">No saved conversations yet.</p>`}
          </div>
        </aside>
        <div class="conversation-pane">
          <header class="conversation-header">
            <div>
              <h2>${current?.title ?? "New conversation"}</h2>
              <p>Read-only answers grounded in your Home Assistant setup.</p>
            </div>
            <div class="conversation-actions">
              <span class="read-only-badge">
                <ha-icon icon="mdi:shield-check-outline"></ha-icon> Read only
              </span>
              ${current
                ? html`
                    <ha-icon-button
                      label="Rename conversation"
                      @click=${this.openRenameThread}
                    >
                      <ha-icon icon="mdi:pencil-outline"></ha-icon>
                    </ha-icon-button>
                    <ha-icon-button
                      label="Delete conversation"
                      @click=${() => (this.dialog = "delete-thread")}
                    >
                      <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </ha-icon-button>
                  `
                : nothing}
            </div>
          </header>
          <div class="messages" aria-live="polite">
            ${this.chat.length === 0
              ? html`
                  <div class="empty chat-empty">
                    <ha-icon icon="mdi:message-question-outline"></ha-icon>
                    <h3>Ask a question about your home</h3>
                    <p>
                      Try “Which lights are missing areas?” or “Help me design a
                      reliable bedtime routine.”
                    </p>
                  </div>
                `
              : this.chat.map((message) => {
                  const proposedYaml =
                    message.role === "assistant"
                      ? this.extractYaml(message.content)
                      : undefined;
                  return html`
                    <div class="message ${message.role}">
                      <div class="message-avatar">
                        ${message.role === "assistant"
                          ? this.renderLogo()
                          : html`<ha-icon icon="mdi:account-outline"></ha-icon>`}
                      </div>
                      <div>
                        <strong>${message.role === "user" ? "You" : "HAOS AI"}</strong>
                        <p>${message.content}</p>
                        ${proposedYaml
                          ? html`
                              <div class="message-actions">
                                ${this.selected?.automation
                                  ? html`
                                      <ha-button
                                        appearance="outlined"
                                        @click=${() => this.useChatYaml(message.content)}
                                      >
                                        <ha-icon icon="mdi:file-replace-outline" slot="start"></ha-icon>
                                        Use as automation draft
                                      </ha-button>
                                    `
                                  : html`
                                      <ha-button
                                        appearance="outlined"
                                        @click=${() => void this.copyYaml(proposedYaml)}
                                      >
                                        <ha-icon icon="mdi:content-copy" slot="start"></ha-icon>
                                        Copy YAML
                                      </ha-button>
                                      <small class="message-hint">
                                        A draft is validated and approved against a
                                        suggestion, so select an automation suggestion
                                        in the inbox to use this one.
                                      </small>
                                    `}
                              </div>
                            `
                          : nothing}
                      </div>
                    </div>
                  `;
                })}
            ${this.busy && this.tab === "chat"
              ? html`
                  <div class="message assistant pending">
                    <div class="message-avatar">${this.renderLogo()}</div>
                    <div><strong>HAOS AI</strong><p>Inspecting your setup…</p></div>
                  </div>
                `
              : nothing}
          </div>
          <form
            class="composer"
            @submit=${(event: SubmitEvent) => {
              event.preventDefault();
              void this.sendChat();
            }}
          >
            <textarea
              .value=${this.chatText}
              placeholder="Ask about devices, routines, integrations, or an automation idea…"
              aria-label="Message"
              @input=${(event: InputEvent) =>
                (this.chatText = (event.target as HTMLTextAreaElement).value)}
              @keydown=${(event: KeyboardEvent) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void this.sendChat();
                }
              }}
            ></textarea>
            <ha-button
              appearance="accent"
              type="button"
              ?disabled=${this.busy || !this.chatText.trim()}
              @click=${this.sendChat}
            >
              <ha-icon icon="mdi:send" slot="start"></ha-icon>
              Send
            </ha-button>
          </form>
        </div>
      </section>
    `;
  }

  private renderActivity() {
    const receipts = this.activity?.receipts ?? [];
    return html`
      <section class="activity-layout ${this.selectedReceiptId ? "has-selection" : ""}">
        <aside class="list-pane activity-list">
          <div class="pane-heading">
            <div>
              <h2>Activity</h2>
              <p>Provider requests stored locally for 90 days.</p>
            </div>
            <ha-icon-button
              label="Refresh activity"
              @click=${this.loadActivity}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </ha-icon-button>
          </div>
          ${receipts.length
            ? receipts.map((item) => this.renderReceiptRow(item))
            : html`
                <div class="empty compact">
                  <ha-icon icon="mdi:history"></ha-icon>
                  <h3>No advisor activity yet</h3>
                  <p>Receipts appear after a scan or conversation request.</p>
                </div>
              `}
        </aside>
        <article class="detail-pane activity-detail">
          ${this.receipt
            ? this.renderReceiptDetail(this.receipt)
            : this.renderActivityOverview()}
        </article>
      </section>
    `;
  }

  private renderReceiptRow(item: ReceiptSummary) {
    return html`
      <button
        class="receipt-row ${item.id === this.selectedReceiptId ? "selected" : ""}"
        @click=${() => this.openReceipt(item.id)}
      >
        <ha-icon
          icon=${item.purpose === "scan" ? "mdi:radar" : "mdi:message-outline"}
        ></ha-icon>
        <span>
          <strong>${item.purpose === "scan" ? "Advisor scan" : "Conversation"}</strong>
          <small>${item.provider} · ${item.model}</small>
          <small>${this.formatUsage(item.usage)} · ${this.relativeDate(item.created_at)}</small>
        </span>
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>
    `;
  }

  private renderActivityOverview() {
    const scans = this.activity?.scan_runs ?? this.overview?.scan_runs ?? [];
    const latest = scans[0];
    const totalSuggestions = scans.reduce(
      (sum, item) => sum + item.recommendation_count,
      0,
    );
    return html`
      <div class="detail-content activity-overview">
        <header class="detail-heading">
          <div class="detail-title">
            <div class="detail-icon activity"><ha-icon icon="mdi:shield-search"></ha-icon></div>
            <div>
              <h2>Privacy ledger</h2>
              <p>Every provider request leaves a local, inspectable receipt.</p>
            </div>
          </div>
        </header>
        <dl class="stats-list">
          <div><dt>Recorded scans</dt><dd>${scans.length}</dd></div>
          <div><dt>New suggestions recorded</dt><dd>${totalSuggestions}</dd></div>
          <div>
            <dt>Last scan</dt>
            <dd>${latest ? this.relativeDate(latest.created_at) : "Never"}</dd>
          </div>
          <div>
            <dt>Retention</dt>
            <dd>90 days</dd>
          </div>
        </dl>
        ${this.renderBudgetStats()}
        ${this.renderAppliedChanges()}
        <section class="detail-section">
          <h3>What a receipt records</h3>
          <p>
            Provider, model, token usage, redactions, context categories, and the
            exact bounded read-only tool results sent for that request.
          </p>
        </section>
      </div>
    `;
  }

  private renderBudgetStats() {
    const budget = this.budget;
    if (!budget) return nothing;
    return html`
      <section class="detail-section">
        <h3>${this.t("budget.title")}</h3>
        <dl class="stats-list compact-stats">
          <div>
            <dt>${this.t("budget.used")}</dt>
            <dd>${budget.total_tokens.toLocaleString()}</dd>
          </div>
          <div>
            <dt>${this.t("budget.remaining")}</dt>
            <dd>
              ${budget.budget
                ? (budget.remaining ?? 0).toLocaleString()
                : this.t("budget.no_cap")}
            </dd>
          </div>
          <div>
            <dt>${this.t("budget.requests")}</dt>
            <dd>${budget.requests}</dd>
          </div>
        </dl>
        ${budget.budget
          ? html`<div
              class="budget-meter ${budget.exceeded
                ? "exceeded"
                : budget.warning
                  ? "warning"
                  : ""}"
              role="img"
              aria-label=${`${Math.round(budget.ratio * 100)}%`}
            >
              <span style=${`width:${Math.min(100, budget.ratio * 100)}%`}></span>
            </div>`
          : nothing}
      </section>
    `;
  }

  private renderAppliedChanges() {
    const applied =
      this.activity?.applied_changes ?? this.overview?.applied_changes ?? [];
    return html`
      <section class="detail-section applied-section">
        <h3>${this.t("applied.title")}</h3>
        <p>${this.t("applied.description")}</p>
        ${applied.length
          ? html`<ul class="applied-list">
              ${applied.map(
                (item) => html`
                  <li>
                    <span class="applied-outcome ${item.outcome}">
                      ${this.t(`applied.outcome.${item.outcome}`)}
                    </span>
                    <span class="applied-body">
                      <strong>${item.suggestion_title || item.label}</strong>
                      <small>
                        ${item.kind.replaceAll("_", " ")} ·
                        <code>${item.target_id}</code> ·
                        ${this.relativeDate(item.applied_at)}
                      </small>
                      ${item.outcome_detail
                        ? html`<small>${item.outcome_detail}</small>`
                        : nothing}
                    </span>
                  </li>
                `,
              )}
            </ul>`
          : html`<p class="muted">${this.t("applied.empty")}</p>`}
      </section>
    `;
  }

  private renderReceiptDetail(item: PrivacyReceipt) {
    return html`
      <div class="detail-content receipt-content">
        <ha-button
          class="mobile-back"
          appearance="plain"
          @click=${() => {
            this.selectedReceiptId = undefined;
            this.receipt = undefined;
          }}
        >
          <ha-icon icon="mdi:arrow-left" slot="start"></ha-icon>
          Activity
        </ha-button>
        <header class="detail-heading">
          <div class="detail-title">
            <div class="detail-icon activity">
              <ha-icon icon=${item.purpose === "scan" ? "mdi:radar" : "mdi:message-outline"}></ha-icon>
            </div>
            <div>
              <h2>${item.purpose === "scan" ? "Advisor scan" : "Conversation"}</h2>
              <p>${new Date(item.created_at).toLocaleString()}</p>
            </div>
          </div>
          <span class="status-badge valid">Stored locally</span>
        </header>
        <dl class="stats-list compact-stats">
          <div><dt>Provider</dt><dd>${item.provider}</dd></div>
          <div><dt>Model</dt><dd>${item.model}</dd></div>
          <div><dt>Token usage</dt><dd>${this.formatUsage(item.usage)}</dd></div>
          <div><dt>Redactions</dt><dd>${item.redactions.length}</dd></div>
        </dl>
        <section class="detail-section">
          <h3>Context categories</h3>
          <div class="chip-list">
            ${item.categories.map(
              (category) => html`<span>${category.replaceAll("_", " ")}</span>`,
            )}
          </div>
        </section>
        <section class="detail-section">
          <h3>Redacted fields</h3>
          ${item.redactions.length
            ? html`<ul>${item.redactions.map((value) => html`<li>${value}</li>`)}</ul>`
            : html`<p>No sensitive fields were present in this request.</p>`}
        </section>
        <section class="detail-section payload-section">
          <details>
            <summary>Inspect the exact sanitized payload</summary>
            <pre><code>${JSON.stringify(item.payload_preview, null, 2)}</code></pre>
          </details>
        </section>
      </div>
    `;
  }

  private renderSettings() {
    if (!this.overview) return nothing;
    const knownGoalIds = new Set(
      this.overview.goal_presets.map((goal) => goal.id),
    );
    const importedGoals = this.selectedGoals.filter(
      (goal) => !knownGoalIds.has(goal),
    );
    const selectedProvider = this.overview.provider_options.find(
      (item) => item.id === this.providerDraft,
    );
    return html`
      <section class="settings-layout">
        <header class="settings-heading">
          <div>
            <h2>HAOS AI settings</h2>
            <p>Connection, advisor behavior, privacy, and scheduled scans.</p>
          </div>
          <span class="version-badge">v${this.overview.version}</span>
        </header>
        ${this.settingsNotice
          ? html`<div class="settings-notice" role="status">
              <ha-icon icon="mdi:check-circle-outline"></ha-icon>
              ${this.settingsNotice}
            </div>`
          : nothing}

        <ha-card class="settings-section">
          <div class="settings-section-title">
            <ha-icon icon="mdi:connection"></ha-icon>
            <div>
              <h3>AI connection</h3>
              <p>Change provider or model without leaving HAOS AI.</p>
            </div>
          </div>
          <div class="settings-fields two-column">
            <label>
              <span>Provider</span>
              <select
                .value=${this.providerDraft}
                @change=${(event: Event) =>
                  this.providerChanged((event.target as HTMLSelectElement).value)}
              >
                ${this.overview.provider_options.map(
                  (provider) => html`
                    <option
                      value=${provider.id}
                      ?selected=${provider.id === this.providerDraft}
                    >${provider.label}</option>
                  `,
                )}
              </select>
            </label>
            <label>
              <span>Model</span>
              <input
                .value=${this.modelDraft}
                @input=${(event: InputEvent) =>
                  (this.modelDraft = (event.target as HTMLInputElement).value)}
                placeholder=${selectedProvider?.default_model || "Model identifier"}
                autocomplete="off"
              />
              <small>Use the recommended default or paste any supported model ID.</small>
            </label>
          </div>
          <button
            class="advanced-toggle"
            aria-expanded=${this.showConnectionAdvanced ? "true" : "false"}
            @click=${() =>
              (this.showConnectionAdvanced = !this.showConnectionAdvanced)}
          >
            <ha-icon
              icon=${this.showConnectionAdvanced
                ? "mdi:chevron-up"
                : "mdi:chevron-down"}
            ></ha-icon>
            API key and endpoint
          </button>
          ${this.showConnectionAdvanced
            ? html`
                <div class="settings-fields two-column advanced-fields">
                  <label>
                    <span>New API key</span>
                    <input
                      type="password"
                      .value=${this.apiKeyDraft}
                      @input=${(event: InputEvent) =>
                        (this.apiKeyDraft = (event.target as HTMLInputElement).value)}
                      placeholder="Stored key remains unchanged"
                      autocomplete="new-password"
                    />
                    <small>Required when changing providers; otherwise leave blank.</small>
                  </label>
                  <label>
                    <span>API base URL</span>
                    <input
                      type="url"
                      .value=${this.baseUrlDraft}
                      @input=${(event: InputEvent) =>
                        (this.baseUrlDraft = (event.target as HTMLInputElement).value)}
                      placeholder=${selectedProvider?.default_base_url || "https://…"}
                      autocomplete="url"
                    />
                    <small>Advanced: HAOS AI appends the provider route.</small>
                  </label>
                </div>
              `
            : nothing}
          ${this.renderScanProfile()}
          <div class="settings-action">
            <span>Saving performs a small provider connection test.</span>
            <ha-button appearance="accent" ?disabled=${this.busy || !this.modelDraft.trim()} @click=${this.saveConnection}>
              <ha-icon icon="mdi:connection" slot="start"></ha-icon>
              Verify and save
            </ha-button>
          </div>
        </ha-card>

        <ha-card class="settings-section preferences">
          <div class="settings-section-title">
            <ha-icon icon="mdi:target"></ha-icon>
            <div>
              <h3>Advisor focus</h3>
              <p>Select everything you want HAOS AI to prioritize.</p>
            </div>
          </div>
          <div class="goal-grid">
            ${this.overview.goal_presets.map(
              (goal) => html`
                <label class="choice-card">
                  <input
                    type="checkbox"
                    .checked=${this.selectedGoals.includes(goal.id)}
                    @change=${() => this.toggleGoal(goal.id)}
                  />
                  <span class="choice-control">
                    <ha-icon
                      icon=${this.selectedGoals.includes(goal.id)
                        ? "mdi:checkbox-marked"
                        : "mdi:checkbox-blank-outline"}
                    ></ha-icon>
                    ${goal.label}
                  </span>
                </label>
              `,
            )}
          </div>
          ${importedGoals.length
            ? html`
                <div class="imported-goals">
                  <span>Imported preferences</span>
                  ${importedGoals.map(
                    (goal) => html`
                      <button @click=${() => this.toggleGoal(goal)}>
                        ${goal}<ha-icon icon="mdi:close"></ha-icon>
                      </button>
                    `,
                  )}
                </div>
              `
            : nothing}

          <div class="settings-subsection">
            <h4>How the advisor should think</h4>
            <div class="settings-fields three-column">
              <label>
                <span>Recommendation style</span>
                <select .value=${this.advisorMode} @change=${(event: Event) =>
                  (this.advisorMode = (event.target as HTMLSelectElement).value)}>
                  <option value="conservative">Conservative</option>
                  <option value="balanced">Balanced</option>
                  <option value="ambitious">Ambitious</option>
                  <option value="automation_hell">I WANT AUTOMATION HELL</option>
                </select>
              </label>
              <label>
                <span>Scan depth</span>
                <select .value=${this.scanDepth} @change=${(event: Event) =>
                  (this.scanDepth = (event.target as HTMLSelectElement).value)}>
                  <option value="focused">Focused · up to 4 ideas</option>
                  <option value="standard">Standard · up to 8 ideas</option>
                  <option value="thorough">Thorough · up to 10 ideas</option>
                </select>
              </label>
              <label>
                <span>Automation complexity</span>
                <select .value=${this.automationComplexity} @change=${(event: Event) =>
                  (this.automationComplexity = (event.target as HTMLSelectElement).value)}>
                  <option value="simple">Simple only</option>
                  <option value="normal">Normal</option>
                  <option value="advanced">Advanced allowed</option>
                </select>
              </label>
            </div>
            <div class="toggle-list">
              <label>
                <input type="checkbox" .checked=${this.fixExistingFirst} @change=${(event: Event) =>
                  (this.fixExistingFirst = (event.target as HTMLInputElement).checked)} />
                <span><strong>Fix existing automations first</strong><small>Prefer simplifying or repairing what already exists.</small></span>
              </label>
              <label>
                <input type="checkbox" .checked=${this.avoidNewHardware} @change=${(event: Event) =>
                  (this.avoidNewHardware = (event.target as HTMLInputElement).checked)} />
                <span><strong>Avoid new hardware</strong><small>Only suggest ideas using devices already in Home Assistant.</small></span>
              </label>
            </div>
          </div>

          <div class="settings-subsection">
            <h4>Quiet hours for suggested automations</h4>
            <p class="field-help">The advisor will avoid noisy or disruptive actions during this window.</p>
            <div class="settings-fields two-column compact-fields">
              <label><span>From</span><input type="time" .value=${this.quietStart} @input=${(event: InputEvent) =>
                (this.quietStart = (event.target as HTMLInputElement).value)} /></label>
              <label><span>Until</span><input type="time" .value=${this.quietEnd} @input=${(event: InputEvent) =>
                (this.quietEnd = (event.target as HTMLInputElement).value)} /></label>
            </div>
          </div>

          <div class="settings-subsection entity-exclusions">
            <h4>${this.t("ignore.entities")}</h4>
            <p class="field-help">${this.t("ignore.entities_help")}</p>
            <div class="entity-picker">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input
                .value=${this.ignoredEntityQuery}
                @input=${(event: InputEvent) => {
                  this.ignoredEntityQuery = (event.target as HTMLInputElement).value;
                  this.ignoredEntityError = "";
                  this.entityHighlight = -1;
                }}
                @keydown=${this.handleEntityKeydown}
                @paste=${this.handleEntityPaste}
                placeholder="Search or paste: light.kitchen, sensor.hallway…"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded=${this.matchingEntities.length ? "true" : "false"}
                aria-invalid=${this.ignoredEntityError ? "true" : "false"}
                aria-controls="ignored-entity-results"
                aria-activedescendant=${this.entityHighlight >= 0
                  ? `ignored-entity-option-${this.entityHighlight}`
                  : nothing}
              />
              ${this.matchingEntities.length
                ? html`
                    <div
                      class="entity-results"
                      role="listbox"
                      id="ignored-entity-results"
                    >
                      ${this.matchingEntities.map(
                        (entity, index) => html`
                          <button
                            role="option"
                            id=${`ignored-entity-option-${index}`}
                            aria-selected=${index === this.entityHighlight
                              ? "true"
                              : "false"}
                            class=${index === this.entityHighlight ? "active" : ""}
                            @click=${() => this.addIgnoredEntities([entity.entity_id])}
                          >
                            <span>
                              <strong>${entity.attributes.friendly_name ?? entity.entity_id}</strong>
                              <small>${entity.entity_id}</small>
                            </span>
                            <em>${entity.state}</em>
                          </button>
                        `,
                      )}
                    </div>
                  `
                : nothing}
            </div>
            <p class="field-error" role="alert">${this.ignoredEntityError}</p>
            <div class="entity-chips" aria-label="Ignored entities">
              ${this.ignoredEntities.map((entityId) => {
                const entity = this.hass?.states?.[entityId];
                return html`
                  <span class=${entity ? "" : "unavailable"}>
                    <span>
                      <strong>${entity?.attributes.friendly_name ?? entityId}</strong>
                      ${entity
                        ? html`<small>${entityId}</small>`
                        : html`<small>${this.t("ignore.not_found")}</small>`}
                    </span>
                    <button
                      aria-label=${`${this.t("ignore.stop")} ${entityId}`}
                      @click=${() =>
                        (this.ignoredEntities = this.ignoredEntities.filter(
                          (value) => value !== entityId,
                        ))}
                    ><ha-icon icon="mdi:close"></ha-icon></button>
                  </span>
                `;
              })}
            </div>
          </div>
          ${this.renderIgnoreScopes()}
          ${this.renderBudgetSettings()}
          <div class="settings-action">
            <span>Used by future scans and conversations.</span>
            <ha-button appearance="accent" ?disabled=${this.busy} @click=${this.savePreferences}>
              <ha-icon icon="mdi:content-save-outline" slot="start"></ha-icon>
              Save advisor preferences
            </ha-button>
          </div>
        </ha-card>

        <ha-card class="settings-section approval-settings">
          <div class="settings-section-title">
            <ha-icon icon="mdi:shield-key-outline"></ha-icon>
            <div>
              <h3>Approval-only changes</h3>
              <p>Let HAOS AI prepare changes, then review every one before Home Assistant applies it.</p>
            </div>
          </div>
          <div class="approval-banner">
            <ha-icon icon="mdi:account-check-outline"></ha-icon>
            <span>
              <strong>Approval is always required.</strong>
              Scheduled scans and chat can only prepare requests. They can never approve them.
            </span>
          </div>
          <div class="toggle-list divided-toggles capability-list">
            <label>
              <input type="checkbox" .checked=${this.changePermissions.create_automations} @change=${(event: Event) =>
                (this.changePermissions = { ...this.changePermissions, create_automations: (event.target as HTMLInputElement).checked })} />
              <span><strong>Create validated automations</strong><small>Shows an approval button only after the current YAML passes Home Assistant validation.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.update_automations} @change=${(event: Event) =>
                (this.changePermissions = { ...this.changePermissions, update_automations: (event.target as HTMLInputElement).checked })} />
              <span><strong>Update existing automations</strong><small>Only exact, existing automation config IDs can be proposed and replaced after review.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.remove_entities} @change=${(event: Event) =>
                (this.changePermissions = { ...this.changePermissions, remove_entities: (event.target as HTMLInputElement).checked })} />
              <span><strong>Remove orphaned entities</strong><small>Only exact registry entries missing from the current state machine can be proposed.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.remove_devices} @change=${(event: Event) =>
                (this.changePermissions = { ...this.changePermissions, remove_devices: (event.target as HTMLInputElement).checked })} />
              <span><strong>Remove stale devices</strong><small>Only when the owning integration supports removal and all registered entities are orphaned.</small></span>
            </label>
          </div>
          <div class="settings-action">
            <span>These permissions expose approval actions; they do not enable autonomy.</span>
            <ha-button appearance="accent" ?disabled=${this.busy} @click=${this.savePreferences}>
              <ha-icon icon="mdi:content-save-outline" slot="start"></ha-icon>
              Save approval permissions
            </ha-button>
          </div>
        </ha-card>

        <ha-card class="settings-section">
          <div class="settings-section-title">
            <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
            <div><h3>Privacy and scheduled scans</h3><p>Control context depth and when HAOS AI runs.</p></div>
          </div>
          <div class="settings-fields three-column">
            <label>
              <span>History window</span>
              <select .value=${String(this.historyDays)} @change=${(event: Event) =>
                (this.historyDays = Number((event.target as HTMLSelectElement).value))}>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </label>
            <label>
              <span>Automatic scans</span>
              <select .value=${this.schedule} @change=${(event: Event) =>
                (this.schedule = (event.target as HTMLSelectElement).value)}>
                <option value="manual">Manual only</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label class=${this.schedule === "manual" ? "disabled-field" : ""}>
              <span>Scan time</span>
              <input type="time" .value=${this.scheduleTime} ?disabled=${this.schedule === "manual"} @input=${(event: InputEvent) =>
                (this.scheduleTime = (event.target as HTMLInputElement).value)} />
            </label>
            ${this.schedule === "weekly"
              ? html`<label>
                  <span>Scan day</span>
                  <select .value=${String(this.scheduleWeekday)} @change=${(event: Event) =>
                    (this.scheduleWeekday = Number((event.target as HTMLSelectElement).value))}>
                    ${WEEKDAY_KEYS.map(
                      (day, index) =>
                        html`<option value=${index}>${this.t(day)}</option>`,
                    )}
                  </select>
                </label>`
              : nothing}
          </div>
          <div class="toggle-list divided-toggles">
            <label>
              <input type="checkbox" .checked=${this.notifyNewSuggestions} ?disabled=${this.schedule === "manual"} @change=${(event: Event) =>
                (this.notifyNewSuggestions = (event.target as HTMLInputElement).checked)} />
              <span><strong>Notify about new scheduled suggestions</strong><small>Manual scans never create this notification.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.includeExactLocation} @change=${(event: Event) =>
                (this.includeExactLocation = (event.target as HTMLInputElement).checked)} />
              <span><strong>Allow exact location context</strong><small>Off by default. Coordinates remain redacted when disabled.</small></span>
            </label>
          </div>
          <div class="settings-action">
            <ha-button appearance="outlined" @click=${this.openPreview}>
              <ha-icon icon="mdi:eye-outline" slot="start"></ha-icon>
              Preview context
            </ha-button>
            <ha-button appearance="accent" ?disabled=${this.busy} @click=${this.saveOptions}>
              <ha-icon icon="mdi:content-save-outline" slot="start"></ha-icon>
              Save privacy and schedule
            </ha-button>
          </div>
        </ha-card>

        <ha-card class="settings-section about-section">
          <div class="settings-section-title">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <div><h3>About and updates</h3><p>HAOS AI ${this.overview.version} · Assist agent ready.</p></div>
          </div>
          <div class="about-actions">
            <a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=Bronxk&repository=haos-ai&category=integration" target="_blank" rel="noreferrer">
              <ha-icon icon="mdi:update"></ha-icon><span>Open in HACS</span>
            </a>
            <a href="https://github.com/Bronxk/haos-ai/releases" target="_blank" rel="noreferrer">
              <ha-icon icon="mdi:text-box-outline"></ha-icon><span>Release notes</span>
            </a>
            <a href="https://github.com/Bronxk/haos-ai/issues" target="_blank" rel="noreferrer">
              <ha-icon icon="mdi:bug-outline"></ha-icon><span>Report a problem</span>
            </a>
          </div>
        </ha-card>
      </section>
    `;
  }

  private renderScanProfile() {
    const options = this.overview?.provider_options ?? [];
    const selected = options.find((item) => item.id === this.scanProviderDraft);
    return html`
      <div class="settings-subsection scan-profile">
        <h4>${this.t("scan_profile.title")}</h4>
        <p class="field-help">${this.t("scan_profile.description")}</p>
        <div class="toggle-list">
          <label>
            <input
              type="checkbox"
              .checked=${this.scanProfileEnabled}
              @change=${(event: Event) => {
                this.scanProfileEnabled = (
                  event.target as HTMLInputElement
                ).checked;
                this.settingsNotice = "";
              }}
            />
            <span>
              <strong>${this.t("scan_profile.enable")}</strong>
              <small>${this.t("scan_profile.enable_help")}</small>
            </span>
          </label>
        </div>
        ${this.scanProfileEnabled
          ? html`
              <div class="settings-fields two-column">
                <label>
                  <span>${this.t("scan_profile.provider")}</span>
                  <select
                    .value=${this.scanProviderDraft}
                    @change=${(event: Event) => {
                      const value = (event.target as HTMLSelectElement).value;
                      const next = options.find((item) => item.id === value);
                      this.scanProviderDraft = value;
                      if (next) {
                        if (!this.scanModelDraft) {
                          this.scanModelDraft = next.default_model;
                        }
                        if (!this.scanBaseUrlDraft) {
                          this.scanBaseUrlDraft = next.default_base_url;
                        }
                      }
                      this.scanApiKeyDraft = "";
                      this.settingsNotice = "";
                    }}
                  >
                    ${options.map(
                      (provider) => html`
                        <option
                          value=${provider.id}
                          ?selected=${provider.id === this.scanProviderDraft}
                        >${provider.label}</option>
                      `,
                    )}
                  </select>
                </label>
                <label>
                  <span>${this.t("scan_profile.model")}</span>
                  <input
                    .value=${this.scanModelDraft}
                    @input=${(event: InputEvent) =>
                      (this.scanModelDraft = (
                        event.target as HTMLInputElement
                      ).value)}
                    placeholder=${selected?.default_model || "Model identifier"}
                    autocomplete="off"
                  />
                </label>
                <label>
                  <span>${this.t("scan_profile.api_key")}</span>
                  <input
                    type="password"
                    .value=${this.scanApiKeyDraft}
                    @input=${(event: InputEvent) =>
                      (this.scanApiKeyDraft = (
                        event.target as HTMLInputElement
                      ).value)}
                    placeholder="Stored key remains unchanged"
                    autocomplete="new-password"
                  />
                </label>
                <label>
                  <span>${this.t("scan_profile.base_url")}</span>
                  <input
                    type="url"
                    .value=${this.scanBaseUrlDraft}
                    @input=${(event: InputEvent) =>
                      (this.scanBaseUrlDraft = (
                        event.target as HTMLInputElement
                      ).value)}
                    placeholder=${selected?.default_base_url || "https://…"}
                    autocomplete="url"
                  />
                </label>
              </div>
              <p class="field-help">
                ${this.overview?.scan_profile?.active
                  ? this.t("scan_profile.active")
                  : this.t("scan_profile.inactive")}
              </p>
            `
          : nothing}
      </div>
    `;
  }

  private renderScopePicker(
    scope: "domains" | "areas" | "labels",
    titleKey: string,
    helpKey: string,
    query: string,
    onQuery: (value: string) => void,
    suggestions: Array<{ id: string; label: string }>,
    selected: Array<{ id: string; label: string }>,
  ) {
    const filtered = query
      ? suggestions
          .filter((item) =>
            `${item.id} ${item.label}`
              .toLocaleLowerCase()
              .includes(query.trim().toLocaleLowerCase()),
          )
          .slice(0, 8)
      : [];
    return html`
      <div class="settings-subsection entity-exclusions">
        <h4>${this.t(titleKey)}</h4>
        <p class="field-help">${this.t(helpKey)}</p>
        <div class="entity-picker">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            .value=${query}
            @input=${(event: InputEvent) =>
              onQuery((event.target as HTMLInputElement).value)}
            @keydown=${(event: KeyboardEvent) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              this.addIgnoredScope(scope, filtered[0]?.id ?? query);
            }}
            placeholder=${this.t(titleKey)}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded=${filtered.length ? "true" : "false"}
          />
          ${filtered.length
            ? html`
                <div class="entity-results" role="listbox">
                  ${filtered.map(
                    (item) => html`
                      <button
                        role="option"
                        @click=${() => this.addIgnoredScope(scope, item.id)}
                      >
                        <span>
                          <strong>${item.label}</strong>
                          ${item.label === item.id
                            ? nothing
                            : html`<small>${item.id}</small>`}
                        </span>
                      </button>
                    `,
                  )}
                </div>
              `
            : nothing}
        </div>
        <div class="entity-chips" aria-label=${this.t(titleKey)}>
          ${selected.map(
            (item) => html`
              <span>
                <span><strong>${item.label}</strong></span>
                <button
                  aria-label=${`${this.t("ignore.stop")} ${item.label}`}
                  @click=${() => this.removeIgnoredScope(scope, item.id)}
                ><ha-icon icon="mdi:close"></ha-icon></button>
              </span>
            `,
          )}
        </div>
      </div>
    `;
  }

  private renderIgnoreScopes() {
    return html`
      ${this.renderScopePicker(
        "domains",
        "ignore.domains",
        "ignore.domains_help",
        this.ignoredDomainQuery,
        (value) => (this.ignoredDomainQuery = value),
        this.availableDomains.map((domain) => ({ id: domain, label: domain })),
        this.ignoredDomains.map((domain) => ({ id: domain, label: domain })),
      )}
      ${this.renderScopePicker(
        "areas",
        "ignore.areas",
        "ignore.areas_help",
        this.ignoredAreaQuery,
        (value) => (this.ignoredAreaQuery = value),
        this.availableAreas.map((area) => ({
          id: area.area_id,
          label: area.name,
        })),
        this.ignoredAreas.map((areaId) => ({
          id: areaId,
          label: this.areaName(areaId),
        })),
      )}
      ${this.renderScopePicker(
        "labels",
        "ignore.labels",
        "ignore.labels_help",
        this.ignoredLabelQuery,
        (value) => (this.ignoredLabelQuery = value),
        this.availableLabels.map((label) => ({ id: label, label })),
        this.ignoredLabels.map((label) => ({ id: label, label })),
      )}
      <p class="field-help enforced-note">
        <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
        ${this.t("ignore.enforced")}
      </p>
    `;
  }

  private renderBudgetSettings() {
    const budget = this.budget;
    return html`
      <div class="settings-subsection">
        <h4>${this.t("budget.title")}</h4>
        <p class="field-help">${this.t("budget.description")}</p>
        <div class="settings-fields two-column compact-fields">
          <label>
            <span>${this.t("budget.field")}</span>
            <input
              type="number"
              min="0"
              step="1000"
              .value=${String(this.monthlyTokenBudget)}
              @input=${(event: InputEvent) => {
                this.monthlyTokenBudget = Math.max(
                  0,
                  Number((event.target as HTMLInputElement).value) || 0,
                );
                this.settingsNotice = "";
              }}
            />
            <small>${this.t("budget.unlimited")}</small>
          </label>
          ${budget
            ? html`<label class="readonly-field">
                <span>${this.t("budget.used")}</span>
                <output>${budget.total_tokens.toLocaleString()}</output>
                <small>
                  ${budget.budget
                    ? `${this.t("budget.remaining")}: ${(
                        budget.remaining ?? 0
                      ).toLocaleString()}`
                    : this.t("budget.no_cap")}
                </small>
              </label>`
            : nothing}
        </div>
      </div>
    `;
  }

  private renderPreviewDialog() {
    const payload = this.preview!.payload;
    const categories = Object.keys(payload).filter((key) => payload[key] !== null);
    return html`
      <ha-adaptive-dialog
        open
        allow-mode-change
        header-title="Review context before sending"
        header-subtitle="Privacy preflight"
        @closed=${() => (this.preview = undefined)}
      >
        <div class="dialog-content">
          <p>
            This baseline will go to <strong>${this.preview!.provider}</strong>.
            The model can request additional bounded, read-only details during the scan.
          </p>
          <div class="category-list">
            ${categories.map(
              (category) => html`
                <div><ha-icon icon="mdi:check-circle-outline"></ha-icon>${category.replaceAll("_", " ")}</div>
              `,
            )}
          </div>
          <details>
            <summary>Inspect sanitized baseline</summary>
            <pre><code>${JSON.stringify(payload, null, 2)}</code></pre>
          </details>
          <div class="privacy-note">
            <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
            <span>
              <strong>${this.preview!.redactions.length}</strong> sensitive or bounded
              fields redacted. Camera media and secrets are never sent.
            </span>
          </div>
        </div>
        <div slot="footer">
          <ha-button appearance="plain" @click=${() => (this.preview = undefined)}>Cancel</ha-button>
          <ha-button appearance="accent" ?disabled=${this.busy} @click=${this.runScan}>
            Confirm and scan
          </ha-button>
        </div>
      </ha-adaptive-dialog>
    `;
  }

  private renderActionDialog() {
    if (this.dialog === "feedback") {
      return html`
        <ha-adaptive-dialog
          open
          allow-mode-change
          header-title="Why are you dismissing this?"
          header-subtitle="This helps future scans"
          @closed=${() => (this.dialog = null)}
        >
          <div class="dialog-content feedback-options">
            ${FEEDBACK_REASONS.map(
              (reason) => html`
                <button
                  class=${this.feedbackReason === reason ? "selected" : ""}
                  @click=${() => (this.feedbackReason = reason)}
                >
                  <ha-icon
                    icon=${this.feedbackReason === reason
                      ? "mdi:radiobox-marked"
                      : "mdi:radiobox-blank"}
                  ></ha-icon>
                  ${reason}
                </button>
              `,
            )}
            <label>
              Optional note
              <textarea
                .value=${this.feedbackNote}
                @input=${(event: InputEvent) =>
                  (this.feedbackNote = (event.target as HTMLTextAreaElement).value)}
              ></textarea>
            </label>
          </div>
          <div slot="footer">
            <ha-button appearance="plain" @click=${() => (this.dialog = null)}>Cancel</ha-button>
            <ha-button
              variant="danger"
              appearance="filled"
              ?disabled=${!this.feedbackReason}
              @click=${this.submitFeedback}
            >Dismiss suggestion</ha-button>
          </div>
        </ha-adaptive-dialog>
      `;
    }
    if (this.dialog === "rename") {
      return html`
        <ha-adaptive-dialog
          open
          allow-mode-change
          header-title="Rename conversation"
          @closed=${() => (this.dialog = null)}
        >
          <div class="dialog-content">
            <label>
              Conversation name
              <input
                autofocus
                .value=${this.renameText}
                @input=${(event: InputEvent) =>
                  (this.renameText = (event.target as HTMLInputElement).value)}
              />
            </label>
          </div>
          <div slot="footer">
            <ha-button appearance="plain" @click=${() => (this.dialog = null)}>Cancel</ha-button>
            <ha-button appearance="accent" ?disabled=${!this.renameText.trim()} @click=${this.renameThread}>
              Rename
            </ha-button>
          </div>
        </ha-adaptive-dialog>
      `;
    }
    if (this.dialog === "clear-inbox") {
      const count = this.filteredSuggestions.length;
      return html`
        <ha-adaptive-dialog
          open
          type="alert"
          header-title=${this.filter === "all"
            ? "Clear the entire inbox?"
            : `Clear ${this.filter} suggestions?`}
          header-subtitle="Local suggestions only"
          @closed=${() => (this.dialog = null)}
        >
          <div class="dialog-content">
            <p>
              This permanently removes ${count} ${count === 1 ? "suggestion" : "suggestions"}
              from Home Assistant. It does not change devices or automations.
            </p>
          </div>
          <div slot="footer">
            <ha-button appearance="plain" @click=${() => (this.dialog = null)}>Cancel</ha-button>
            <ha-button variant="danger" appearance="filled" @click=${this.clearInbox}>
              Clear ${count}
            </ha-button>
          </div>
        </ha-adaptive-dialog>
      `;
    }
    if (this.dialog === "approve-change" && this.pendingChange) {
      const change = this.pendingChange;
      const destructive = !["create_automation", "update_automation"].includes(
        change.kind,
      );
      return html`
        <ha-adaptive-dialog
          open
          type=${destructive ? "alert" : nothing}
          header-title=${destructive
            ? "Approve removal?"
            : change.kind === "update_automation"
              ? "Approve automation update?"
              : "Approve automation creation?"}
          header-subtitle="Manual approval · one change"
          @closed=${() => {
            this.dialog = null;
            this.pendingChange = undefined;
            this.diffLines = undefined;
            this.diffError = "";
          }}
        >
          <div class="dialog-content approval-review">
            <div class="approval-banner">
              <ha-icon icon="mdi:shield-check-outline"></ha-icon>
              <span>
                <strong>HAOS AI cannot approve this.</strong>
                Home Assistant applies it only after you press the button below.
              </span>
            </div>
            <dl>
              <div><dt>Action</dt><dd>${change.kind.replaceAll("_", " ")}</dd></div>
              <div><dt>Target</dt><dd>${change.label}</dd></div>
              <div><dt>Identifier</dt><dd><code>${change.targetId}</code></dd></div>
            </dl>
            ${change.kind === "update_automation" ? this.renderDiff() : nothing}
            ${change.kind === "create_automation" ||
            change.kind === "update_automation"
              ? html`
                  <details>
                    <summary>Inspect validated YAML</summary>
                    <pre><code>${this.draftYaml}</code></pre>
                  </details>
                `
              : html`<p class="danger-copy">Removal may be irreversible. A future scan cannot restore registry data.</p>`}
          </div>
          <div slot="footer">
            <ha-button appearance="plain" @click=${() => {
              this.dialog = null;
              this.pendingChange = undefined;
              this.diffLines = undefined;
              this.diffError = "";
            }}>${this.t("action.cancel")}</ha-button>
            <ha-button
              variant=${destructive ? "danger" : nothing}
              appearance=${destructive ? "filled" : "accent"}
              ?disabled=${this.busy ||
              (change.kind === "update_automation" &&
                (this.diffLoading || !!this.diffError))}
              @click=${this.approveChange}
            >${destructive
              ? "Approve & remove"
              : change.kind === "update_automation"
                ? "Approve & update"
                : "Approve & create"}</ha-button>
          </div>
        </ha-adaptive-dialog>
      `;
    }
    return html`
      <ha-adaptive-dialog
        open
        type="alert"
        header-title="Delete this conversation?"
        header-subtitle="Messages are stored only in Home Assistant"
        @closed=${() => (this.dialog = null)}
      >
        <div class="dialog-content">
          <p>This removes the local thread immediately. It cannot be recovered.</p>
        </div>
        <div slot="footer">
          <ha-button appearance="plain" @click=${() => (this.dialog = null)}>Cancel</ha-button>
          <ha-button variant="danger" appearance="filled" @click=${this.deleteThread}>Delete</ha-button>
        </div>
      </ha-adaptive-dialog>
    `;
  }

  private renderDiff() {
    if (this.diffLoading) {
      return html`<p class="muted">${this.t("diff.loading")}</p>`;
    }
    if (this.diffError) {
      return html`<p class="danger-copy">${this.diffError}</p>`;
    }
    if (!this.diffLines) return nothing;
    const changed = this.diffLines.some((line) => line.type !== "same");
    if (!changed) {
      return html`<p class="muted">${this.t("diff.identical")}</p>`;
    }
    return html`
      <section class="diff-section">
        <h3>${this.t("diff.title")}</h3>
        <div class="diff-legend">
          <span class="removed">${this.t("diff.current")}</span>
          <span class="added">${this.t("diff.proposed")}</span>
        </div>
        <pre class="diff"><code>${this.diffLines.map(
          (line) => html`<span class="diff-line ${line.type}"
            >${line.type === "added"
              ? "+"
              : line.type === "removed"
                ? "-"
                : " "} ${line.text}
</span>`,
        )}</code></pre>
      </section>
    `;
  }

  private relativeDate(value: string): string {
    const timestamp = new Date(value).getTime();
    const minutes = Math.round((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(value).toLocaleDateString();
  }

  private formatUsage(usage?: Record<string, number>): string {
    const input = usage?.input_tokens ?? 0;
    const output = usage?.output_tokens ?? 0;
    const total = input + output;
    return total ? `${total.toLocaleString()} tokens` : "Usage unavailable";
  }

  static styles = css`
    /* Hallmark · genre: native-admin · macrostructure: Workbench split view
     * tone: utilitarian · design authority: Home Assistant 2026.7
     * logo: code-native house + advisor spark · enrichment: none
     * pre-emit critique: P5 H5 E5 S5 R5 V4 · contrast: pass (46–50)
     * slop: pass (51–60) · mobile: pass (36, 59, 61–69)
     */
    :host {
      --haos-surface: var(
        --card-background-color,
        var(--ha-color-surface-default, #ffffff)
      );
      --haos-surface-low: var(
        --primary-background-color,
        var(--ha-color-surface-low, #f5f5f5)
      );
      --haos-surface-lower: var(
        --secondary-background-color,
        var(--ha-color-surface-lower, #eeeeee)
      );
      --haos-text: var(--primary-text-color, #212121);
      --haos-muted: var(--secondary-text-color, #727272);
      --haos-divider: var(--divider-color, #e0e0e0);
      --haos-primary: var(--primary-color, #03a9f4);
      --haos-on-primary: var(--text-primary-color, #ffffff);
      --haos-success: var(--success-color, #2e7d32);
      --haos-warning: var(--warning-color, #ed6c02);
      --haos-error: var(--error-color, #d32f2f);
      --haos-code-surface: #171c20;
      --haos-code-text: #eef2f5;
      --haos-selected: color-mix(
        in srgb,
        var(--haos-primary) 10%,
        var(--haos-surface)
      );
      --haos-success-soft: color-mix(
        in srgb,
        var(--haos-success) 12%,
        var(--haos-surface)
      );
      --haos-warning-soft: color-mix(
        in srgb,
        var(--haos-warning) 12%,
        var(--haos-surface)
      );
      --haos-error-soft: color-mix(
        in srgb,
        var(--haos-error) 10%,
        var(--haos-surface)
      );
      display: block;
      height: 100%;
      overflow-x: clip;
      color: var(--haos-text);
      background: var(--haos-surface-low);
      font-family: var(
        --ha-font-family-body,
        var(--paper-font-body1_-_font-family, Roboto, sans-serif)
      );
    }

    * {
      box-sizing: border-box;
    }

    button,
    input,
    textarea,
    select {
      font: inherit;
    }

    button {
      color: inherit;
    }

    h1,
    h2,
    h3,
    p {
      margin: 0;
    }

    h1,
    h2,
    h3 {
      min-width: 0;
      overflow-wrap: anywhere;
      color: var(--haos-text);
      line-height: var(--ha-line-height-condensed, 1.25);
    }

    h1 {
      font-size: var(--ha-font-size-xl, 20px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    h2 {
      font-size: var(--ha-font-size-2xl, 24px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    h3 {
      font-size: var(--ha-font-size-l, 16px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    ha-icon {
      flex: 0 0 auto;
    }

    ha-button,
    ha-icon-button,
    button,
    summary {
      -webkit-tap-highlight-color: transparent;
    }

    ha-button {
      white-space: nowrap;
    }

    button:active,
    summary:active {
      background: var(--haos-selected);
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    input:disabled,
    select:disabled {
      cursor: not-allowed;
      opacity: 0.55;
      background: var(--haos-surface-lower);
    }

    input:hover:not(:disabled),
    textarea:hover:not(:disabled),
    select:hover:not(:disabled) {
      border-color: var(--haos-muted);
    }

    input:active:not(:disabled),
    textarea:active:not(:disabled),
    select:active:not(:disabled) {
      background: var(--haos-selected);
    }

    input[aria-invalid="true"],
    textarea[aria-invalid="true"],
    select[aria-invalid="true"] {
      border-color: var(--haos-error);
    }

    button:focus-visible,
    input:focus-visible,
    textarea:focus-visible,
    select:focus-visible,
    summary:focus-visible {
      outline: 2px solid var(--haos-primary);
      outline-offset: 2px;
    }

    textarea,
    input,
    select {
      width: 100%;
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-lg, 10px);
      outline: 2px solid transparent;
      color: var(--haos-text);
      background: var(--haos-surface-low);
    }

    textarea:hover,
    input:hover {
      background: var(--haos-surface-lower);
    }

    .shell {
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      min-height: var(--ha-top-app-bar-height, 64px);
      padding: 0 var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: minmax(150px, auto) minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--ha-space-6, 24px);
      background: var(--app-header-background-color, var(--haos-surface));
      color: var(--app-header-text-color, var(--haos-text));
      border-bottom: 1px solid var(--haos-divider);
      z-index: 4;
    }

    .title-lockup {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: var(--ha-space-3, 12px);
    }

    .logo {
      width: 36px;
      height: 36px;
      display: inline-grid;
      place-items: center;
      flex: 0 0 36px;
      color: var(--haos-primary);
    }

    .logo svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .logo-house,
    .logo-link {
      fill: none;
      stroke: currentColor;
      stroke-width: 1.55;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .logo-spark,
    .logo circle {
      fill: currentColor;
    }

    .tabs {
      min-width: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: var(--ha-space-1, 4px);
    }

    .tabs button {
      position: relative;
      min-width: 72px;
      padding: 0 var(--ha-space-3, 12px);
      border: 0;
      background: transparent;
      color: var(--haos-muted);
      cursor: pointer;
      white-space: nowrap;
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    .tabs button:hover {
      background: var(--haos-surface-lower);
    }

    .tabs button.active {
      color: var(--haos-primary);
    }

    .tabs button.active::after {
      content: "";
      position: absolute;
      inset-inline: var(--ha-space-3, 12px);
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--haos-primary);
    }

    .count {
      min-width: 18px;
      height: 18px;
      margin-inline-start: var(--ha-space-1, 4px);
      padding: 0 var(--ha-space-1, 4px);
      display: inline-grid;
      place-items: center;
      border-radius: var(--ha-border-radius-pill, 999px);
      background: var(--haos-selected);
      font-size: var(--ha-font-size-xs, 11px);
      font-variant-numeric: tabular-nums;
    }

    main {
      flex: 1;
      min-height: 0;
    }

    .progress-panel {
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: minmax(190px, 320px) minmax(0, 1fr);
      align-items: center;
      gap: var(--ha-space-4, 16px);
      border-bottom: 1px solid var(--haos-divider);
      background: var(--haos-surface);
    }

    .progress-copy {
      display: grid;
      gap: 2px;
      font-size: var(--ha-font-size-s, 13px);
    }

    .progress-copy span {
      color: var(--haos-muted);
      text-transform: capitalize;
    }

    .progress-track {
      height: 4px;
      overflow: hidden;
      border-radius: var(--ha-border-radius-pill, 999px);
      background: var(--haos-surface-lower);
    }

    .progress-track span {
      width: var(--progress);
      height: 100%;
      display: block;
      border-radius: inherit;
      background: var(--haos-primary);
      transition: width 180ms cubic-bezier(0.2, 0, 0, 1);
    }

    .alert {
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      color: var(--haos-error);
      background: var(--haos-error-soft);
      border-bottom: 1px solid var(--haos-divider);
      font-size: var(--ha-font-size-m, 14px);
    }

    .inbox-layout,
    .activity-layout {
      height: calc(100dvh - var(--ha-top-app-bar-height, 64px));
      min-height: 520px;
      display: grid;
      grid-template-columns: minmax(320px, 400px) minmax(0, 1fr);
    }

    .list-pane,
    .thread-pane {
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      background: var(--haos-surface);
      border-inline-end: 1px solid var(--haos-divider);
    }

    .pane-heading {
      min-height: 80px;
      padding: var(--ha-space-4, 16px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      border-bottom: 1px solid var(--haos-divider);
    }

    .pane-heading h2 {
      font-size: var(--ha-font-size-xl, 20px);
    }

    .pane-heading p,
    .settings-heading p,
    .conversation-header p {
      margin-top: var(--ha-space-1, 4px);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      line-height: var(--ha-line-height-normal, 1.5);
    }

    .total {
      color: var(--haos-muted);
      font-variant-numeric: tabular-nums;
    }

    .inbox-heading-actions {
      display: flex;
      align-items: center;
      gap: var(--ha-space-1, 4px);
    }

    .filters {
      padding: var(--ha-space-2, 8px);
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: var(--ha-space-1, 4px);
      border-bottom: 1px solid var(--haos-divider);
    }

    .filters button {
      min-width: 0;
      min-height: 36px;
      padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: var(--ha-space-1, 4px);
      border: 0;
      border-radius: var(--ha-border-radius-lg, 10px);
      background: transparent;
      color: var(--haos-muted);
      cursor: pointer;
      text-transform: capitalize;
      white-space: nowrap;
      font-size: var(--ha-font-size-s, 13px);
    }

    .filters button:hover {
      background: var(--haos-surface-low);
    }

    .filters button.active {
      color: var(--haos-primary);
      background: var(--haos-selected);
    }

    .filters button span {
      font-variant-numeric: tabular-nums;
    }

    .suggestion-list,
    .activity-list {
      overflow: auto;
    }

    .suggestion-row,
    .receipt-row {
      width: 100%;
      padding: var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: start;
      gap: var(--ha-space-3, 12px);
      border: 0;
      border-bottom: 1px solid var(--haos-divider);
      text-align: start;
      background: var(--haos-surface);
      cursor: pointer;
    }

    .suggestion-row > ha-icon,
    .receipt-row > ha-icon:first-child {
      width: 24px;
      height: 24px;
      color: var(--haos-muted);
    }

    .suggestion-row:hover,
    .receipt-row:hover {
      background: var(--haos-surface-low);
    }

    .suggestion-row.selected,
    .receipt-row.selected {
      background: var(--haos-selected);
    }

    .suggestion-row.selected > ha-icon,
    .receipt-row.selected > ha-icon:first-child {
      color: var(--haos-primary);
    }

    .row-content,
    .receipt-row > span {
      min-width: 0;
      display: grid;
      gap: var(--ha-space-1, 4px);
    }

    .row-content strong,
    .receipt-row strong {
      line-height: var(--ha-line-height-condensed, 1.3);
      overflow-wrap: anywhere;
    }

    .summary {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      line-height: var(--ha-line-height-normal, 1.5);
    }

    .meta,
    .receipt-row small {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-xs, 11px);
      line-height: var(--ha-line-height-normal, 1.4);
      font-variant-numeric: tabular-nums;
    }

    .confidence {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-xs, 11px);
      font-variant-numeric: tabular-nums;
    }

    .detail-pane,
    .conversation-pane {
      min-width: 0;
      min-height: 0;
      overflow: auto;
      background: var(--haos-surface-low);
    }

    .detail-content {
      width: min(900px, calc(100% - var(--ha-space-12, 48px)));
      margin: 0 auto;
      padding: var(--ha-space-8, 32px) 0 var(--ha-space-16, 64px);
    }

    .mobile-back {
      display: none;
      margin-bottom: var(--ha-space-2, 8px);
    }

    .detail-heading {
      padding-bottom: var(--ha-space-6, 24px);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--ha-space-6, 24px);
    }

    .detail-title {
      min-width: 0;
      display: flex;
      align-items: flex-start;
      gap: var(--ha-space-4, 16px);
    }

    .detail-title p {
      max-width: 65ch;
      margin-top: var(--ha-space-2, 8px);
      color: var(--haos-muted);
      line-height: var(--ha-line-height-normal, 1.55);
    }

    .detail-icon {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      flex: 0 0 44px;
      border-radius: var(--ha-border-radius-xl, 12px);
      background: var(--haos-surface);
      color: var(--haos-muted);
      border: 1px solid var(--haos-divider);
    }

    .detail-icon.automation,
    .detail-icon.activity {
      color: var(--haos-primary);
      background: var(--haos-selected);
    }

    .status-badge,
    .read-only-badge,
    .saved-label {
      min-height: 28px;
      padding: 0 var(--ha-space-2, 8px);
      display: inline-flex;
      align-items: center;
      gap: var(--ha-space-1, 4px);
      border-radius: var(--ha-border-radius-pill, 999px);
      color: var(--haos-muted);
      background: var(--haos-surface-lower);
      white-space: nowrap;
      font-size: var(--ha-font-size-s, 13px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    .status-badge.high {
      color: var(--haos-warning);
      background: var(--haos-warning-soft);
    }

    .status-badge.valid,
    .saved-label,
    .read-only-badge {
      color: var(--haos-success);
      background: var(--haos-success-soft);
    }

    .status-badge.invalid {
      color: var(--haos-error);
      background: var(--haos-error-soft);
    }

    .detail-section {
      padding: var(--ha-space-6, 24px) 0;
      border-top: 1px solid var(--haos-divider);
    }

    .detail-section > p,
    .section-heading p {
      max-width: 72ch;
      margin-top: var(--ha-space-2, 8px);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-m, 14px);
      line-height: var(--ha-line-height-normal, 1.55);
    }

    .evidence-list {
      margin-top: var(--ha-space-4, 16px);
      border-top: 1px solid var(--haos-divider);
    }

    .evidence-row {
      padding: var(--ha-space-3, 12px) 0;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: start;
      gap: var(--ha-space-3, 12px);
      border-bottom: 1px solid var(--haos-divider);
    }

    .evidence-row > ha-icon {
      margin-top: 2px;
      color: var(--haos-muted);
    }

    .evidence-row strong {
      overflow-wrap: anywhere;
    }

    .evidence-row p,
    .evidence-row small {
      margin-top: var(--ha-space-1, 4px);
      display: block;
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      line-height: var(--ha-line-height-normal, 1.45);
    }

    .evidence-row small.evidence-unverified {
      color: var(--haos-warning, #c77700);
      font-style: italic;
    }

    .section-heading {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--ha-space-4, 16px);
    }

    .inline-error,
    .validation-errors {
      margin-top: var(--ha-space-3, 12px);
      padding: var(--ha-space-3, 12px);
      color: var(--haos-error);
      background: var(--haos-error-soft);
      border-radius: var(--ha-border-radius-lg, 10px);
      font-size: var(--ha-font-size-s, 13px);
    }

    .validation-errors p + p {
      margin-top: var(--ha-space-1, 4px);
    }

    .yaml-editor {
      min-height: 360px;
      margin-top: var(--ha-space-4, 16px);
      padding: var(--ha-space-4, 16px);
      resize: vertical;
      border-color: transparent;
      border-radius: var(--ha-border-radius-lg, 10px);
      color: var(--haos-code-text);
      background: var(--haos-code-surface);
      font-family: var(--ha-font-family-code, ui-monospace, monospace);
      font-size: var(--ha-font-size-s, 13px);
      line-height: 1.55;
      tab-size: 2;
      white-space: pre;
    }

    .yaml-editor:hover {
      background: var(--haos-code-surface);
    }

    .yaml-actions,
    .decision-actions,
    .conversation-actions {
      margin-top: var(--ha-space-3, 12px);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      flex-wrap: wrap;
    }

    .decision-bar {
      position: sticky;
      bottom: 0;
      margin-top: var(--ha-space-4, 16px);
      padding: var(--ha-space-3, 12px) 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ha-space-4, 16px);
      border-top: 1px solid var(--haos-divider);
      background: var(--haos-surface-low);
    }

    .decision-bar > span {
      display: inline-flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
    }

    .decision-actions {
      margin: 0;
    }

    .empty,
    .loading-state {
      height: 100%;
      min-height: 280px;
      padding: var(--ha-space-8, 32px);
      display: grid;
      place-content: center;
      justify-items: center;
      text-align: center;
      color: var(--haos-muted);
    }

    .empty > ha-icon,
    .chat-empty > ha-icon {
      width: 36px;
      height: 36px;
      margin-bottom: var(--ha-space-3, 12px);
      color: var(--haos-muted);
    }

    .empty .logo,
    .loading-state .logo {
      width: 54px;
      height: 54px;
      margin-bottom: var(--ha-space-3, 12px);
      opacity: 0.7;
    }

    .empty p,
    .loading-state p {
      max-width: 460px;
      margin-top: var(--ha-space-2, 8px);
      font-size: var(--ha-font-size-m, 14px);
      line-height: var(--ha-line-height-normal, 1.55);
    }

    .empty.compact {
      min-height: 240px;
      height: auto;
    }

    .chat-layout {
      height: calc(100dvh - var(--ha-top-app-bar-height, 64px));
      min-height: 520px;
      display: grid;
      grid-template-columns: minmax(240px, 300px) minmax(0, 1fr);
    }

    .thread-heading {
      min-height: 72px;
    }

    .thread-list {
      overflow: auto;
    }

    .thread-list button {
      width: 100%;
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: var(--ha-space-3, 12px);
      border: 0;
      background: transparent;
      text-align: start;
      cursor: pointer;
    }

    .thread-list button:hover {
      background: var(--haos-surface-low);
    }

    .thread-list button.selected {
      color: var(--haos-primary);
      background: var(--haos-selected);
    }

    .thread-list button span {
      min-width: 0;
      display: grid;
      gap: 2px;
    }

    .thread-list button strong {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .thread-list button small,
    .thread-empty {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-xs, 11px);
    }

    .thread-empty {
      padding: var(--ha-space-4, 16px);
    }

    .conversation-pane {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      overflow: hidden;
    }

    .conversation-header {
      min-height: 72px;
      padding: var(--ha-space-3, 12px) var(--ha-space-5, 20px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ha-space-4, 16px);
      border-bottom: 1px solid var(--haos-divider);
      background: var(--haos-surface);
    }

    .conversation-header h2 {
      font-size: var(--ha-font-size-l, 16px);
    }

    .conversation-actions {
      margin: 0;
      flex-wrap: nowrap;
    }

    .messages {
      padding: var(--ha-space-6, 24px);
      overflow: auto;
    }

    .message {
      width: min(760px, 92%);
      margin-bottom: var(--ha-space-5, 20px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: var(--ha-space-3, 12px);
    }

    .message.user {
      margin-inline-start: auto;
    }

    .message-avatar,
    .message-avatar .logo {
      width: 32px;
      height: 32px;
    }

    .message-avatar {
      display: grid;
      place-items: center;
      color: var(--haos-muted);
    }

    .message strong {
      font-size: var(--ha-font-size-s, 13px);
    }

    .message p {
      margin-top: var(--ha-space-1, 4px);
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      border-radius: var(--ha-border-radius-xl, 12px);
      background: var(--haos-surface);
      line-height: var(--ha-line-height-normal, 1.6);
      white-space: pre-wrap;
    }

    .message.user p {
      background: var(--haos-selected);
    }

    .message.pending {
      opacity: 0.7;
    }

    .message-actions {
      margin-top: var(--ha-space-2, 8px);
    }

    .message-hint {
      margin-top: var(--ha-space-1, 4px);
      display: block;
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
    }

    .composer {
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
      gap: var(--ha-space-3, 12px);
      border-top: 1px solid var(--haos-divider);
      background: var(--haos-surface);
    }

    .composer textarea {
      min-height: 48px;
      max-height: 180px;
      padding: var(--ha-space-3, 12px);
      resize: vertical;
      line-height: var(--ha-line-height-normal, 1.45);
    }

    .activity-list {
      display: block;
    }

    .receipt-row > ha-icon:last-child {
      color: var(--haos-muted);
    }

    .stats-list,
    .settings-list {
      margin: 0;
      border-top: 1px solid var(--haos-divider);
    }

    .stats-list > div,
    .settings-list > div {
      padding: var(--ha-space-3, 12px) 0;
      display: flex;
      justify-content: space-between;
      gap: var(--ha-space-4, 16px);
      border-bottom: 1px solid var(--haos-divider);
    }

    dt {
      color: var(--haos-muted);
    }

    dd {
      margin: 0;
      text-align: end;
      overflow-wrap: anywhere;
      font-variant-numeric: tabular-nums;
    }

    .compact-stats {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .compact-stats > div:nth-child(odd) {
      padding-inline-end: var(--ha-space-4, 16px);
      border-inline-end: 1px solid var(--haos-divider);
    }

    .compact-stats > div:nth-child(even) {
      padding-inline-start: var(--ha-space-4, 16px);
    }

    .chip-list {
      margin-top: var(--ha-space-3, 12px);
      display: flex;
      flex-wrap: wrap;
      gap: var(--ha-space-2, 8px);
    }

    .chip-list span {
      padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
      border-radius: var(--ha-border-radius-pill, 999px);
      background: var(--haos-surface-lower);
      font-size: var(--ha-font-size-s, 13px);
      text-transform: capitalize;
    }

    .detail-section ul {
      margin: var(--ha-space-3, 12px) 0 0;
      padding-inline-start: var(--ha-space-5, 20px);
      color: var(--haos-muted);
    }

    details {
      margin-top: var(--ha-space-3, 12px);
    }

    summary {
      cursor: pointer;
      color: var(--haos-primary);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    pre {
      max-height: 480px;
      margin: var(--ha-space-3, 12px) 0 0;
      padding: var(--ha-space-4, 16px);
      overflow: auto;
      border-radius: var(--ha-border-radius-lg, 10px);
      color: var(--haos-code-text);
      background: var(--haos-code-surface);
      font-family: var(--ha-font-family-code, ui-monospace, monospace);
      font-size: var(--ha-font-size-s, 13px);
      line-height: 1.55;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .settings-layout {
      width: min(980px, calc(100% - var(--ha-space-8, 32px)));
      margin: 0 auto;
      padding: var(--ha-space-8, 32px) 0 var(--ha-space-16, 64px);
    }

    .settings-heading {
      margin-bottom: var(--ha-space-6, 24px);
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: var(--ha-space-4, 16px);
    }

    .settings-heading p {
      margin-top: var(--ha-space-1, 4px);
      color: var(--haos-muted);
    }

    .version-badge {
      padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
      border-radius: var(--ha-border-radius-pill, 999px);
      background: var(--haos-surface-lower);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      white-space: nowrap;
    }

    .settings-notice {
      margin-bottom: var(--ha-space-4, 16px);
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      border: 1px solid color-mix(in srgb, var(--haos-success) 30%, var(--haos-divider));
      border-radius: var(--ha-border-radius-lg, 10px);
      background: var(--haos-success-soft);
      color: var(--haos-success);
      font-size: var(--ha-font-size-s, 13px);
    }

    .settings-section {
      display: block;
      margin-bottom: var(--ha-space-4, 16px);
      overflow: hidden;
    }

    .settings-section-title {
      padding: var(--ha-space-5, 20px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
      gap: var(--ha-space-3, 12px);
      border-bottom: 1px solid var(--haos-divider);
    }

    .settings-section-title > ha-icon {
      color: var(--haos-primary);
    }

    .settings-section-title p {
      margin-top: var(--ha-space-1, 4px);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
    }

    .approval-banner {
      padding: var(--ha-space-3, 12px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
      gap: var(--ha-space-3, 12px);
      border: 1px solid color-mix(in srgb, var(--haos-primary) 30%, var(--haos-divider));
      border-radius: var(--ha-border-radius-lg, 10px);
      color: var(--haos-text);
      background: var(--haos-selected);
      line-height: var(--ha-line-height-normal, 1.5);
      font-size: var(--ha-font-size-s, 13px);
    }

    .approval-settings > .approval-banner {
      margin: var(--ha-space-5, 20px);
    }

    .approval-banner > ha-icon {
      color: var(--haos-primary);
    }

    .approval-banner span {
      display: grid;
      gap: 2px;
    }

    .capability-list {
      margin-top: 0;
      border-top: 0;
    }

    .settings-fields,
    .goal-grid,
    .settings-subsection,
    .toggle-list,
    .settings-action,
    .about-actions,
    .advanced-toggle {
      margin-inline: var(--ha-space-5, 20px);
    }

    .settings-fields {
      padding-top: var(--ha-space-5, 20px);
      display: grid;
      gap: var(--ha-space-4, 16px);
    }

    .settings-fields.two-column {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .settings-fields.three-column {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .settings-fields.compact-fields {
      max-width: 420px;
    }

    .settings-fields label,
    .dialog-content label {
      min-width: 0;
      display: grid;
      align-content: start;
      gap: var(--ha-space-2, 8px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    .settings-fields input,
    .settings-fields select {
      min-width: 0;
      min-height: 44px;
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      color: var(--haos-text);
      background: var(--haos-surface);
    }

    .settings-fields small,
    .field-help,
    .settings-action > span {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      font-weight: var(--ha-font-weight-normal, 400);
      line-height: var(--ha-line-height-normal, 1.45);
    }

    .disabled-field {
      opacity: 0.55;
    }

    .advanced-toggle {
      min-height: 40px;
      margin-top: var(--ha-space-3, 12px);
      padding: var(--ha-space-2, 8px) 0;
      display: flex;
      align-items: center;
      gap: var(--ha-space-1, 4px);
      border: 0;
      background: transparent;
      color: var(--haos-primary);
      cursor: pointer;
    }

    .advanced-fields {
      padding-top: var(--ha-space-2, 8px);
    }

    .settings-action {
      padding: var(--ha-space-4, 16px) 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--ha-space-3, 12px);
      border-top: 1px solid var(--haos-divider);
    }

    .settings-action > span {
      margin-inline-end: auto;
    }

    .goal-grid {
      padding: var(--ha-space-5, 20px) 0;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--ha-space-2, 8px);
    }

    .choice-card {
      margin: 0;
      min-width: 0;
    }

    .choice-card > input {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      opacity: 0;
      pointer-events: none;
    }

    .choice-control {
      min-height: 48px;
      padding: var(--ha-space-3, 12px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-lg, 10px);
      background: var(--haos-surface);
      cursor: pointer;
      line-height: var(--ha-line-height-normal, 1.35);
    }

    .choice-card > input:checked + .choice-control {
      border-color: color-mix(in srgb, var(--haos-primary) 55%, var(--haos-divider));
      background: var(--haos-selected);
      color: var(--haos-primary);
    }

    .choice-card > input:focus-visible + .choice-control {
      outline: 2px solid var(--haos-primary);
      outline-offset: 2px;
    }

    .imported-goals,
    .entity-chips {
      margin: 0 var(--ha-space-5, 20px) var(--ha-space-4, 16px);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ha-space-2, 8px);
    }

    .imported-goals > span {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
    }

    .imported-goals button {
      min-height: 32px;
      padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-1, 4px);
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-pill, 999px);
      background: var(--haos-surface);
      cursor: pointer;
    }

    .imported-goals ha-icon {
      --mdc-icon-size: 16px;
    }

    .settings-subsection {
      padding: var(--ha-space-5, 20px) 0;
      border-top: 1px solid var(--haos-divider);
    }

    .settings-subsection h4 {
      margin: 0;
      font-size: var(--ha-font-size-m, 14px);
    }

    .settings-subsection > .settings-fields {
      margin-inline: 0;
    }

    .field-help {
      margin-top: var(--ha-space-1, 4px);
    }

    .toggle-list {
      padding: var(--ha-space-4, 16px) 0;
      display: grid;
      gap: var(--ha-space-3, 12px);
    }

    .toggle-list label {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
      gap: var(--ha-space-3, 12px);
      cursor: pointer;
    }

    .toggle-list input {
      width: 20px;
      height: 20px;
      margin: 1px 0 0;
      accent-color: var(--haos-primary);
    }

    .toggle-list label > span {
      display: grid;
      gap: 2px;
    }

    .toggle-list small {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      font-weight: var(--ha-font-weight-normal, 400);
    }

    .divided-toggles {
      margin-top: var(--ha-space-4, 16px);
      border-top: 1px solid var(--haos-divider);
    }

    .entity-picker {
      position: relative;
      margin-top: var(--ha-space-3, 12px);
    }

    .entity-picker > ha-icon {
      position: absolute;
      z-index: 1;
      inset: 12px auto auto 12px;
      color: var(--haos-muted);
      pointer-events: none;
    }

    .entity-picker > input {
      min-height: 48px;
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px) var(--ha-space-2, 8px) 44px;
      background: var(--haos-surface);
    }

    .entity-results {
      position: absolute;
      z-index: 5;
      inset: calc(100% + 4px) 0 auto;
      max-height: 320px;
      overflow: auto;
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-lg, 10px);
      background: var(--haos-surface);
      box-shadow: var(--ha-card-box-shadow, 0 4px 14px color-mix(in srgb, var(--haos-text) 16%, transparent));
    }

    .entity-results button {
      width: 100%;
      min-height: 52px;
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      border: 0;
      border-bottom: 1px solid var(--haos-divider);
      background: transparent;
      text-align: start;
      cursor: pointer;
    }

    .entity-results button:last-child {
      border-bottom: 0;
    }

    .entity-results button.active {
      background: var(--haos-selected);
    }

    .entity-results button:hover {
      background: var(--haos-selected);
    }

    .entity-results button > span,
    .entity-chips > span > span {
      min-width: 0;
      display: grid;
      gap: 2px;
    }

    .entity-results small,
    .entity-results em,
    .entity-chips small {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-xs, 11px);
      font-style: normal;
      overflow-wrap: anywhere;
    }

    .field-error {
      margin: var(--ha-space-2, 8px) 0 0;
      min-height: 1lh;
      color: var(--haos-error);
      font-size: var(--ha-font-size-s, 13px);
    }

    .field-error:empty {
      visibility: hidden;
    }

    .entity-chips {
      margin-inline: 0;
      margin-top: var(--ha-space-3, 12px);
      margin-bottom: 0;
    }

    .entity-chips > span {
      max-width: 100%;
      padding: var(--ha-space-2, 8px) var(--ha-space-2, 8px) var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-lg, 10px);
      background: var(--haos-surface);
    }

    .entity-chips > span.unavailable {
      border-style: dashed;
    }

    .entity-chips button {
      width: 28px;
      height: 28px;
      padding: 0;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: 50%;
      background: transparent;
      cursor: pointer;
    }

    .entity-chips button:hover {
      background: var(--haos-surface-lower);
    }

    .entity-chips button ha-icon {
      --mdc-icon-size: 18px;
    }

    .about-actions {
      padding: var(--ha-space-4, 16px) 0;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--ha-space-2, 8px);
    }

    .about-actions a {
      min-height: 44px;
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-lg, 10px);
      color: var(--haos-text);
      text-decoration: none;
      white-space: nowrap;
    }

    .about-actions a:hover {
      background: var(--haos-selected);
      color: var(--haos-primary);
    }

    .dialog-content {
      color: var(--haos-text);
    }

    .dialog-content > p {
      color: var(--haos-muted);
      line-height: var(--ha-line-height-normal, 1.55);
    }

    .approval-review {
      display: grid;
      gap: var(--ha-space-4, 16px);
    }

    .approval-review dl {
      margin: 0;
      border-top: 1px solid var(--haos-divider);
    }

    .approval-review dl > div {
      padding: var(--ha-space-3, 12px) 0;
      display: grid;
      grid-template-columns: minmax(100px, 0.35fr) minmax(0, 1fr);
      gap: var(--ha-space-3, 12px);
      border-bottom: 1px solid var(--haos-divider);
    }

    .approval-review dt {
      color: var(--haos-muted);
    }

    .approval-review dd {
      min-width: 0;
      margin: 0;
      overflow-wrap: anywhere;
    }

    .danger-copy {
      color: var(--haos-error) !important;
    }

    .muted {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-m, 14px);
    }

    /* Budget · F2 */
    .budget-banner {
      display: flex;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      border-bottom: 1px solid var(--haos-divider);
      background: var(--haos-warning-soft);
      color: var(--haos-text);
      font-size: var(--ha-font-size-m, 14px);
    }

    .budget-banner.exceeded {
      background: var(--haos-error-soft);
    }

    .budget-banner ha-icon {
      flex: none;
      color: var(--haos-warning);
    }

    .budget-banner.exceeded ha-icon {
      color: var(--haos-error);
    }

    .budget-banner span {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .budget-banner small {
      color: var(--haos-muted);
      font-variant-numeric: tabular-nums;
    }

    .budget-meter {
      margin-top: var(--ha-space-3, 12px);
      height: 8px;
      border-radius: 999px;
      background: var(--haos-surface-lower);
      overflow: hidden;
    }

    .budget-meter > span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--haos-primary);
    }

    .budget-meter.warning > span {
      background: var(--haos-warning);
    }

    .budget-meter.exceeded > span {
      background: var(--haos-error);
    }

    .readonly-field output {
      display: block;
      padding: var(--ha-space-2, 8px) 0;
      font-size: var(--ha-font-size-l, 16px);
      font-variant-numeric: tabular-nums;
    }

    /* Applied-change outcomes · F6 */
    .applied-list {
      list-style: none;
      margin: var(--ha-space-3, 12px) 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .applied-list li {
      display: flex;
      gap: var(--ha-space-3, 12px);
      padding: var(--ha-space-3, 12px) 0;
      border-top: 1px solid var(--haos-divider);
    }

    .applied-body {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .applied-body small {
      color: var(--haos-muted);
      overflow-wrap: anywhere;
    }

    .applied-outcome {
      flex: none;
      align-self: flex-start;
      padding: 2px var(--ha-space-2, 8px);
      border-radius: var(--ha-border-radius-sm, 4px);
      background: var(--haos-surface-lower);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 12px);
      white-space: nowrap;
    }

    .applied-outcome.kept {
      background: var(--haos-success-soft);
      color: var(--haos-success);
    }

    .applied-outcome.disabled,
    .applied-outcome.reverted {
      background: var(--haos-warning-soft);
      color: var(--haos-warning);
    }

    /* Automation diff · F5 */
    .diff-section {
      margin-top: var(--ha-space-4, 16px);
    }

    .diff-legend {
      display: flex;
      gap: var(--ha-space-3, 12px);
      margin-bottom: var(--ha-space-2, 8px);
      font-size: var(--ha-font-size-s, 12px);
      color: var(--haos-muted);
    }

    .diff-legend .removed::before,
    .diff-legend .added::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: var(--ha-space-1, 4px);
      border-radius: 2px;
      vertical-align: middle;
    }

    .diff-legend .removed::before {
      background: var(--haos-error);
    }

    .diff-legend .added::before {
      background: var(--haos-success);
    }

    pre.diff {
      max-height: 320px;
      overflow: auto;
      margin: 0;
      padding: 0;
      background: var(--haos-code-surface);
      color: var(--haos-code-text);
      border-radius: var(--ha-border-radius-md, 8px);
    }

    .diff-line {
      display: block;
      padding: 0 var(--ha-space-3, 12px);
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .diff-line.added {
      background: color-mix(in srgb, var(--haos-success) 26%, transparent);
    }

    .diff-line.removed {
      background: color-mix(in srgb, var(--haos-error) 26%, transparent);
    }

    /* Ignore scopes · F8 */
    .enforced-note {
      display: flex;
      align-items: flex-start;
      gap: var(--ha-space-2, 8px);
    }

    .enforced-note ha-icon {
      flex: none;
      --mdc-icon-size: 18px;
      color: var(--haos-success);
    }

    .category-list {
      margin-top: var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      border-top: 1px solid var(--haos-divider);
    }

    .category-list > div {
      padding: var(--ha-space-3, 12px) 0;
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      border-bottom: 1px solid var(--haos-divider);
      text-transform: capitalize;
      font-size: var(--ha-font-size-m, 14px);
    }

    .category-list > div:nth-child(odd) {
      padding-inline-end: var(--ha-space-3, 12px);
    }

    .category-list > div:nth-child(even) {
      padding-inline-start: var(--ha-space-3, 12px);
    }

    .category-list ha-icon,
    .privacy-note > ha-icon {
      color: var(--haos-success);
    }

    .privacy-note {
      margin-top: var(--ha-space-4, 16px);
      padding: var(--ha-space-3, 12px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: var(--ha-space-3, 12px);
      align-items: start;
      border-radius: var(--ha-border-radius-lg, 10px);
      background: var(--haos-success-soft);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      line-height: var(--ha-line-height-normal, 1.5);
    }

    .feedback-options {
      display: grid;
      gap: var(--ha-space-1, 4px);
    }

    .feedback-options > button {
      min-height: 44px;
      padding: var(--ha-space-2, 8px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      border: 0;
      border-radius: var(--ha-border-radius-lg, 10px);
      background: transparent;
      text-align: start;
      cursor: pointer;
    }

    .feedback-options > button:hover,
    .feedback-options > button.selected {
      background: var(--haos-selected);
    }

    .feedback-options label textarea {
      min-height: 84px;
      margin-top: var(--ha-space-2, 8px);
      padding: var(--ha-space-3, 12px);
      resize: vertical;
    }

    .dialog-content input {
      height: 44px;
      margin-top: var(--ha-space-2, 8px);
      padding: 0 var(--ha-space-3, 12px);
    }

    @media (max-width: 900px) {
      .app-header {
        min-height: auto;
        padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px) 0;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-areas:
          "title scan"
          "tabs tabs";
        gap: 0 var(--ha-space-2, 8px);
      }

      .title-lockup {
        grid-area: title;
      }

      .title-lockup .logo {
        width: 32px;
        height: 32px;
        flex-basis: 32px;
      }

      .scan-action {
        grid-area: scan;
      }

      .tabs {
        grid-area: tabs;
        height: 44px;
        justify-content: flex-start;
        overflow-x: auto;
        scrollbar-width: none;
      }

      .tabs::-webkit-scrollbar {
        display: none;
      }

      .tabs button {
        min-width: auto;
        flex: 1 0 auto;
      }

      .progress-panel {
        grid-template-columns: 1fr;
        gap: var(--ha-space-2, 8px);
      }

      .inbox-layout,
      .activity-layout,
      .chat-layout {
        height: auto;
        min-height: calc(100dvh - 100px);
        grid-template-columns: 1fr;
      }

      .inbox-layout .detail-pane,
      .activity-layout .detail-pane {
        display: none;
      }

      .inbox-layout.has-selection .list-pane,
      .activity-layout.has-selection .list-pane {
        display: none;
      }

      .inbox-layout.has-selection .detail-pane,
      .activity-layout.has-selection .detail-pane {
        display: block;
      }

      .list-pane,
      .thread-pane {
        border-inline-end: 0;
      }

      .detail-content {
        width: calc(100% - var(--ha-space-6, 24px));
        padding-top: var(--ha-space-4, 16px);
      }

      .mobile-back {
        display: inline-flex;
      }

      .detail-heading,
      .section-heading {
        flex-direction: column;
      }

      .detail-title {
        align-items: flex-start;
      }

      .decision-bar {
        position: static;
        flex-direction: column;
        align-items: stretch;
      }

      .decision-actions {
        justify-content: stretch;
      }

      .decision-actions ha-button[appearance="accent"] {
        flex: 1 1 auto;
      }

      .thread-pane {
        max-height: 150px;
        display: block;
        border-bottom: 1px solid var(--haos-divider);
      }

      .thread-heading {
        min-height: 52px;
        padding-block: var(--ha-space-2, 8px);
      }

      .thread-list {
        display: flex;
        overflow-x: auto;
      }

      .thread-list button {
        width: 220px;
        flex: 0 0 220px;
        border-inline-end: 1px solid var(--haos-divider);
      }

      .conversation-pane {
        min-height: calc(100dvh - 250px);
      }

      .conversation-header {
        align-items: flex-start;
      }

      .read-only-badge {
        display: none;
      }

      .messages {
        padding: var(--ha-space-4, 16px) var(--ha-space-3, 12px);
      }

      .message {
        width: 100%;
      }

      .composer {
        position: sticky;
        bottom: 0;
      }

      .compact-stats {
        grid-template-columns: 1fr;
      }

      .compact-stats > div:nth-child(n) {
        padding-inline: 0;
        border-inline-end: 0;
      }

      .category-list {
        grid-template-columns: 1fr;
      }

      .category-list > div:nth-child(n) {
        padding-inline: 0;
      }

      .yaml-actions {
        justify-content: flex-start;
      }

      .settings-layout {
        width: calc(100% - var(--ha-space-6, 24px));
        padding-top: var(--ha-space-4, 16px);
      }

      .settings-fields.three-column {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .about-actions {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 700px) {
      .settings-heading {
        align-items: start;
      }

      .settings-fields.two-column,
      .settings-fields.three-column,
      .goal-grid {
        grid-template-columns: 1fr;
      }

      .settings-action {
        align-items: stretch;
        flex-direction: column;
      }

      .settings-action > span {
        margin-inline-end: 0;
      }

      .settings-action ha-button {
        align-self: stretch;
      }
    }

    @media (max-width: 420px) {
      .app-header h1 {
        font-size: var(--ha-font-size-l, 16px);
      }

      .tabs button {
        padding-inline: var(--ha-space-2, 8px);
      }

      .filters {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .detail-title {
        gap: var(--ha-space-3, 12px);
      }

      .detail-icon {
        width: 38px;
        height: 38px;
        flex-basis: 38px;
      }

      .composer {
        grid-template-columns: 1fr;
      }

      .composer ha-button {
        justify-self: stretch;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "haos-ai-panel": HaosAiPanel;
  }
}
