import { createRoot, type Root } from 'react-dom/client';
import SusFormApp from './SusFormApp';

class SusFormElement extends HTMLElement {
  private root: Root | null = null;
  private mountPoint: HTMLDivElement | null = null;

  static get observedAttributes() {
    return ['evaluation-id', 'user-id'];
  }

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    this.root = createRoot(this.mountPoint);
    this.renderReact();
  }

  attributeChangedCallback() {
    this.renderReact();
  }

  disconnectedCallback() {
    this.root?.unmount();
  }

  private renderReact() {
    if (!this.root) return;
    const evaluationId = this.getAttribute('evaluation-id') || '';
    const userId = this.getAttribute('user-id') || '';

    this.root.render(
      <SusFormApp
        evaluationId={evaluationId}
        userId={userId}
      />
    );
  }
}

export default SusFormElement;
