const fs = require('fs');

const KEYS_SPLIT_COMMA_OR_PIPE = [
  'Depends',
  'Pre-Depends',
  'Build-Depends',
  'Recommends',
  'Suggests',
];

const KEYS_SPLIT_COMMA = [
  'Tag',
  'Breaks',
  'Conflicts',
  'Replaces',
  'Provides',
  'Built-Using'
];

const addData = (currentPackage, key, value, package_flag, package_number) => {
  if (package_flag) {
    currentPackage.Package[package_number][key] = value;
  } else {
    currentPackage[key] = value;
  }
}

const separateNameAndVersion = (values) => {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    if (values[i].includes('(')) {
      const [name, tmp] = values[i].split('(').map(v => v.trim());
      const version = tmp.replace(')', '');
      output.push({
        Name: name,
        Version: version
      });
    } else {
      output.push({
        Name: values[i],
        Version: null
      });
    }
  }

  return output;
}

const parseControlFile = (controlFileContent, package_name) => {
  const lines = controlFileContent.split('\n');

  let previousKey = '';
  let description_values = {
    summary: '',
    detail: ''
  };
  let values = [];
  let currentPackage = {package_name};
  let package_counter = 1;
  let package_flag = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === '') {
      if (previousKey === 'Description') {
        addData(currentPackage, previousKey, {
          summary: description_values.summary,
          detail: description_values.detail
        }, package_flag, `package${package_counter}`);
        previousKey = '';
        description_values = {
          summary: '',
          detail: ''
        };
      }
      if (package_flag) {
        package_counter++;
      }
      package_flag = false;
      continue;
    }

    const line = lines[i];
    const [key, value] = line.split(': ').map(part => part.trim());
    if (value) {
      if (previousKey === 'Description') {
        addData(currentPackage, previousKey, {
          summary: description_values.summary,
          detail: description_values.detail
        }, package_flag, `package${package_counter}`);
        previousKey = '';
        description_values = {
          summary: '',
          detail: ''
        };
      } else if (KEYS_SPLIT_COMMA_OR_PIPE.includes(previousKey)
        || KEYS_SPLIT_COMMA.includes(previousKey)) {
          const out = separateNameAndVersion(values);
          addData(currentPackage, previousKey, out, package_flag, `package${package_counter}`);
          previousKey = '';
          values = [];
      }

      if (key === 'Maintainer') {
        const [name, remain] = value.split(' <');
        const email = remain.split('>')[0];
        addData(currentPackage, key, {
          Maintainer: name,
          Email: email
        }, package_flag, `package${package_counter}`);
      } else if (key === 'Description') {
        previousKey = key;
        description_values = {
          summary: value,
          detail: ''
        };
      } else if (key === 'Package') {
        if (currentPackage[key] === undefined) {
          currentPackage[key] = {};
        }
        currentPackage.Package[`package${package_counter}`] = {}
        package_flag = true;
        addData(currentPackage, 'PackageName', value, package_flag, `package${package_counter}`);
      } else if (KEYS_SPLIT_COMMA_OR_PIPE.includes(key)) {
        previousKey = key;
        const no_comma_value = value.split(',').map(cv => cv.trim());
        no_comma_value.map(v => {
          if (v.includes('|')) {
            const no_pipe_value = v.split('|').map(pv => pv.trim());
            for (let i = 0; i < no_pipe_value.length; i++) {
              values.push(no_pipe_value[i]);
            }
          } else if (v !== '') {
            values.push(v);
          }
        });
      } else if (KEYS_SPLIT_COMMA.includes(key)) {
        previousKey = key;
        const no_comma_value = value.split(',').map(cv => cv.trim());
        no_comma_value.map(v => {
          if (v !== '') {
            values.push(v);
          }
        });
      } else {
        addData(currentPackage, key, value, package_flag, `package${package_counter}`);
      }
    } else {
      if (previousKey === 'Description') {
        description_values = {
          ...description_values,
          detail: `${description_values.detail} ${key}`
        };
      } else if (KEYS_SPLIT_COMMA_OR_PIPE.includes(previousKey)) {
        const no_comma_value = key.split(',').map(cv => cv.trim());
        no_comma_value.map(v => {
          if (v.includes('|')) {
            const no_pipe_value = v.split('|').map(pv => pv.trim());
            for (let i = 0; i < no_pipe_value.length; i++) {
              values.push(no_pipe_value[i]);
            }
          } else if (v !== '') {
            values.push(v);
          }
        });
      } else if (KEYS_SPLIT_COMMA.includes(previousKey)) {
        const no_comma_value = key.split(',').map(cv => cv.trim());
        no_comma_value.map(v => {
          if (v !== '') {
            values.push(v);
          }
        });
      }
    }
  }

  if (previousKey === 'Description') {
    addData(currentPackage, previousKey, {
      summary: description_values.summary,
      detail: description_values.detail
    }, package_flag, `package${package_counter}`);
    previousKey = '';
    description_values = {
      summary: '',
      detail: ''
    };
  }

  return currentPackage;
}

const convertToJSON = (controlFileContent, package_name) => {
  const packages = parseControlFile(controlFileContent, package_name);
  const jsonData = {};

  const packageName = packages['package_name'];
  delete packages['package_name'];
  jsonData[packageName] = packages;

  return jsonData;
}

function main() {
  // Read the control file content from a file
  const controlFileContent = fs.readFileSync(process.argv[2], 'utf-8');
  const [package_name, ...remain] = process.argv[2].split('/');
  // Convert to JSON
  const jsonOutput = convertToJSON(controlFileContent, package_name);
  // Write JSON to a file
  fs.writeFileSync(`${package_name}.json`, JSON.stringify(jsonOutput, null, 2));
}

main();


