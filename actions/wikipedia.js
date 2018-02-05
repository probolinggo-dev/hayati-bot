const WikiPedia = require("node-wikipedia");
let wikiCache = [];

const getDefine = async() => {
    return wikipedia.page.data("Clifford_Brown", { content: true }, function(response) {
        // structured information on the page for Clifford Brown (wikilinks, references, categories, etc.)
    });
}

// wikipedia.revisions.all("Miles_Davis", { comment: true }, function(response) {
// 	// info on each revision made to Miles Davis' page
// });

// wikipedia.categories.tree(
// 	"Philadelphia_Phillies",
// 	function(tree) {
// 		//nested data on the category page for all Phillies players
// 	}
// );