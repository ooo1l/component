export function createElement(Cls, attributes, ...Children) {
  let o;
  if (typeof Cls === "string") {
    o = new Wrapper(Cls);
  } else {
    o = new Cls({ timer: {} });
  }

  for (let name in attributes) {
    o.setAttribute(name, attributes[name]);
  }

  let visit = (Children) => {
    for (let child of Children) {
      if (typeof child === "string") {
        // 文字
        child = new Text(child);
      } else if (typeof child === "object" && child instanceof Array) {
        visit(child);
        continue;
      }
      o.appendChild(child);
    }
  };

  visit(Children);

  return o;
}

class Text {
  constructor(text) {
    this.children = [];
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class Wrapper {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }

  setAttribute(name, value) {
    // attribute
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    this.children.push(child);
  }

  addEventListener() {
    this.root.addEventListener(...arguments);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }

  get style () {
      return this.root.style
  }
}