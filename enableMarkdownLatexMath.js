const renderMath = () => {
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
};

if (document.readyState === "complete") {
    renderMath();
} else {
    window.addEventListener('load', renderMath);
}
