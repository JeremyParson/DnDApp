function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(51);
    let parent = document.getElementById('canvas');
    let canvas = document.getElementById('defaultCanvas0');
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    parent.append(canvas);
}

$('#html1').jstree();


let person = {
    name : ko.observable("jeremy"),
    age : ko.observable(17)
}

person.name.subscribe((newValue) => {
    console.log(`new value ${newValue}`);
})

person.name("jeremy parson");