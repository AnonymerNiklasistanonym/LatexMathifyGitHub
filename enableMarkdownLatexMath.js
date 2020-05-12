const renderMath = () => {
	const elementToRender = document.getElementById("readme");
	if (elementToRender) {
		console.debug("Render Readme");
		renderMathInElement(document.getElementById("readme"), {
			delimiters: [{
				left: "$$",
				right: "$$",
				display: true
			}, {
				left: "$",
				right: "$",
				display: false
			}]
		});
	} else {
		console.debug("No Readme was found");
	}
};

if (document.readyState === "complete") {
    renderMath();
} else {
    window.addEventListener('load', renderMath);
}
