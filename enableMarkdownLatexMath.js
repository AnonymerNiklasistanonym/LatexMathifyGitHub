function get_markdown_node() {
    var node = document.getElementsByClassName("markdown-body")[0];
    return node.parentNode;
}


const renderMath = () => {
	const elementToRender = get_markdown_node();
	if (elementToRender) {
        var markdown = get_markdown_node();
        markdown.innerHTML = markdown.innerHTML.replace(/<pre lang="math"><code>(.+)\n<\/code><\/pre>/g, "$$$$ $1 $$$");
		console.debug("Render Readme");
		renderMathInElement(get_markdown_node(), {
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
