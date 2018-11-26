const jQuery = require('jquery');

//some test objects to play with
let testObject = new Entity(null, 200, 200, 45, 45);
let canvas2 = new Canvas(null, 60, 60, 100, 100, 10, 10);

const builderStates = {
    "default":0,
    "animationFrames":1
}

let currentState = builderStates.default;

//the objArr "object array" will contain all objects withtin the project
let objArr = [testObject,canvas2];

//the selected object will determine what object is currently being edited
let selected = ko.observable(null)
//this will highlight the current selected object
selected.subscribe((newValue) => {
    newValue.properties.selected = true
})
//this will unhighlight the previous object
selected.subscribe((oldValue) => {
    oldValue ?
    oldValue.properties.selected = false
    :false
},null, 'beforeChange')

//load test object's animation
function preload(){
    testObject.createAnimation("../../GFX/Animations/Calavair/tile000.png",
"../../GFX/Animations/Calavair/tile003.png")
}

console.log(testObject, canvas2);

//setup canvas
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(51);
    let parent = document.getElementById('canvas');
    let canvas = document.getElementById('defaultCanvas0');
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    parent.append(canvas);
}

//detect when mouse is pressed
function mousePressed() {

    //makes sure that the previouse object is nolonger highlighted
    if(selected() != null){
        selected().properties.selected = false;
    }

    //scan through all objects within the project to find out which one is being selected
    objArr.forEach(element => {
        if(element.checkInteract() != false){
            selected(element)
            reconstructProperties()
        }
    });
}

//detec if mouse is being dragged
function mouseDragged() {
    //if mouse is being dragged update selected objects position
    objArr.forEach(element => {
        if(element.checkInteract() != false){
            element.properties.position([mouseX - (element.properties.dimensions()[0] / 2), mouseY - (element.properties.dimensions()[1] / 2)]);
        }
    });
}

//render everything in the objArray
function draw(){
    background(51);
    objArr.forEach(element => {
        element.render()
    });
}

//initialize the object tree
jQuery('#html1').jstree();


//this function will recostruct the properties panel when a new object is selected
function reconstructProperties(){
    //get properties panel
    let properties = document.getElementById("properties")
    //empty whatever is already inside it
    properties.innerHTML = '';

    //get all properties from selected object
    Object.keys(selected().properties).forEach((key) => {
        //create an individual div for a property
        let property = document.createElement('div')
        property.className = "property";
        //set title of property div and append it
        let title = document.createElement('h3')
        title.textContent = key
        property.appendChild(title);
        /*create an accelerator (the object that can change the objects properties)
        and determine what type of editor it should have displayed by running the 
        constructAccelartor function*/
        let accelerator = document.createElement('div');
        constructAccelartor(key, accelerator, selected())
        /*append the accelerator to the property div and append the property div
        to the properties panel*/
        property.appendChild(accelerator)
        properties.appendChild(property)
    });
}


function constructAccelartor(key, accelerator, obj){
    //select an accalerator construction method based off of the property type
    switch(key){
        case "position" :
        //create two inputs for editing x and y values of the position property
            let x = document.createElement('input')
            let y = document.createElement('input')

        /*create an event listener that will change values in the accelerator
        corrisponding to object changes*/
            obj.properties[key].subscribe((newValue) => {
                x.value = newValue[0];
                y.value = newValue[1];
            })

        //initialize x and y accelerator values
            x.value = obj.properties.position()[0];
            y.value = obj.properties.position()[1];

            //create accelerator's layout
            accelerator.append("x:")
            accelerator.appendChild(x)
            accelerator.append("y:")
            accelerator.appendChild(y)
        
        //create event listeners that will update object's properties
        //when accelerator input's change value
            x.addEventListener('change', (e) => {
                obj.properties.position([parseInt(x.value), parseInt(y.value)])
                console.log(obj.properties.position())
            })

            y.addEventListener('change', (e) => {
                obj.properties.position([parseInt(x.value), parseInt(y.value)])
                console.log(obj.properties.position())
            })

        break;

        case "dimensions":
            let w = document.createElement('input')
            let h = document.createElement('input')

            obj.properties[key].subscribe((newValue) => {
                w.value = newValue[0];
                h.value = newValue[1];
            });

            w.value = obj.properties.dimensions()[0];
            h.value = obj.properties.dimensions()[1];
            accelerator.append("w:")
            accelerator.appendChild(w)
            accelerator.append("h:")
            accelerator.appendChild(h)
                
            w.addEventListener('change', (e) => {
                obj.properties.dimensions([parseInt(w.value), parseInt(h.value)])
                console.log(obj.properties.dimensions())
            })

            h.addEventListener('change', (e) => {
                obj.properties.dimensions([parseInt(w.value), parseInt(h.value)])
                console.log(obj.properties.dimensions())
            })
        break;

        case "animationFrames":

        break;
    }
}