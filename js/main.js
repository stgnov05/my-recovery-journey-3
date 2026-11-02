/* My Recovery Journey - Main JS */

(function () {
  "use strict";

  // ---------- Mobile nav ----------
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    });
  }

  // Highlight current page in nav
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // ---------- Local storage helpers ----------
  const STORAGE_PREFIX = "mrj_";

  function save(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  // ---------- Gratitude Journal ----------
  const journalText = document.getElementById("journal-text");
  const journalSave = document.getElementById("journal-save");
  const journalClear = document.getElementById("journal-clear");
  const journalExport = document.getElementById("journal-export");
  const entriesList = document.getElementById("saved-entries-list");

  if (journalText) {
    // Restore draft
    const draft = load("journal_draft", "");
    if (draft) journalText.value = draft;

    journalText.addEventListener("input", () => {
      save("journal_draft", journalText.value);
    });

    function renderEntries() {
      const entries = load("journal_entries", []);
      if (!entriesList) return;
      if (entries.length === 0) {
        entriesList.innerHTML = '<p class="muted">No saved entries yet.</p>';
        return;
      }
      entriesList.innerHTML = entries
        .slice()
        .reverse()
        .map(
          (e) => `
        <div class="entry-item">
          <div class="entry-date">${e.date}</div>
          <div>${escapeHtml(e.text)}</div>
        </div>`
        )
        .join("");
    }

    function escapeHtml(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    if (journalSave) {
      journalSave.addEventListener("click", () => {
        const text = journalText.value.trim();
        if (!text) return;
        const entries = load("journal_entries", []);
        entries.push({
          date: new Date().toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          }),
          text,
        });
        save("journal_entries", entries);
        save("journal_draft", "");
        journalText.value = "";
        renderEntries();
      });
    }

    if (journalClear) {
      journalClear.addEventListener("click", () => {
        if (confirm("Clear the current text?")) {
          journalText.value = "";
          save("journal_draft", "");
        }
      });
    }

    if (journalExport) {
      journalExport.addEventListener("click", () => {
        const entries = load("journal_entries", []);
        if (entries.length === 0) {
          alert("No entries to export.");
          return;
        }
        const content = entries
          .map((e) => `[${e.date}]\n${e.text}\n`)
          .join("\n---\n\n");
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "my-gratitude-journal.txt";
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    renderEntries();
  }

  // ---------- Milestones ----------
  const dateInput = document.getElementById("start-date");
  const clearDateBtn = document.getElementById("clear-date");
  const daysEl = document.getElementById("count-days");
  const weeksEl = document.getElementById("count-weeks");
  const monthsEl = document.getElementById("count-months");

  function updateMilestones() {
    const stored = load("start_date", null);
    if (dateInput && stored) {
      dateInput.value = stored;
    }
    if (!stored || !daysEl) return;

    const start = new Date(stored + "T00:00:00");
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diffMs = now - start;
    if (diffMs < 0) {
      daysEl.textContent = "—";
      weeksEl.textContent = "—";
      monthsEl.textContent = "—";
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);

    daysEl.textContent = days;
    weeksEl.textContent = weeks;
    monthsEl.textContent = months;
  }

  if (dateInput) {
    const stored = load("start_date", null);
    if (stored) dateInput.value = stored;

    dateInput.addEventListener("change", () => {
      if (dateInput.value) {
        save("start_date", dateInput.value);
        updateMilestones();
      }
    });

    if (clearDateBtn) {
      clearDateBtn.addEventListener("click", () => {
        if (confirm("Clear your start date?")) {
          save("start_date", null);
          dateInput.value = "";
          if (daysEl) {
            daysEl.textContent = "—";
            weeksEl.textContent = "—";
            monthsEl.textContent = "—";
          }
        }
      });
    }

    updateMilestones();
  }

  // ---------- Next Right Step checklist ----------
  const checklist = document.getElementById("next-step-list");
  if (checklist) {
    const items = checklist.querySelectorAll('input[type="checkbox"]');
    const saved = load("next_steps", {});

    items.forEach((cb) => {
      const id = cb.dataset.id;
      if (saved[id]) {
        cb.checked = true;
        cb.closest("li").classList.add("checked");
      }
      cb.addEventListener("change", () => {
        const state = load("next_steps", {});
        state[id] = cb.checked;
        save("next_steps", state);
        cb.closest("li").classList.toggle("checked", cb.checked);
      });
    });

    const resetBtn = document.getElementById("reset-steps");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        save("next_steps", {});
        items.forEach((cb) => {
          cb.checked = false;
          cb.closest("li").classList.remove("checked");
        });
      });
    }
  }

  // ---------- Daily Reflection ----------
  const reflections = [
    {
      text: "Recovery is not about becoming a different person overnight. It is about making one honest choice today, then another tomorrow.",
      question: "What is one small, honest choice you can make in the next hour?",
    },
    {
      text: "You do not have to feel ready to take the next step. Readiness often follows action, not the other way around.",
      question: "What is one action you have been waiting to feel ready for?",
    },
    {
      text: "A setback does not erase the progress you have already made. It is information, not a verdict.",
      question: "How can you respond to a difficult moment with curiosity instead of judgment?",
    },
    {
      text: "Connection is one of the strongest protectors in recovery. You do not have to share everything to take a first step toward someone supportive.",
      question: "Who is one person you could reach out to this week, even briefly?",
    },
    {
      text: "Your past is part of your story. It does not have to write the ending.",
      question: "What part of your future are you most willing to protect today?",
    },
    {
      text: "Rest is not the opposite of progress. Exhaustion makes every decision harder.",
      question: "What would it look like to give yourself permission to rest today?",
    },
    {
      text: "Faith, for many, is not the absence of doubt. It is choosing to keep moving even when the path is unclear.",
      question: "Where do you need strength or clarity right now?",
    },
  ];

  const reflectionText = document.getElementById("reflection-text");
  const reflectionQuestion = document.getElementById("reflection-question");
  const reflectionBtn = document.getElementById("new-reflection");

  function showReflection(index) {
    if (!reflectionText) return;
    const r = reflections[index % reflections.length];
    reflectionText.textContent = r.text;
    if (reflectionQuestion) reflectionQuestion.textContent = r.question;
    save("last_reflection_index", index);
  }

  if (reflectionText) {
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    let idx = load("last_reflection_index", dayIndex % reflections.length);
    showReflection(idx);

    if (reflectionBtn) {
      reflectionBtn.addEventListener("click", () => {
        idx = (idx + 1) % reflections.length;
        showReflection(idx);
      });
    }
  }
})();
