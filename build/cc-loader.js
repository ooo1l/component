var parser = require('./parser/parser.js')

module.exports = function (source, map) {
    
    let tree = parser.parseHTML(source)
    // console.log("my cc-loader is running!!!!", this.resourcePath);


    // 从tree上面生成组件的代码
    let template = null
    let script = null

    for(let node of tree.children) {
        if(node.tagName === 'template') {
            template = node.children.filter(e => e.type != 'text')[0]
        } else if (node.tagName === 'script') {
            script = node.children[0].content
        }
    }
    // console.log(template)
    // console.log(script)

    let createCode = ''
    let visit = (node) => {
        if (node.type === 'text') {
            return JSON.stringify(node.content)
        }
        let attrs = {}
        for(let attribute of node.attributes) {
            attrs[attribute.name] = attribute.value
        }
        let children = node.children.map(node => visit(node))
        return `createElement("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`
    }

    let temp_string = `
import {createElement} from '../jsx/createElement.js'
export class Carousel2 {
    setAttribute(name, value) {
        this[name] = value
    }
    render() {
        return ${visit(template)}
    }
    mountTo(parent){
        this.render().mountTo(parent)
    }
}
    `;
    console.log(temp_string)
    return temp_string
}