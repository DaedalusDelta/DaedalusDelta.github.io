(() => {
  'use strict';
  const storageKey = 'ocbench.phase-detail.20261025.website-notes.v1';
  const cases = [...document.querySelectorAll('[data-case]')];
  const batches = [...document.querySelectorAll('.batch')];
  const fields = ['judgment', 'comments', 'phaseOrPart', 'timeInterval', 'reason', 'missingContext', 'severity'];
  const status = document.querySelector('#storage-status');
  const emptyNote = () => ({ judgment: null, comments: '', phaseOrPart: '', timeInterval: '', reason: '', missingContext: '', severity: null, updatedAt: null });
  let notes = Object.fromEntries(cases.map(card => [card.dataset.case, emptyNote()]));
  let canStore = true;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.schema !== 'ocbench.phase-detail.browser-notes.v1' || !saved.notes) throw new Error('Unrecognized draft');
      for (const id of Object.keys(notes)) {
        const source = saved.notes[id];
        if (!source || typeof source !== 'object') continue;
        for (const field of [...fields, 'updatedAt']) {
          if (typeof source[field] === 'string') notes[id][field] = source[field];
        }
        if (!['plausible', 'reject', 'uncertain'].includes(notes[id].judgment)) notes[id].judgment = null;
        if (!['severe', 'nonsevere', 'unresolved'].includes(notes[id].severity)) notes[id].severity = null;
      }
    }
  } catch (_) {
    canStore = false;
    status.textContent = 'Saved notes could not be read. New edits stay in memory; download them before leaving.';
  }

  function updateCard(card) {
    const note = notes[card.dataset.case];
    card.querySelector('.followup').hidden = !['reject', 'uncertain'].includes(note.judgment);
    const badge = card.querySelector('.case-status');
    badge.textContent = note.judgment ? note.judgment[0].toUpperCase() + note.judgment.slice(1) : 'Unreviewed';
    badge.classList.toggle('reviewed', !!note.judgment);
    document.querySelector('#progress').textContent = `${Object.values(notes).filter(n => n.judgment).length} / ${cases.length} decisions`;
  }

  function save() {
    if (!canStore) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({schema: 'ocbench.phase-detail.browser-notes.v1', notes}));
      status.textContent = 'Saved in this browser only. Nothing is submitted.';
    } catch (_) {
      canStore = false;
      status.textContent = 'Browser storage is unavailable. Download notes before leaving this page.';
    }
  }

  function record(card) {
    const note = notes[card.dataset.case];
    const selected = card.querySelector('[data-field="judgment"]:checked');
    for (const field of fields) {
      note[field] = field === 'judgment'
        ? (selected ? selected.value : null)
        : (field === 'severity' ? card.querySelector(`[data-field="${field}"]`).value || null : card.querySelector(`[data-field="${field}"]`).value);
    }
    note.updatedAt = new Date().toISOString();
    updateCard(card);
    save();
  }

  for (const card of cases) {
    const note = notes[card.dataset.case];
    for (const input of card.querySelectorAll('[data-field]')) {
      if (input.type === 'radio') input.checked = input.value === note.judgment;
      else input.value = note[input.dataset.field] === null ? '' : note[input.dataset.field];
      input.addEventListener('input', () => record(card));
    }
    updateCard(card);
    const video = card.querySelector('video');
    video.addEventListener('play', () => cases.forEach(other => {
      if (other !== card) other.querySelector('video').pause();
    }));
    card.addEventListener('click', event => {
      const control = event.target.closest('[data-action]');
      const action = control ? control.dataset.action : null;
      if (!action) return;
      if (action === 'replay') {
        video.currentTime = 0;
        video.play().catch(() => { /* Native controls remain available. */ });
      } else if (action === 'back' || action === 'forward') {
        if (Number.isFinite(video.duration)) video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + (action === 'back' ? -1 : 1)));
      } else if (action === 'timestamp') {
        card.querySelector('[data-field="timeInterval"]').value = `${video.currentTime.toFixed(2)} s (viewing time)`;
        record(card);
      } else if (action === 'clear') {
        notes[card.dataset.case] = emptyNote();
        card.querySelectorAll('[data-field]').forEach(input => {
          if (input.type === 'radio') input.checked = false;
          else input.value = '';
        });
        updateCard(card);
        save();
      }
    });
  }

  document.querySelector('#download').addEventListener('click', () => {
    const payload = {
      schema: 'ocbench.phase-detail.review-draft.v1',
      packet: 'phase-detail-20261025',
      batchId: 'phase-detail-20261025',
      exportedAt: new Date().toISOString(),
      question: "Please judge shape only in PD-000, PD-001, PD-002 and PD-007. Which have the kind of small bends and deviations you want? In the first three, is any visible variation too repetitive, wavy or sharply turning, or still too smooth? For PD-007, identify any phase needing a different kind of bend. Plausible/reject/uncertain and a phase or short note are useful; leave anything you did not judge blank. If the small differences cannot be seen clearly, please say that rather than infer a quality judgment.",
      caption: "Synthetic 3D spatial intent; moving dots use arbitrary equal-index playback. Shape only: these are not executed robot motions or natural-speed recordings. Gray descent/lift segments and whole-path scale may hide small differences; closer phase views are currently unavailable.",
      status: 'Reviewer draft; not authoritative labels; not submitted by this page.',
      batches: batches.map(batch => [...batch.querySelectorAll('[data-case]')].map(card => card.dataset.case)),
      reviews: cases.map(card => ({caseId: card.dataset.case, ...notes[card.dataset.case]}))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2) + '\n'], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ocbench-phase-detail-notes-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
