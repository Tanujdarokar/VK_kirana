// Kirana AI Assistant Floating Widget & Hinglish Grocery Parser

import { store } from './store.js';
import { parseMultiLineGroceryList } from './data/aiAssistant.js';

export function initAiWidget() {
  renderAiWidget();
  setupAiListeners();
}

function renderAiWidget() {
  const container = document.createElement('div');
  container.id = 'kirana-ai-widget-root';
  container.innerHTML = `
    <!-- Floating Trigger Button -->
    <button id="kirana-ai-btn" class="kirana-ai-floating-btn" aria-label="Open AI Assistant">
      <div style="width: 26px; height: 26px; border-radius: 50%; background: #facc15; color: #064e3b; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.9rem;">
        🤖
      </div>
      <div style="text-align: left; line-height: 1.1;">
        <div style="font-weight: 800; font-size: 0.9rem;">Kirana AI Assistant</div>
        <div style="font-size: 0.7rem; color: #a7f3d0;">Voice & Hinglish List</div>
      </div>
    </button>

    <!-- AI Assistant Modal Dialog -->
    <div id="kirana-ai-modal" class="modal-backdrop" style="display: none;">
      <div class="modal-card" style="max-width: 560px; padding: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #059669; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              🤖
            </div>
            <div>
              <h3 style="font-size: 1.2rem; color: #0f172a;">Smart Kirana AI Assistant</h3>
              <p style="font-size: 0.78rem; color: #64748b;">Speak or paste raw Hinglish grocery lists</p>
            </div>
          </div>
          <button id="close-ai-modal-btn" class="btn-icon">✕</button>
        </div>

        <!-- Sample List Chips -->
        <div style="margin-bottom: 14px;">
          <div style="font-size: 0.78rem; font-weight: 700; color: #64748b; margin-bottom: 6px;">Try Example Shopping Lists:</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="ai-chip-sample btn btn-secondary btn-sm" data-text="2 packet doodh, 5kg atta, 1kg chini, 1 tata salt">
              🥛 Daily Nashta & Staples
            </button>
            <button class="ai-chip-sample btn btn-secondary btn-sm" data-text="1kg toor dal, 1L fortune oil, 1 haldi powder, 1 red chilli">
              🍛 Dal & Tadka Masala
            </button>
            <button class="ai-chip-sample btn btn-secondary btn-sm" data-text="2 parle-g, 1 britannia good day, 1 amul butter, 1 tata tea">
              ☕ Evening Chai & Biscuits
            </button>
          </div>
        </div>

        <!-- Text Input & Voice Simulation -->
        <div style="margin-bottom: 16px; position: relative;">
          <textarea
            id="ai-prompt-input"
            rows="3"
            placeholder="Type or paste your grocery list here... (e.g. '2 packet doodh, 5kg aata, 1kg chini, 1 packet tata tea')"
            style="width: 100%; padding: 12px; border-radius: 12px; font-size: 0.92rem; border: 1.5px solid #cbd5e1; resize: none;"
          ></textarea>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <button id="ai-mic-btn" class="btn btn-outline btn-sm" style="color: #059669; border-color: #059669;">
              🎙️ Speak List (Voice)
            </button>

            <button id="ai-parse-btn" class="btn btn-primary" style="padding: 8px 18px;">
              ⚡ Parse Grocery List
            </button>
          </div>
        </div>

        <!-- Parsed Results Container -->
        <div id="ai-parsed-results" style="display: none; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a;">
              Found Items (<span id="ai-found-count">0</span>):
            </div>
            <button id="ai-add-all-btn" class="btn btn-primary btn-sm">
              🛒 Add All to Cart (<span id="ai-total-price">₹0</span>)
            </button>
          </div>

          <div id="ai-items-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 240px; overflow-y: auto;">
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);
}

function setupAiListeners() {
  const triggerBtn = document.getElementById('kirana-ai-btn');
  const modal = document.getElementById('kirana-ai-modal');
  const closeBtn = document.getElementById('close-ai-modal-btn');
  const promptInput = document.getElementById('ai-prompt-input');
  const parseBtn = document.getElementById('ai-parse-btn');
  const micBtn = document.getElementById('ai-mic-btn');
  const resultsDiv = document.getElementById('ai-parsed-results');
  const itemsList = document.getElementById('ai-items-list');
  const foundCount = document.getElementById('ai-found-count');
  const totalPriceEl = document.getElementById('ai-total-price');
  const addAllBtn = document.getElementById('ai-add-all-btn');

  let currentParsedItems = [];

  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  // Sample list chips
  document.querySelectorAll('.ai-chip-sample').forEach(chip => {
    chip.addEventListener('click', () => {
      promptInput.value = chip.getAttribute('data-text');
      parseBtn.click();
    });
  });

  // Voice simulation / Web Speech API
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN';
        recognition.start();
        micBtn.textContent = '🔴 Listening... Bolte Jaiye';

        recognition.onresult = (event) => {
          const spoken = event.results[0][0].transcript;
          promptInput.value = spoken;
          micBtn.textContent = '🎙️ Speak List (Voice)';
          parseBtn.click();
        };

        recognition.onerror = () => {
          micBtn.textContent = '🎙️ Speak List (Voice)';
          store.showToast('Could not access microphone. You can type in the box below!', 'info');
        };
      } else {
        // Fallback demo simulation
        promptInput.value = '2 packet amul milk, 1kg tata salt, 5kg fortune chakki atta';
        store.showToast('Voice typing simulation activated!');
        parseBtn.click();
      }
    });
  }

  // Parse action
  if (parseBtn) {
    parseBtn.addEventListener('click', () => {
      const text = promptInput.value.trim();
      if (!text) {
        store.showToast('Please type or speak grocery items first!', 'error');
        return;
      }

      const products = store.getProducts();
      const parsed = parseMultiLineGroceryList(text, products);

      if (!parsed || parsed.length === 0) {
        resultsDiv.style.display = 'block';
        itemsList.innerHTML = `
          <div style="padding: 16px; text-align: center; color: #64748b; font-size: 0.9rem;">
            No direct matches found. Try items like "doodh", "atta", "tel", "toor dal", "namak".
          </div>
        `;
        foundCount.textContent = '0';
        totalPriceEl.textContent = '₹0';
        currentParsedItems = [];
        return;
      }

      currentParsedItems = parsed;
      foundCount.textContent = parsed.length;

      const total = parsed.reduce((sum, item) => {
        const price = item.product.discountPrice || item.product.price;
        return sum + price * (item.quantity || 1);
      }, 0);
      totalPriceEl.textContent = `₹${total}`;

      itemsList.innerHTML = parsed.map(item => {
        const p = item.product;
        const price = p.discountPrice || p.price;
        return `
          <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <img src="${p.image}" alt="${p.name}" style="width: 38px; height: 38px; object-fit: cover; border-radius: 6px;" />
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 0.86rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${p.name}
              </div>
              <div style="font-size: 0.78rem; color: #64748b;">
                ₹${price} × ${item.quantity || 1} • ${p.unit}
              </div>
            </div>
            <span style="font-weight: 800; color: #059669; font-size: 0.9rem;">
              ₹${price * (item.quantity || 1)}
            </span>
          </div>
        `;
      }).join('');

      resultsDiv.style.display = 'block';
    });
  }

  // Add all to cart
  if (addAllBtn) {
    addAllBtn.addEventListener('click', () => {
      if (currentParsedItems.length === 0) return;
      currentParsedItems.forEach(item => {
        store.addToCart(item.product, item.quantity || 1);
      });
      modal.style.display = 'none';
      store.showToast(`Added ${currentParsedItems.length} items from AI list to Cart!`);
    });
  }
}
