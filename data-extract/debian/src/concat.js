const fs = require('fs');

async function updateURLList(filepath) {
    let list = []
    let output = '';
    if (fs.existsSync(filepath)) {
        try {
            const lines = fs.readFileSync(filepath, 'utf8').split('\n');
            for (const line of lines) {
                const [name, url] = line.split('\t');
                if (list[url] === undefined) {
                    list[url] = name;
                } else {
                    list[url] = `${list[url]}, ${name}`;
                }
            }
            Object.keys(list).map((key) => {
                output += `${list[key]}\t${key}\n`;
            });
            fs.writeFileSync('ConcatCloneList.txt', output, 'utf-8');
        } catch (err) {
            console.error(`Error reading ${filepath}:`, err);
        }
    } else {
        console.log(`${filepath} file not exist`);
        return null
    }
}

async function main() {

    try {
        updateURLList('./CloneURLList.txt');
        console.log('clone url concat success')
    } catch (error) {
        console.error('Error insert commit date data:', error);
    }
};

main();