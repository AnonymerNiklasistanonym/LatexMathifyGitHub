const debugPrefix = "LatexMathifyGitHub > "

console.debug(debugPrefix + "Add-on script start");

if (typeof browser === "undefined") {
	var browser = chrome
}
browser.storage.sync.get({
	debugColor: 'red',
	debug: false,
	mathmlOutput: false
}).then(options => {
	console.debug(debugPrefix + "Add-on script start <Promise>", options);

	if (options.debug) {
		console.debug(debugPrefix + "Add-on in debug mode");
		document.body.style.border = `5px solid ${options.debugColor}`;
	}

	/**
	 * Find all nodes in the HTML DOM that should be updated
	 *
	 * @returns {{name:string,node:Element}[]} HTML nodes
	 */
	const getNodesToMathify = () => {
		const nodesToMathify = [];
		// > Find GitHub Markdown document rendering nodes
		const nodesMarkdownBody = Array.from(document.getElementsByClassName("markdown-body"));
		for (const node of nodesMarkdownBody) {
			console.debug(debugPrefix + "add .markdown-body node:", node);
			nodesToMathify.push({ name: "GitHub:class=markdown-body.parentNode", node: node })
		}
		// > Find GitHub Markdown titles rendering nodes
		const nodesMarkdownTitle = Array.from(document.getElementsByClassName("markdown-title"));
		for (const node of nodesMarkdownTitle) {
			console.debug(debugPrefix + "add .markdown-title node:", node);
			nodesToMathify.push({ name: "GitHub:class=markdown-title.parentNode", node: node })
		}
		return nodesToMathify;
	}

	const renderMath = () => {
		const nodesToMathify = getNodesToMathify();
		console.debug(debugPrefix + "getNodesToMathify:", nodesToMathify);

		// Update all found markdown nodes with KaTeX
		nodesToMathify.forEach(nodeToMathify => {
			console.debug(debugPrefix + `Render LaTeX math in HTML node ${nodeToMathify.name}`, nodeToMathify.node.innerHTML);

			const node = nodeToMathify.node

			if (options.debug) {
				node.style.border = `5px solid ${options.debugColor}`;
			}

			// Render math code blocks (like in GitLab) by converting them to inline blocks
			// (<pre lang="math"><code>...</code></pre> -> $$ ... $$)
			node.innerHTML = node.innerHTML.replace(/<pre lang="math"><code>(.+)\n<\/code><\/pre>/g, "$$$$ $1 $$$");

			// Fix newlines
			// \$\$(?:(?:.|\n)*?)(.*?)(?:(?:.|\n)*?)\$\$
			node.innerHTML = node.innerHTML.replace(/\$\$((.|\n)+?)\$\$/g, (_match, groupMathArea, a, b) => {
				const newMathArea = groupMathArea.replace(/\s(\\)(\s|\n|$)/g, (__match, _groupSingleSlash) => {
					return " \\\\ "
				}).replace(/<br>/g, (__match) => {
					return "\n"
				}).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\n/g, " ")
				console.debug(debugPrefix + "$$...$$ > KaTeX render math area", { mathArea: newMathArea });
				const katexHtmlOutput = katex.renderToString(newMathArea, {
					displayMode: true,
					output: options.mathmlOutput ? "mathml" : "htmlAndMathml"
				});
				console.debug(debugPrefix + "$$...$$ > Update math area", { from: groupMathArea, to: newMathArea, katexHtmlOutput  });
				return katexHtmlOutput;
			})
			node.innerHTML = node.innerHTML.replace(/\$((.|\n)+?)\$/g, (_match, groupMathArea, a, b) => {
				const newMathArea = groupMathArea.replace(/\s(\\)(\s|\n|$)/g, (__match, _groupSingleSlash) => {
					return " \\\\ "
				}).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\n/g, " ")
				console.debug(debugPrefix + "$...$ > KaTeX render math area", { mathArea: newMathArea });
				const katexHtmlOutput = katex.renderToString(newMathArea, {
					output: options.mathmlOutput ? "mathml" : "htmlAndMathml"
				});
				console.debug(debugPrefix + "$...$ > Update math area", { from: groupMathArea, to: newMathArea, katexHtmlOutput  });
				return katexHtmlOutput;
			})

			console.debug(debugPrefix + "Render LaTeX math in markdown document that was updated", node.innerHTML);
			try {
				// BUG: GitHub renders // as / so multiline code blocks just break
				// BUG: \left \right is somehow broken in commands
				renderMathInElement(node, {
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
				console.debug(debugPrefix + "Render LaTeX math in markdown document that was updated is finished", node.innerHTML);
			} catch (e) {
				console.error(debugPrefix + "renderMathInElement has thrown an error:", e);
			}
		});
		if (nodesToMathify.length === 0) {
			console.debug(debugPrefix + "No HTML node to render was found");
		}
	};

	if (document.readyState === "complete") {
		// If the page is already completely loaded run the render function
		renderMath();
	} else {
		// If the page is not yet loaded wait and then run the render function
		window.addEventListener('load', renderMath);
	}

	console.debug(debugPrefix + "Add-on script end <Promise>");

}).catch(err => console.error)


console.debug(debugPrefix + "Add-on script end");
