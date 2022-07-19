const pets = require("./pet");

// console.log("My Pet name is \"" + pet.name + "\" and it a \"" + pet.type + "\" animal.");
// console.log(pets);

for (var pet in pets) {
	// console.log(pet.name + " " + pet.type);
	// console.log(pets[pet]);
	var _pet = pets[pet];
	console.log(_pet.title);
}
