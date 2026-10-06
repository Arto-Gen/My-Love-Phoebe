/**
 * An original, locally synthesized ambient soundtrack. No download, tracking,
 * license, or internet connection is needed. Audio starts only after a click.
 *
 * TO USE YOUR OWN MUSIC: place your licensed file at assets/our-song.mp3 and
 * replace the synthesis in this module with `new Audio('./assets/our-song.mp3')`.
 * Keep play() inside the button's click handler, set loop = true and volume = .2,
 * and retain the visibility cleanup so music pauses when this tab is hidden.
 */
export function createMusicPlayer(button, { onError = () => {} } = {}) {
  if (!button) return { destroy() {} };

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const label = button.querySelector('.music-label');
  let context;
  let master;
  let compressor;
  let filter;
  let delay;
  let feedback;
  let wet;
  let scheduler;
  let suspendTimer;
  let desired = false;
  let destroyed = false;
  let generation = 0;
  let step = 0;
  let nextTime = 0;
  const voices = new Set();
  const beat = 60 / 68;
  // Am9 → Fmaj7 → Cmaj9 → G6. A gentle eight-bar repeating phrase.
  const chords = [
    [45, 52, 57, 60, 64, 71],
    [41, 48, 53, 57, 60, 64],
    [48, 55, 60, 64, 67, 74],
    [43, 50, 55, 59, 62, 64],
  ];
  const arpeggio = [2, 4, 3, 5, 4, 3, 2, 4, 3, 5, 4, 2, 3, 4, 5, 4];

  function update(playing, text) {
    button.dataset.playing = String(playing);
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'Pause our soundtrack' : 'Play our soundtrack');
    if (label) label.textContent = text || (playing ? 'Pause our soundtrack' : 'Play our soundtrack');
  }

  function initialize() {
    if (context) return;
    if (!AudioContextClass) throw new Error('This browser does not support the ambient soundtrack.');
    context = new AudioContextClass();
    master = context.createGain();
    master.gain.value = 0;
    compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 4;
    filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2200;
    filter.Q.value = 0.4;
    delay = context.createDelay(2);
    delay.delayTime.value = beat * 0.75;
    feedback = context.createGain();
    feedback.gain.value = 0.24;
    wet = context.createGain();
    wet.gain.value = 0.18;
    filter.connect(master);
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    master.connect(compressor);
    compressor.connect(context.destination);
  }

  function note(midi, time, duration, volume, pad = false) {
    const envelope = context.createGain();
    const fundamental = context.createOscillator();
    const overtone = context.createOscillator();
    const overtoneGain = context.createGain();
    const frequency = 440 * 2 ** ((midi - 69) / 12);
    fundamental.type = 'sine';
    fundamental.frequency.value = frequency;
    overtone.type = pad ? 'sine' : 'triangle';
    overtone.frequency.value = pad ? frequency * 1.0015 : frequency * 2;
    overtoneGain.gain.value = pad ? 0.22 : 0.065;
    fundamental.connect(envelope);
    overtone.connect(overtoneGain);
    overtoneGain.connect(envelope);
    envelope.connect(filter);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(volume, time + (pad ? 1.1 : 0.018));
    if (pad) {
      envelope.gain.setValueAtTime(volume, time + duration - 1.4);
    } else {
      envelope.gain.exponentialRampToValueAtTime(volume * 0.25, time + 0.5);
    }
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    const voice = { fundamental, overtone, overtoneGain, envelope };
    voices.add(voice);
    fundamental.onended = () => {
      fundamental.disconnect();
      overtone.disconnect();
      overtoneGain.disconnect();
      envelope.disconnect();
      voices.delete(voice);
    };
    fundamental.start(time);
    overtone.start(time);
    fundamental.stop(time + duration + 0.02);
    overtone.stop(time + duration + 0.02);
  }

  function schedule() {
    if (!desired || destroyed || context.state !== 'running') return;
    // Do not replay a backlog if the browser temporarily throttles this tab.
    if (nextTime < context.currentTime) nextTime = context.currentTime + 0.04;
    while (nextTime < context.currentTime + 0.25) {
      const chord = chords[Math.floor(step / 16) % chords.length];
      const localStep = step % 16;
      if (localStep === 0) {
        for (const pitch of chord.slice(0, 4)) note(pitch, nextTime, beat * 8 - 0.05, 0.043, true);
      }
      note(chord[arpeggio[localStep]] + 12, nextTime, 2.3, localStep % 4 === 0 ? 0.16 : 0.105);
      nextTime += beat / 2;
      step += 1;
    }
  }

  function stop() {
    clearInterval(scheduler);
    clearTimeout(suspendTimer);
    scheduler = undefined;
    update(false);
    if (!context || context.state === 'closed') return;
    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(0, now, 0.018);
    for (const voice of voices) {
      try {
        voice.fundamental.stop(now + 0.07);
        voice.overtone.stop(now + 0.07);
      } catch { /* A voice may already have ended. */ }
    }
    const token = generation;
    suspendTimer = setTimeout(() => {
      if (!desired && !destroyed && token === generation && context.state !== 'closed') {
        context.suspend().catch(() => {});
      }
    }, 110);
  }

  function fail(error) {
    desired = false;
    generation += 1;
    stop();
    update(false, 'Sound unavailable');
    onError(error);
  }

  async function toggle() {
    if (destroyed) return;
    desired = !desired;
    const token = ++generation;
    clearTimeout(suspendTimer);
    if (!desired) {
      stop();
      return;
    }
    try {
      initialize();
      await context.resume();
      if (!desired || destroyed || token !== generation) return;
      if (context.state !== 'running') throw new Error('Tap the soundtrack button again to enable audio.');
      step = 0;
      nextTime = context.currentTime + 0.06;
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(0.32, context.currentTime, 0.5);
      update(true);
      clearInterval(scheduler);
      schedule();
      scheduler = setInterval(() => {
        try { schedule(); } catch (error) { fail(error); }
      }, 100);
    } catch (error) {
      if (token === generation && !destroyed) fail(error);
    }
  }

  function visibilityChange() {
    if (document.hidden && desired) {
      desired = false;
      generation += 1;
      stop();
    }
  }

  update(false);
  button.addEventListener('click', toggle);
  document.addEventListener('visibilitychange', visibilityChange);

  return {
    destroy() {
      if (destroyed) return;
      desired = false;
      generation += 1;
      stop();
      destroyed = true;
      clearTimeout(suspendTimer);
      button.removeEventListener('click', toggle);
      document.removeEventListener('visibilitychange', visibilityChange);
      if (context && context.state !== 'closed') context.close().catch(() => {});
      for (const voice of voices) {
        voice.fundamental.disconnect();
        voice.overtone.disconnect();
        voice.overtoneGain.disconnect();
        voice.envelope.disconnect();
      }
      voices.clear();
    },
  };
}
