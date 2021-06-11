const fs = require('fs');
const parse = require('csv-parse/lib/sync');

if (!fs.existsSync('./data/') || !fs.existsSync('./original_data')) throw new Error("Can't find the original data files!");

if (!fs.existsSync('./converted/')) fs.mkdirSync('./converted/');

const date = new Date().toISOString().replace(/:/g, '');

const translations = [];
const csvFiles = fs.readdirSync('./data/').filter((f) => f.split('.').pop() === 'csv');

for (const file of csvFiles) {
	const fileStr = fs.readFileSync(`./data/${file}`).toString()
		.replace(/\n\n/g, '\n')
		.replace(/\\n/g, '\n')
		.replace(/\n/g, '\r\n')
		.replace(/<\/?size(=[0-9]+)?>/g, '');

	const data = parse(fileStr, {
		columns: ['text', 'translation'], fromLine: 2, ltrim: true, rtrim: true, skip_lines_with_empty_values: true, skip_lines_with_error: true,
	});
	translations.push(...data);
}

const dataFiles = fs.readdirSync('./original_data/').filter((f) => f.split('.').pop() === 'json');
fs.mkdirSync(`./converted/${date}`);

for (const file of dataFiles) {
	const imported = require(`./original_data/${file}`);
	let translatedCount = 0;
	const newFile = {};

	for (const key in imported) {
		if (Object.prototype.hasOwnProperty.call(imported, key)) {
			const item = translations.find((translation) => translation.text === imported[key]);
			if (item) translatedCount++;
			newFile[key] = item ? item.translation : imported[key];
		}
	}

	fs.writeFileSync(`./converted/${date}/${file}`, JSON.stringify(newFile, null, 4));
	console.log(`${file}: ${translatedCount} entries translated!`);
}
