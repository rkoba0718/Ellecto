function main() {
    const name = process.argv[2];
    const [package_name, ...remain] = name.split('/');
    const version = process.argv[3];
    const architecture = process.argv[4];
    console.log(package_name);
}

main()