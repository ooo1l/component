function createElement (Cls, attributes, ...Children) {
    console.log(Cls)
    let o
    if (typeof Cls === 'string') {
        o = new Wrapper(Cls);
    } else {
        o = new Cls({timer: {}})
    }

    for(let name in attributes) {
        o.setAttribute(name, attributes[name])
    }
    for(let child of Children) {
        if (typeof child === 'string') {
            // 文字
            child = new Text(child)
        }
        o.appendChild(child)
    }
    return o
}

class Text {
    constructor(text) {
        this.children = []
        this.root = document.createTextNode(text)
    }
    mountTo(parent) {
        parent.appendChild(this.root)
    }
}

class Wrapper {
    constructor (type) {
        this.children = []
        this.root = document.createElement(type);
    }

    setAttribute(name, value) { // attribute
        this.root.setAttribute(name, value)
    }

    appendChild(child) {
        this.children.push(child)
    }

    mountTo (parent) {
        parent.appendChild(this.root)
        for(let child of this.children) {
            child.mountTo(this.root);
        }
    }
}

class MyComponent {
    constructor (config) {
        this.children = []
    }

    setAttribute(name, value) { // attribute
        this.root.setAttribute(name, value)
    }

    appendChild(child) {
        this.children.push(child)
    }

    render() {
        return <article>
            <header>I am a header</header>
            {this.slot}
            <footer>i am a footer</footer>  
        </article>
    }

    mountTo (parent) {
        this.slot = <div></div>
        for(let child of this.children) {
            this.slot.appendChild(child)
        }
        this.render().mountTo(parent);
    }
}


// let component = (
//   <Div id="a" class="b" style="width: 100px;height:100px;background: blue;">
//     <Div></Div>
//     <p>ccc1l</p>
//     <Div></Div>
//   </Div>
// );

let component = (
  <MyComponent>
    <p> text text text</p>
  </MyComponent>
);
component.mountTo(document.body)