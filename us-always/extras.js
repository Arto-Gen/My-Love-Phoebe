// The interactive keepsakes. Personalize their original text in content.js.
// New reasons, dreams, and redeemed coupons are saved on this browser only.
export function mountExtras({ data, icon, celebrate, toast, storage }) {
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const read = (key, fallback) => {
    try { return storage.get(key, fallback); } catch { return fallback; }
  };
  const save = (key, value) => {
    try { return storage.set(key, value) !== false; } catch { return false; }
  };
  const savedMessage = (message, persisted) => `${message}${persisted ? '' : ' Saved for this visit only; your browser could not keep it for next time.'}`;
  const svg = (name, className = '') => icon(name, className);
  const makeId = () => globalThis.crypto?.randomUUID?.() || `dream-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  mountReasons();
  mountQuiz();
  mountBucket();
  mountCoupons();

  function mountReasons() {
    const root = document.querySelector('#reasons-content');
    if (!root) return;
    const saved = read('extra-reasons', []);
    const added = Array.isArray(saved) ? saved.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.slice(0, 280)) : [];
    const original = Array.isArray(data.reasons) ? data.reasons.filter((reason) => typeof reason === 'string' && reason.trim()) : [];
    const reasons = [...new Set([...original, ...added])];
    if (!reasons.length) reasons.push('Because the ordinary feels a little extraordinary with you.');
    let current = 0;
    root.innerHTML = `
      <div class="x-reasons-layout">
        <div class="x-note-stack">
          <div class="x-note-back x-note-back-one" aria-hidden="true"></div>
          <div class="x-note-back x-note-back-two" aria-hidden="true"></div>
          <article class="x-reason-note">
            <span class="x-note-pin" aria-hidden="true">${svg('heart')}</span>
            <span class="x-note-topline">A little reminder, just for you</span>
            <div class="x-reason-live" aria-live="polite" aria-atomic="true"><p class="x-reason-text"></p></div>
            <span class="x-note-signature">and a thousand little things more.</span>
            <button class="x-button x-draw-reason" type="button">Pull another love note ${svg('arrow-right')}</button>
          </article>
        </div>
        <div class="x-jar-side">
          <div class="x-jar-illustration" aria-hidden="true">
            <span class="x-jar-spark x-jar-spark-one">✧</span><span class="x-jar-spark x-jar-spark-two">✧</span>
            <div class="x-jar-lid"></div>
            <div class="x-jar"><i class="x-jar-slip x-slip-one">you & me</i><i class="x-jar-slip x-slip-two">always</i><i class="x-jar-slip x-slip-three">♡</i><i class="x-jar-slip x-slip-four">little joys</i><span class="x-jar-label">little notes<br><b>of love</b>${svg('heart')}</span></div>
            <span class="x-jar-shadow"></span>
          </div>
          <p class="x-jar-caption">A jar that will never be full.</p>
          <form class="x-add-form x-reason-form">
            <label for="x-new-reason">Leave another little reason</label>
            <div class="x-input-row"><input id="x-new-reason" name="reason" type="text" placeholder="I love the way you…" maxlength="280" required autocomplete="off"><button class="x-icon-button" type="submit" aria-label="Add a reason">${svg('plus')}</button></div>
            <span class="x-form-hint x-reason-count"></span>
          </form>
        </div>
      </div>`;
    const text = root.querySelector('.x-reason-text');
    const card = root.querySelector('.x-reason-note');
    const count = root.querySelector('.x-reason-count');
    const paint = () => {
      text.textContent = reasons[current];
      count.textContent = `${reasons.length} little reasons tucked away`;
    };
    const animate = () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || !card.animate) return;
      card.animate([{ opacity: 0.45, transform: 'translateY(8px) rotate(-1deg)' }, { opacity: 1, transform: 'translateY(0) rotate(0deg)' }], { duration: 430, easing: 'cubic-bezier(.2,.75,.3,1)' });
    };
    root.querySelector('.x-draw-reason').addEventListener('click', () => {
      if (reasons.length > 1) current = (current + 1 + Math.floor(Math.random() * (reasons.length - 1))) % reasons.length;
      paint();
      animate();
    });
    root.querySelector('.x-reason-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const input = root.querySelector('#x-new-reason');
      const value = input.value.trim();
      if (!value) { input.focus(); toast('Write a little reason first.'); return; }
      const existingIndex = reasons.indexOf(value);
      if (existingIndex !== -1) {
        current = existingIndex;
        paint();
        animate();
        toast('That little reason is already in our jar. ♡');
        return;
      }
      added.push(value);
      reasons.push(value);
      current = reasons.length - 1;
      const persisted = save('extra-reasons', added);
      input.value = '';
      paint();
      animate();
      toast(savedMessage('Another little piece of love, tucked away.', persisted));
    });
    paint();
  }

  function mountQuiz() {
    const root = document.querySelector('#quiz-content');
    if (!root) return;
    const questions = Array.isArray(data.quiz) ? data.quiz.filter((question) => Array.isArray(question.options) && question.options.length && Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length) : [];
    let current = 0;
    let score = 0;
    let answered = false;
    root.classList.add('x-quiz');
    if (!questions.length) {
      root.innerHTML = '<p>Our little quiz is waiting for its first question.</p>';
      return;
    }
    const render = (focus = false) => {
      answered = false;
      const question = questions[current];
      root.innerHTML = `
        <div class="x-quiz-meta"><span>Question ${current + 1} of ${questions.length}</span><span>${svg('heart')} Made for us</span></div>
        <div class="x-quiz-progress" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="${current}"><span style="width:${current / questions.length * 100}%"></span></div>
        <h3 class="x-question" tabindex="-1">${escape(question.question)}</h3>
        <div class="x-answers" role="group" aria-label="Choose your answer">${question.options.map((option, index) => `<button class="x-answer" type="button" data-answer="${index}" aria-pressed="false"><span class="x-answer-letter">${String.fromCharCode(65 + index)}</span><span>${escape(option)}</span><span class="x-answer-mark" aria-hidden="true"></span></button>`).join('')}</div>
        <div class="x-quiz-feedback" role="status" aria-live="polite"></div>
        <button class="x-button x-next-question" type="button" hidden>${current === questions.length - 1 ? 'See how we did' : 'Next little question'} ${svg('arrow-right')}</button>`;
      if (focus) root.querySelector('.x-question').focus({ preventScroll: true });
      root.querySelectorAll('.x-answer').forEach((button) => button.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const selected = Number(button.dataset.answer);
        const correct = selected === question.answer;
        if (correct) { score += 1; celebrate(); }
        button.setAttribute('aria-pressed', 'true');
        root.querySelectorAll('.x-answer').forEach((option) => {
          option.disabled = true;
          const index = Number(option.dataset.answer);
          if (index === question.answer) {
            option.classList.add('x-answer-correct');
            option.querySelector('.x-answer-mark').innerHTML = svg('check');
          } else if (index === selected) option.classList.add('x-answer-wrong');
        });
        const feedback = root.querySelector('.x-quiz-feedback');
        feedback.textContent = correct ? (question.praise || 'You know my heart so well. ♡') : `${question.tease || 'Close, sweetheart. A perfect excuse to make more memories.'} The answer is “${question.options[question.answer]}”.`;
        feedback.classList.add(correct ? 'x-is-right' : 'x-is-playful');
        root.querySelector('.x-next-question').hidden = false;
        root.querySelector('.x-quiz-progress').setAttribute('aria-valuenow', String(current + 1));
        root.querySelector('.x-quiz-progress span').style.width = `${(current + 1) / questions.length * 100}%`;
      }));
      root.querySelector('.x-next-question').addEventListener('click', () => {
        if (!answered) return;
        current += 1;
        if (current < questions.length) render(true);
        else finish();
      });
    };
    const finish = () => {
      const perfect = score === questions.length;
      root.innerHTML = `<div class="x-quiz-result"><span class="x-result-heart" aria-hidden="true">${svg('heart')}</span><span class="x-result-score">${score}<small> / ${questions.length}</small></span><h3 tabindex="-1">${perfect ? 'You know my heart by heart.' : 'My favorite person, every time.'}</h3><p>${perfect ? 'Every little detail. Every little memory. Of course it’s you.' : 'Some details may get fuzzy. The part where I love you? That never changes.'}</p><span class="x-result-note">The real prize is a lifetime of us.</span><button class="x-button x-replay" type="button">Play a little again ${svg('refresh')}</button></div>`;
      root.querySelector('h3').focus({ preventScroll: true });
      root.querySelector('.x-replay').addEventListener('click', () => { current = 0; score = 0; render(true); });
      document.dispatchEvent(new CustomEvent('love:quiz-complete', { detail: { score, total: questions.length } }));
      if (perfect) celebrate();
    };
    render();
  }

  function mountBucket() {
    const root = document.querySelector('#bucket-content');
    if (!root) return;
    const initial = Array.isArray(data.bucket) ? data.bucket : [];
    const saved = read('bucket-list', initial);
    const list = (Array.isArray(saved) ? saved : initial).filter((item) => item && typeof item.title === 'string').map((item) => ({ id: String(item.id || makeId()), title: item.title.slice(0, 150), done: Boolean(item.done) }));
    root.classList.add('x-bucket');
    root.innerHTML = `<div class="x-bucket-meta"><span>Dream big. Start small. Together.</span><span class="x-bucket-counter"></span></div><ul class="x-bucket-list"></ul><form class="x-add-form x-bucket-form"><label for="x-new-dream">What else shall we dream of?</label><div class="x-input-row"><input id="x-new-dream" name="dream" type="text" placeholder="A little adventure for two…" maxlength="150" required autocomplete="off"><button class="x-icon-button" type="submit" aria-label="Add a dream">${svg('plus')}</button></div></form><p class="x-bucket-bottom">The best part will always be who I’m with. ♡</p>`;
    const paint = () => {
      const counter = root.querySelector('.x-bucket-counter');
      const done = list.filter((item) => item.done).length;
      counter.textContent = `${done} / ${list.length} memories made`;
      counter.setAttribute('aria-live', 'polite');
      const ul = root.querySelector('.x-bucket-list');
      ul.replaceChildren();
      list.forEach((item) => {
        const li = document.createElement('li');
        li.className = item.done ? 'x-dream x-dream-done' : 'x-dream';
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.done;
        const box = document.createElement('span');
        box.className = 'x-checkbox';
        box.setAttribute('aria-hidden', 'true');
        box.innerHTML = svg('check');
        const title = document.createElement('span');
        title.className = 'x-dream-title';
        title.textContent = item.title;
        label.append(checkbox, box, title);
        li.append(label);
        ul.append(li);
        checkbox.addEventListener('change', () => {
          item.done = checkbox.checked;
          li.classList.toggle('x-dream-done', item.done);
          counter.textContent = `${list.filter((dream) => dream.done).length} / ${list.length} memories made`;
          const persisted = save('bucket-list', list);
          if (item.done) {
            celebrate();
            toast(savedMessage('One more memory in our story.', persisted));
          } else if (!persisted) {
            toast(savedMessage('This dream is back on our list.', false));
          }
        });
      });
    };
    root.querySelector('.x-bucket-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const input = root.querySelector('#x-new-dream');
      const value = input.value.trim();
      if (!value) { input.focus(); toast('Give our next dream a name.'); return; }
      list.push({ id: makeId(), title: value, done: false });
      const persisted = save('bucket-list', list);
      input.value = '';
      paint();
      root.querySelector('.x-bucket-list').lastElementChild?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      toast(savedMessage('A new someday to look forward to.', persisted));
    });
    paint();
  }

  function mountCoupons() {
    const root = document.querySelector('#coupons-content');
    if (!root) return;
    const coupons = Array.isArray(data.coupons) ? data.coupons : [];
    const previous = read('redeemed-coupons', {});
    const redemptions = previous && !Array.isArray(previous) && typeof previous === 'object' ? previous : {};
    const prettyDate = (date) => {
      const parsed = new Date(date);
      return Number.isNaN(parsed.getTime()) ? 'Saved with love' : new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Manila' }).format(parsed);
    };
    root.innerHTML = '<div class="x-coupons-grid"></div><div class="x-redemption-log" aria-live="polite"></div>';
    const grid = root.querySelector('.x-coupons-grid');
    const paintLog = () => {
      const claimed = coupons.filter((coupon) => Object.hasOwn(redemptions, coupon.id));
      const log = root.querySelector('.x-redemption-log');
      log.replaceChildren();
      if (!claimed.length) return;
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = `${claimed.length} little ${claimed.length === 1 ? 'treat' : 'treats'} claimed · Your keepsake log`;
      const ul = document.createElement('ul');
      claimed.forEach((coupon) => {
        const li = document.createElement('li');
        li.textContent = `${coupon.title} — ${prettyDate(redemptions[coupon.id])}`;
        ul.append(li);
      });
      details.append(summary, ul);
      log.append(details);
    };
    coupons.forEach((coupon, index) => {
      const article = document.createElement('article');
      article.className = `x-coupon x-coupon-${index % 4}`;
      article.innerHTML = `<span class="x-coupon-icon" aria-hidden="true">${svg(coupon.icon || 'gift')}</span><span class="x-coupon-for">A little something for you</span><h3>${escape(coupon.title)}</h3><p>${escape(coupon.description)}</p><div class="x-coupon-perforation" aria-hidden="true"></div><div class="x-coupon-footer"><span class="x-coupon-fine">No expiry.<br>Just love.</span><button type="button" class="x-coupon-redeem" aria-label="Redeem ${escape(coupon.title)}">Redeem ${svg('arrow-right')}</button></div><div class="x-coupon-stamp" aria-hidden="true">With love ♡</div>`;
      grid.append(article);
      const button = article.querySelector('.x-coupon-redeem');
      const applyRedeemed = () => {
        article.classList.add('x-coupon-redeemed');
        button.disabled = true;
        button.setAttribute('aria-label', `${coupon.title} redeemed on ${prettyDate(redemptions[coupon.id])}`);
        button.innerHTML = `Claimed ${svg('check')}`;
        article.querySelector('.x-coupon-fine').textContent = prettyDate(redemptions[coupon.id]);
      };
      if (Object.hasOwn(redemptions, coupon.id)) applyRedeemed();
      button.addEventListener('click', () => {
        if (Object.hasOwn(redemptions, coupon.id)) return;
        redemptions[coupon.id] = new Date().toISOString();
        const persisted = save('redeemed-coupons', redemptions);
        applyRedeemed();
        article.classList.add('x-just-redeemed');
        paintLog();
        celebrate();
        toast(savedMessage('It’s a date. This little treat is yours. ♡', persisted));
      });
    });
    paintLog();
  }
}
