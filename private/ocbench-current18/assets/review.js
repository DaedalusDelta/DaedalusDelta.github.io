(() => {
  'use strict';
  const storageKey = 'ocbench.current18.review.v2.website-notes';
  const cases = [...document.querySelectorAll('[data-case]')];
  const batches = [...document.querySelectorAll('.batch')];
  const fields = ['judgment', 'phaseOrPart', 'timeInterval', 'reason', 'missingContext', 'severity'];
  const status = document.querySelector('#storage-status');
  const emptyNote = () => ({ judgment: null, phaseOrPart: '', timeInterval: '', reason: '', missingContext: '', severity: '', updatedAt: null });
  let notes = Object.fromEntries(cases.map(card => [card.dataset.case, emptyNote()]));
  let canStore = true;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.schema !== 'ocbench.current18.browser-notes.v1' || !saved.notes) throw new Error('Unrecognized draft');
      for (const id of Object.keys(notes)) {
        const source = saved.notes[id];
        if (!source || typeof source !== 'object') continue;
        for (const field of [...fields, 'updatedAt']) {
          if (typeof source[field] === 'string') notes[id][field] = source[field];
        }
        if (!['plausible', 'reject', 'uncertain'].includes(notes[id].judgment)) notes[id].judgment = null;
        if (!['', 'severe', 'nonsevere', 'unresolved'].includes(notes[id].severity)) notes[id].severity = '';
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
    document.querySelector('#progress').textContent = `${Object.values(notes).filter(n => n.judgment).length} / 18 decisions`;
  }

  function save() {
    if (!canStore) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({schema: 'ocbench.current18.browser-notes.v1', notes}));
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
        : card.querySelector(`[data-field="${field}"]`).value;
    }
    note.updatedAt = new Date().toISOString();
    updateCard(card);
    save();
  }

  for (const card of cases) {
    const note = notes[card.dataset.case];
    for (const input of card.querySelectorAll('[data-field]')) {
      if (input.type === 'radio') input.checked = input.value === note.judgment;
      else input.value = note[input.dataset.field];
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

  let currentBatch = 1;
  function showBatch() {
    const requested = /^#batch-([1-6])$/.exec(location.hash);
    currentBatch = requested ? Number(requested[1]) : 1;
    batches.forEach((batch, index) => {
      batch.hidden = index + 1 !== currentBatch;
      if (batch.hidden) batch.querySelectorAll('video').forEach(video => video.pause());
    });
    document.querySelectorAll('[data-batch]').forEach(link => {
      if (Number(link.dataset.batch) === currentBatch) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    document.querySelector('#previous').disabled = currentBatch === 1;
    document.querySelector('#next').disabled = currentBatch === 6;
    document.querySelector('#batch-position').textContent = `${currentBatch} / 6`;
  }
  document.querySelector('.batch-controls').hidden = false;
  document.querySelector('#previous').addEventListener('click', () => { location.hash = `batch-${currentBatch - 1}`; });
  document.querySelector('#next').addEventListener('click', () => { location.hash = `batch-${currentBatch + 1}`; });
  window.addEventListener('hashchange', showBatch);
  showBatch();

  document.querySelector('#download').addEventListener('click', () => {
    const payload = {
      schema: 'ocbench.current18.review-draft.v1',
      packet: 'CURRENT18',
      exportedAt: new Date().toISOString(),
      question: 'Does the whole route look plausible for this pickup-and-placement task?',
      timing: 'Geometric illustrations; video seconds are viewing time, not validated robot motion timing.',
      status: 'Reviewer draft; not authoritative labels; not submitted by this page.',
      batches: batches.map(batch => [...batch.querySelectorAll('[data-case]')].map(card => card.dataset.case)),
      reviews: cases.map(card => ({caseId: card.dataset.case, ...notes[card.dataset.case]}))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2) + '\n'], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ocbench-current18-notes-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
