//take this out after
const ko = require('knockout');

/*
obj is the core object and everythin will extend it
*/
class Obj{
    constructor(parent, x, y, h, w){
        //the parent will dictate it's position in he tree
        this.parent = parent;
        //The properties are values that can be change by the user
        this.properties = {
          "position" : ko.observable([x, y]),
          "dimensions" : ko.observable([h, w])
        }
        //this will add an observable property
        this.addProperty = (name) => {
            this.properties[name] = ko.observable()
        }
        //this will write to an observable property
        this.writeProperty = (property, value) => {
            this.properties[name](value);
        }
        //this will read an observable property
        this.readProperty = (property) => {
            this.properties[property]();
        }
        //a list of custom listeners
        this.listeners = {};

        //add a listener to the list
        this.addListener = (property, name) => {
            this.listeners[name].listener = this.properties[property].subscribe((newValue) => {
              this.listeners[name].onEvent();
            })
            this.listeners[name].onEvent = eval("() => console.log(0)");
        }

    }
}



/**
 * @param {object} parent test
 */

class Canvas extends Obj {
    constructor(parent, w, h, vh, hh){
        super(parent);
        this.properties = {
          "dimensions" : ko.observable([w, h]),
          "unitDimentions" : ko.observable([hh, vh])

        }
    }
}


/**
 * @todo create this object
 */

class Entity extends Obj {
    constructor(parent, x, y, h, w, health){
      super(parent, h, w)
      this.properties = {
        "health" : ko.observable(health),
        "alive" : ko.observable(this.properties["health"] > 0 ? true : false),
        "position" : ko.observable([x, y]),
        "dimensions" : ko.observable([h, w]),
        "animationFrames" : null
      }

      this.listeners = {
        "onDeath" : {
          "listener" : this.properties["health"].subscribe((newValue) => {
            if(newValue <= 0){
              this.listeners["onDeath"].onEvent()
            }
          }),
          "onEvent" : eval("() => console.log(0)")
        },

        "onMove" : {
          "listener" : this.properties["position"].subscribe((newValue) => {
              eval(this.listeners["onMove"].onEvent);
          }),
          "onEvent" : eval("() => console.log(0)")
        }
      }
    }
}

/**
 * @todo create this object
 */

class event extends Obj {

}

// let person = {
//     name : ko.observable('jeremy'),
//     age : ko.observable(17)
// }

// person.name.subscribe((newValue) => {
//     console.log(`new Value ${newValue}`);
// })

// person.name("lizzie");

let test = new Entity("this should be parent", "this should be x", "this should be y", "this should be h", "this should be health")
console.log(test);
