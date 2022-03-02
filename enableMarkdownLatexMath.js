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
			if (options.debug) {
				console.debug(debugPrefix + "add .markdown-body node:", node);
			}
			nodesToMathify.push({ name: "GitHub:class=markdown-body", node: node })
		}
		// > Find GitHub Markdown titles rendering nodes
		const nodesMarkdownTitle = Array.from(document.getElementsByClassName("markdown-title"));
		for (const node of nodesMarkdownTitle) {
			if (options.debug) {
				console.debug(debugPrefix + "add .markdown-title node:", node);
			}
			nodesToMathify.push({ name: "GitHub:class=markdown-title", node: node })
		}
		// > Find GitLab Markdown documents
		const nodesMarkdownGitLab = Array.from(document.getElementsByClassName("md"));
		for (const node of nodesMarkdownGitLab) {
			if (options.debug) {
				console.debug(debugPrefix + "add .md [GitLab] node:", node);
			}
			nodesToMathify.push({ name: "GitLab:class=md", node: node })
		}
		// > Find GitLab Markdown titles
		const nodesMarkdownTitleGitLab = Array.from(document.getElementsByClassName("qa-title"));
		for (const node of nodesMarkdownTitleGitLab) {
			if (options.debug) {
				console.debug(debugPrefix + "add .qa-title [GitLab] node:", node);
			}
			nodesToMathify.push({ name: "GitLab:class=qa-title", node: node })
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
				// In case the user is looking at a diff don't render with KaTeX
				if (groupMathArea.match(/<del>/) && groupMathArea.match(/<ins>/)) {
					return _match
				}
				const newMathArea = groupMathArea.replace(/\s(\\)(\s|\n|$)/g, (__match, _groupSingleSlash) => {
					return " \\\\ "
				}).replace(/<br>/g, (__match) => {
					return "\n"
				}).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\n/g, " ")
				if (options.debug) {
					console.debug(debugPrefix + "$$...$$ > KaTeX render math area", { mathArea: newMathArea });
				}
				const katexHtmlOutput = katex.renderToString(newMathArea, {
					displayMode: true,
					output: options.mathmlOutput ? "mathml" : "htmlAndMathml"
				});
				if (options.debug) {
					console.debug(debugPrefix + "$$...$$ > Update math area", {
						from: groupMathArea, to: newMathArea,
						katexHtmlOutput
					});
				}
				return katexHtmlOutput;
			})
			node.innerHTML = node.innerHTML.replace(/\$((.|\n)+?)\$/g, (_match, groupMathArea, a, b) => {
				// In case the user is looking at a diff don't render with KaTeX
				if (groupMathArea.match(/<del>/) && groupMathArea.match(/<ins>/)) {
					return _match
				}
				const newMathArea = groupMathArea.replace(/\s(\\)(\s|\n|$)/g, (__match, _groupSingleSlash) => {
					return " \\\\ "
				}).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\n/g, " ")
				if (options.debug) {
					console.debug(debugPrefix + "$...$ > KaTeX render math area", { mathArea: newMathArea });
				}
				const katexHtmlOutput = katex.renderToString(newMathArea, {
					output: options.mathmlOutput ? "mathml" : "htmlAndMathml"
				});
				if (options.debug) {
					console.debug(debugPrefix + "$...$ > Update math area", { from: groupMathArea, to: newMathArea, katexHtmlOutput });
				}
				return katexHtmlOutput;
			})
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

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver((mutationsList, _observer) => {
		// Use traditional 'for loops' for IE 11
		for (const mutation of mutationsList) {
			if (options.debug) {
				console.debug(debugPrefix + `Mutation detected: ${mutation.type}`, mutation)
			}
			renderMath();
		}
	});

	// Start observing the target node for configured mutations
	const gitlabMain = document.getElementById("content-body")
	const githubMain = document.getElementsByClassName("repository-content")
	let observeTarget = undefined
	if (gitlabMain) {
		observeTarget = gitlabMain
	} else if (githubMain && githubMain.length > 0) {
		observeTarget = githubMain[0]
	} else {
		console.error(debugPrefix + "Nothing was found to observe!")
	}
	if (observeTarget) {
		observer.observe(observeTarget, {
			attributes: true,
			attributeOldValue: true,
			attributeFilter: ['class'],
			characterData: true,
			subtree: true
		});
	}

	// The observer can be disconnected but there is no reason to
	//observer.disconnect();

	console.debug(debugPrefix + "Add-on script end <Promise>");

}).catch(err => console.error)


console.debug(debugPrefix + "Add-on script end");
