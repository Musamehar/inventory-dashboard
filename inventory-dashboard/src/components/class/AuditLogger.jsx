import { Component } from "react";

// ──────────────────────────────────────────────────────────────────────────────
// AuditLogger — Class Component (Task 3)
// Demonstrates: componentDidMount, componentDidUpdate, componentWillUnmount,
//               this.state, this.setState
// ──────────────────────────────────────────────────────────────────────────────
class AuditLogger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      toastMsg: null,
    };
    this._toastTimer = null;
  }

  // ── Lifecycle: Mount ──────────────────────────────────────────────────────
  componentDidMount() {
    // Retrieve initial audit logs stored in localStorage
    try {
      const saved = localStorage.getItem("auditLogs");
      if (saved) {
        this.setState({ logs: JSON.parse(saved) });
      }
    } catch {
      console.warn("AuditLogger: failed to parse logs from localStorage");
    }
  }

  // ── Lifecycle: Update ─────────────────────────────────────────────────────
  componentDidUpdate(prevProps, prevState) {
    // Persist logs to localStorage when they change
    if (prevState.logs !== this.state.logs) {
      localStorage.setItem("auditLogs", JSON.stringify(this.state.logs));
    }

    // Show toast when a new log is added
    if (this.state.logs.length > prevState.logs.length) {
      const latest = this.state.logs[0];
      this.setState({ toastMsg: latest.message });

      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        this.setState({ toastMsg: null });
      }, 2800);
    }
  }

  // ── Lifecycle: Unmount ────────────────────────────────────────────────────
  componentWillUnmount() {
    clearTimeout(this._toastTimer);
  }

  // ── Public method called by parent via ref ────────────────────────────────
  addLog(message, type = "info") {
    const entry = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.setState((prev) => ({ logs: [entry, ...prev.logs].slice(0, 50) }));
  }

  clearLogs() {
    this.setState({ logs: [] });
    localStorage.removeItem("auditLogs");
  }

  // ── Render ────────────────────────────────────────────────────────────────
  render() {
    const { logs, toastMsg } = this.state;

    const typeColor = {
      success: "text-emerald-600 dark:text-emerald-400",
      warning: "text-amber-600 dark:text-amber-400",
      error:   "text-rose-500 dark:text-rose-400",
      info:    "text-slate-500 dark:text-slate-400",
    };

    const typeDot = {
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      error:   "bg-rose-500",
      info:    "bg-slate-400",
    };

    return (
      <div className="h-full flex flex-col">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-4 right-4 z-50 toast-enter">
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 pl-4 pr-5 py-3 rounded-lg shadow-2xl shadow-black/20 text-sm font-medium flex items-center gap-2.5 max-w-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-600 shrink-0"></span>
              <span className="truncate">{toastMsg}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
            Activity Log
          </h2>
          {/* Conditional rendering with && (Task 4) */}
          {logs.length > 0 && (
            <button
              onClick={() => this.clearLogs()}
              className="text-[11px] text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Conditional rendering with ternary (Task 4) */}
        {logs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-gray-300 dark:text-gray-600">
              No activity yet
            </p>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto space-y-0.5 -mx-1">
            {/* Array.map() with key props (Task 4) */}
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors group"
              >
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${typeDot[log.type] || typeDot.info}`}></span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium leading-snug ${typeColor[log.type] || typeColor.info}`}>
                    {log.message}
                  </p>
                  <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">
                    {log.timestamp}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default AuditLogger;
