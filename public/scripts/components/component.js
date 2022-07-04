const fs = require('fs');
const { exec } = require('child_process');

console.clear();

// Component tag name
const tag = process.argv[2];

if (!tag) {
	console.log('Usage: npm run new:component <tag>');
	process.exit(1);
}

// Component class name
const class_name = tag
	.split('-')
	.map(word => word.charAt(0).toUpperCase() + word.slice(1))
	.join('');

// Colors for console
const red = '\033[31m';
const cyan = '\033[36m';
const yellow = '\033[33m';
const reset = '\033[0m';

function addBeforeSection(html, line, section) {
	const anchor = `\r\n\t\t<!-- ${section} -->`;
	return html.replace(anchor, `\t\t${line}\r\n${anchor}`);
}

// Get index.html
let index_html = fs.readFileSync('public/index.html', 'utf8');

console.log(`Creating component ${cyan}<${red}${tag}${cyan}>${reset} from ${yellow}${class_name}${reset} class`);

// Component JavaScript code with basic custom element
const component_js = `class ${class_name} extends HTMLElement {
	constructor() {
		super();
	}
}

customElements.define('${tag}', ${class_name});
`;

// Create and open file js file
const js_path = `public/scripts/components/${tag}.js`;
fs.writeFileSync(js_path, component_js);
exec(`code ${js_path}`);

// Add js file to index.html
index_html = addBeforeSection(index_html, `<script src="/scripts/components/${tag}.js"></script>`, 'Scripts');

// If --scss flag is set
if (process.argv.includes('scss')) {
	console.log('Creating SCSS file');

	// Create and open empty scss file
	const scss_path = `public/styles/scss/${tag}.scss`;
	fs.writeFileSync(scss_path, `${tag} {\r\n\r\n}`);
	exec(`code ${scss_path}`);

	// Add scss file to index.html
	index_html = addBeforeSection(index_html, `<link rel="stylesheet" href="/styles/css/${tag}.css">`, 'Libraries');
}

// Write index.html
fs.writeFileSync('public/index.html', index_html);
