import { html, LitElement } from 'https://unpkg.com/lit?module';

class MyTree extends LitElement {
  static properties = {
    treeData: { type: Object },
  };

  constructor() {
    super();
    this.treeData = {
      "id": 1,
      "items": [
        {
          "id": 2,
          "items": [
            { "id": 1 }, 
            { "id": 2 }
          ]
        }, 
        {
          "id": 3,
          "items": [
            { "id": 1 },
            {
              "id": 4,
              "items": [
                { "id": 1 }, 
                { "id": 2 }
              ]
            }, 
          ]
        }
      ]
    };
  }

  render() {
    return html`
      <ul>
        ${this.renderTree(this.treeData)}
      </ul>
    `;
  }

  renderTree(data) {
    return html`
      <li>
        <span>${data.id}</span>
        ${
          (data.items && data.items.length > 0)
          ? html`
              <ul>
                ${data.items.map((item) => html`<my-tree .treeData=${item}></my-tree>`)}
              </ul>
            `
          : ''
        }
      </li>
    `;
  }
}

class MyLeaf extends LitElement {
  static properties = {
    leafData: { type: Number },
  };

  constructor() {
    super();
    this.leafData = 0;
  }

  render() {
    return html`
      <li>
        <span>${this.leafData}</span>
      </li>
    `;
  }
}

customElements.define('my-tree', MyTree);
customElements.define('my-leaf', MyLeaf);
