class AIReceptionistWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.vapiInstance = null;
    this.isActive = false;
  }

  connectedCallback() {
    this.apiKey = this.getAttribute('api-key') || '';
    this.assistantId = this.getAttribute('assistant-id') || '';
    this.render();
    this.loadVapi();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .receptionist-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background-color: #8A2BE2;
          color: white;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          transition: all 0.3s ease;
        }
        .receptionist-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        .receptionist-btn.active {
          background-color: #ef4444;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .icon {
          width: 32px;
          height: 32px;
          fill: currentColor;
        }
      </style>
      <button class="receptionist-btn" id="call-btn">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
        </svg>
      </button>
    `;

    this.button = this.shadowRoot.getElementById('call-btn');
    this.button.addEventListener('click', () => this.toggleCall());
  }

  loadVapi() {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.onload = () => {
      this.vapiInstance = window.vapiSDK.run({
        apiKey: this.apiKey,
      });
    };
    document.body.appendChild(script);
  }

  toggleCall() {
    if (!this.vapiInstance) return;

    if (this.isActive) {
      this.vapiInstance.stop();
      this.isActive = false;
      this.button.classList.remove('active');
    } else {
      this.vapiInstance.start(this.assistantId);
      this.isActive = true;
      this.button.classList.add('active');
    }
  }
}

customElements.define('ai-receptionist', AIReceptionistWidget);