var choo = require('choo')
var html = require('choo/html')
var Component = require('nanocomponent')

class Modal extends Component {
  constructor (opts = {}) {

    super(opts)
  }

  createElement () {
    return html`<div></div>`
  }
}

var modal = new Modal()

var app = choo()

app.route('/', function (state, emit) {
  return html`
    <body>${modal.render()}</body>`
})

app.mount('body')
