/**
 * Robust Web Speech API Service for Reading Books & Pronunciation
 * Features:
 * - Sentence-by-sentence chunking to prevent Chrome 15-second speech cutoff bug
 * - Real-time active sentence highlighting (karaoke style) for ELL / ESL students
 * - Asynchronous voice discovery with UK & US English voice preference
 * - Keep-alive timer to prevent browser audio pause
 * - Play, pause, resume, stop, skip sentence forward/backward, and speed controls
 */

export interface SpeechStatus {
  speaking: boolean;
  paused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  currentSentenceText: string;
  rate: number;
  selectedVoiceName: string;
}

type SpeechListener = (status: SpeechStatus) => void;

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private sentences: string[] = [];
  private currentIndex = 0;
  private rate = 0.9;
  private pitch = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  private isSpeaking = false;
  private isPaused = false;
  private keepAliveTimer: number | null = null;

  private listeners: Set<SpeechListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
    }
  }

  private initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      this.voices = this.synth!.getVoices();
      if (this.voices.length > 0) {
        // Exclusively select Google US English (en-US) or best en-US fallback
        const googleUsVoice = this.voices.find(
          v => (v.name.includes('Google') && (v.lang === 'en-US' || v.lang === 'en_US')) ||
               v.name.toLowerCase().includes('google us english')
        );
        const usVoice = this.voices.find(v => v.lang === 'en-US' || v.lang === 'en_US');
        const enVoice = this.voices.find(v => v.lang.startsWith('en'));

        this.selectedVoice = googleUsVoice || usVoice || enVoice || this.voices[0];
      }
      this.notify();
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.synth && this.voices.length === 0) {
      this.voices = this.synth.getVoices();
      if (!this.selectedVoice && this.voices.length > 0) {
        const enVoices = this.voices.filter(v => v.lang.startsWith('en'));
        this.selectedVoice = enVoices[0] || this.voices[0];
      }
    }
    return this.voices.filter(v => v.lang.startsWith('en'));
  }

  public setVoiceByName(voiceName: string) {
    const found = this.voices.find(v => v.name === voiceName);
    if (found) {
      this.selectedVoice = found;
      this.notify();
    }
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, newRate));
    this.notify();
    // If currently speaking, restart current sentence with new rate
    if (this.isSpeaking && !this.isPaused) {
      this.speakCurrentSentence();
    }
  }

  public subscribe(listener: SpeechListener) {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getStatus(): SpeechStatus {
    return {
      speaking: this.isSpeaking,
      paused: this.isPaused,
      currentSentenceIndex: this.currentIndex,
      totalSentences: this.sentences.length,
      currentSentenceText: this.sentences[this.currentIndex] || '',
      rate: this.rate,
      selectedVoiceName: this.selectedVoice?.name || 'Default English Voice'
    };
  }

  private notify() {
    const status = this.getStatus();
    this.listeners.forEach(cb => cb(status));
  }

  /**
   * Split full text into meaningful natural sentences for smooth playback
   */
  private splitIntoSentences(text: string): string[] {
    const clean = text
      .replace(/[*_#`]/g, '')
      .replace(/\r\n/g, '\n');

    // Split by date headers or sentence-ending punctuation
    const rawChunks = clean.split(/(?<=[.?!])\s+|\n+/);
    const result: string[] = [];

    for (const chunk of rawChunks) {
      const trimmed = chunk.trim();
      if (trimmed.length > 0) {
        // If a chunk is very long (> 200 chars), split by commas or semicolons
        if (trimmed.length > 250) {
          const subparts = trimmed.split(/(?<=[,;:])\s+/);
          subparts.forEach(sp => {
            if (sp.trim()) result.push(sp.trim());
          });
        } else {
          result.push(trimmed);
        }
      }
    }

    return result.length > 0 ? result : [text];
  }

  public speak(fullText: string, rate?: number) {
    this.playBook(fullText, 0, rate);
  }

  public playFromText(fullText: string, searchSubstring: string, rate?: number) {
    if (!this.synth) return;
    this.stop();
    if (rate !== undefined) {
      this.rate = rate;
    }
    this.sentences = this.splitIntoSentences(fullText);
    const searchTarget = searchSubstring.trim().toLowerCase();
    let foundIndex = 0;
    for (let i = 0; i < this.sentences.length; i++) {
      const s = this.sentences[i].toLowerCase();
      if (searchTarget.includes(s) || s.includes(searchTarget.slice(0, 15)) || searchTarget.slice(0, 20).includes(s.slice(0, 10))) {
        foundIndex = i;
        break;
      }
    }
    this.currentIndex = foundIndex;
    this.isSpeaking = true;
    this.isPaused = false;
    this.startKeepAlive();
    this.speakCurrentSentence();
  }

  public playBook(fullText: string, startIndex = 0, rate?: number) {
    if (!this.synth) return;

    this.stop();

    if (rate !== undefined) {
      this.rate = rate;
    }

    this.sentences = this.splitIntoSentences(fullText);
    this.currentIndex = Math.max(0, Math.min(startIndex, this.sentences.length - 1));
    this.isSpeaking = true;
    this.isPaused = false;

    this.startKeepAlive();
    this.speakCurrentSentence();
  }

  public playSentenceAtIndex(index: number) {
    if (!this.synth || this.sentences.length === 0) return;
    this.currentIndex = Math.max(0, Math.min(index, this.sentences.length - 1));
    this.isSpeaking = true;
    this.isPaused = false;
    this.speakCurrentSentence();
  }

  public skipNext() {
    if (this.currentIndex < this.sentences.length - 1) {
      this.currentIndex++;
      this.speakCurrentSentence();
    } else {
      this.stop();
    }
  }

  public skipPrev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.speakCurrentSentence();
    } else {
      this.speakCurrentSentence();
    }
  }

  private speakCurrentSentence() {
    if (!this.synth || !this.isSpeaking) return;

    this.synth.cancel();

    const sentence = this.sentences[this.currentIndex];
    if (!sentence) {
      this.stop();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'en-US';
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notify();
    };

    utterance.onend = () => {
      if (!this.isSpeaking || this.isPaused) return;

      if (this.currentIndex < this.sentences.length - 1) {
        this.currentIndex++;
        // Small brief pause (150ms) between sentences for pleasant story rhythm
        setTimeout(() => {
          if (this.isSpeaking && !this.isPaused) {
            this.speakCurrentSentence();
          }
        }, 150);
      } else {
        this.stop();
      }
    };

    utterance.onerror = (e) => {
      // Ignore interrupted cancels
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.warn('Speech synthesis error:', e);
      if (this.currentIndex < this.sentences.length - 1) {
        this.currentIndex++;
        this.speakCurrentSentence();
      } else {
        this.stop();
      }
    };

    this.synth.speak(utterance);
    this.notify();
  }

  public pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.isSpeaking && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    this.stopKeepAlive();
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.notify();
  }

  /**
   * Speak an individual word or phrase (for vocab cards / word tooltips)
   */
  public speakWord(word: string) {
    if (!this.synth) return;

    // Do not disrupt book playback if currently listening, or play short one-off
    const cleanWord = word.replace(/[*_#`]/g, '').trim();
    if (!cleanWord) return;

    const utterance = new SpeechSynthesisUtterance(cleanWord);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    this.synth.speak(utterance);
  }

  /**
   * Keep-alive routine to prevent Chromium from timing out on SpeechSynthesis
   */
  private startKeepAlive() {
    this.stopKeepAlive();
    if (typeof window !== 'undefined') {
      this.keepAliveTimer = window.setInterval(() => {
        if (this.synth && this.isSpeaking && !this.isPaused) {
          this.synth.pause();
          this.synth.resume();
        }
      }, 10000);
    }
  }

  private stopKeepAlive() {
    if (this.keepAliveTimer !== null) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }
}

export const speechService = new SpeechService();
