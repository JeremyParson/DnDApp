// take this out after
// const ko = require('knockout')

/*
obj is the core object and everything will extend it
*/
class Obj {
	constructor(parent, x, y, w, h) {
		// the parent will dictate it's position in he tree
		this.parent = parent
		// The properties are values that can be change by the user
		this.properties = {
			'position': ko.observable([x, y]),
			'dimensions': ko.observable([w, h]),
			'animationFrames': null,
			'selected': false
		}
		// this will add an observable property
		this.addProperty = (property, initValue) => {
			this.properties[property] = ko.observable(initValue || null)
		}
		// this will write to an observable property
		this.writeProperty = (property, value) => {
			this.properties[property](value)
		}
		// this will read an observable property
		this.readProperty = (property) => {
			this.properties[property]()
		}
		// a list of custom listeners
		this.listeners = {

		}

		this.checkInteract = () => {
			var hit = false
			hit = collidePointRect(mouseX, mouseY, this.properties.position()[0], this.properties.position()[1], this.properties.dimensions()[0], this.properties.dimensions()[1]) // see if the mouse is in the rect
			if (hit) { // if its inside fire the callback
				return this;
			} else {
				return false;
			}
		}


		// add a listener to the list
		this.addListener = (property, name, onEvent) => {
			this.listeners[name] = {
				'listener': this.properties[property].subscribe((newValue) => {
					this.listeners[name].onEvent(newValue)
				}),

				'onEvent': eval(onEvent)
			}
		}

        //create animation for p5 to render
		this.createAnimation = (...frames) => {
			let str = 'loadAnimation('
			frames.forEach(element => {
				str += `"${element}",`
			})
			str = str.substr(0, str.length - 1)
			str += ')'
			console.log(str)
			this.properties.animationFrames = eval(str)
		}

        //render animation
		this.render = () => {
			this.properties.animationFrames !== undefined || null ?
				animation(this.properties.animationFrames, this.properties.position()[0] + (this.properties.dimensions()[0] / 2), this.properties.position()[1] + (this.properties.dimensions()[1] / 2)) :
				console.log('object does not have animation frames')

			if (this.properties.selected) {
                stroke(255, 204, 100)
                noFill()
				rect(this.properties.position()[0], this.properties.position()[1], this.properties.dimensions()[0], this.properties.dimensions()[1])
			}
		}
	}
}

/**
 * @param {object} parent test
 */

class Canvas extends Obj {
	constructor(parent, x, y, w, h, vu, hu) {
		super(parent, x, y, w, h)
		this.initDim = () => {
			let array = new Array(x)
			for (let xi = 0; xi < x; xi++) {
				array[xi] = new Array(y)
			}
			return array
		}

		this.properties['unitDimentions'] = ko.observable([hu, vu])
		this.properties['contents'] = this.initDim()

		this.render = () => {
			if (this.properties.selected) {
				stroke(255, 204, 100)
			}else{
                stroke(0,0,0)
            }

			for (var x = 0; x < this.properties.dimensions()[0] / this.properties.unitDimentions()[0]; x++) {
				for (var y = 0; y < this.properties.dimensions()[1] / this.properties.unitDimentions()[1]; y++) {
					noFill()
					rect((x * 62) + this.properties.position()[0], (y * 62) + this.properties.position()[1], 62, 62)
				}
			}
		}
	}
}

/**
 * @todo create this object
 */

class Entity extends Obj {
	constructor(parent, x, y, w, h, health) {
		super(parent, x, y, h, w)

		this.properties['health'] = ko.observable(health)
		this.properties['alive'] = ko.observable(this.properties['health'] > 0 ? true : false)

		this.listeners['onDeath'] = {
			'listener': this.properties['health'].subscribe((newValue) => {
				if (newValue <= 0) {
					this.listeners['onDeath'].onEvent(newValue)
				}
			}),
			'onEvent': eval('() => console.log(0)')
		}

		this.listeners['onMove'] = {
			'listener': this.properties['position'].subscribe((newValue) => {
				this.listeners['onMove'].onEvent(newValue)
			}),
			'onEvent': eval('() => console.log(0)')
		}
	}
}

/**
 * @todo create this object
 */

class event extends Obj {

}

// let test = new Entity('this should be parent', 'this should be x', 'this should be y', 'this should be h', 'this should be health')
// test.addProperty('greaterthan1', 300)

// console.log(test)

// test.addListener('greaterthan1', 'lessThan1', `
// (newValue) => {
//     if(newValue < 1){
//         console.log("newValue is less than 1 " + newValue)
//     }
// }
// `)

// console.log("added event listener")
// console.log("changed property too -100")

// test.writeProperty('greaterthan1',-100)

// let canvas = new Canvas(null, 10, 10, null, null, null, null)

function rectButton(x, y, w, h, callback) {
	var hit = false

	hit = collidePointRect(mouseX, mouseY, x, y, w, h) // see if the mouse is in the rect

	if (hit) { // if its inside fire the callback
		console.log('hit')
		callback(hit)
	} else {
		console.log('miss', x, y, w, h)
	}
}