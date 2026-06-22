import { createRoot, type Root } from 'react-dom/client';
import SusFormApp from './SusFormApp';

class SusFormElement extends HTMLElement {
  private reactRoot: Root | null = null;
  private container: HTMLDivElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.container = document.createElement('div');
    this.shadowRoot?.appendChild(this.container);
  }

  static get observedAttributes() {
    return ['evaluation-id', 'user-id'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }
  }

  private render() {
    if (!this.reactRoot) {
      this.reactRoot = createRoot(this.container);
    }

    this.reactRoot.render(
      <SusFormApp onComplete={(payload) => this.dispatchComplete(payload)} />
    );
  }

  private dispatchComplete(payload: any) {
    const event = new CustomEvent('sus-completed', {
      detail: { ...payload, evaluationId: this.getAttribute('evaluation-id'), userId: this.getAttribute('user-id') },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

export default SusFormElement;
