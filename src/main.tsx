import SusFormElement from './SusFormElement';

if (typeof window !== 'undefined') {
  if (!customElements.get('emoframe-mf-sus')) {
    customElements.define('emoframe-mf-sus', SusFormElement);
  }
}
