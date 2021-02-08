const getMarkdownNode = () => {
	// Try to find a node that represents a markdown document
	const node = document.getElementsByClassName("markdown-body")[0];
	if (node) {
		return node.parentNode;
	} else {
		return undefined;
	}
}


const renderMath = () => {
	const elementToRender = getMarkdownNode();
	// Check if a markdown node (the element to render) was found
	if (elementToRender) {
		console.debug("Render LaTeX math in markdown document", elementToRender.innerHTML);
		// Render math code blocks (like in GitLab) by converting them to inline blocks
		// (<pre lang="math"><code>...</code></pre> -> $$ ... $$)
		elementToRender.innerHTML = elementToRender.innerHTML.replace(/<pre lang="math"><code>(.+)\n<\/code><\/pre>/g, "$$$$ $1 $$$");
		console.debug("Render LaTeX math in markdown document that was updated", elementToRender.innerHTML);
		try {
			// BUG: GitHub renders // as / so multiline code blocks just break
			// BUG: \left \right is somehow broken in commands
			renderMathInElement(elementToRender, {
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
			console.debug("Render LaTeX math in markdown document that was updated is finished", elementToRender.innerHTML);
		} catch (e) {
			console.error("renderMathInElement has thrown an error:", e);
		}
	} else {
		console.debug("No Markdown node to render was found");
	}
};

if (document.readyState === "complete") {
	// If the page is already completely loaded run the render function
	renderMath();
} else {
	// If the page is not yet loaded wait and then run the render function
	window.addEventListener('load', renderMath);
}
