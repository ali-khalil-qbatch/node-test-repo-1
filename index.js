const pets = require("./pet");

for (var pet in pets) {
	var _pet = pets[pet];
	console.log(_pet.title);
}

console.log("Info about all pets have been printed");
