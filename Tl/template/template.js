function template(address, source) {
    const path = require('path');
    const os = require('os');

    const parsedAddress = path.parse(address);

    let templateFile = readTemplateFile();

    templateFile += `\n#define $__PATH__ "${address}"`;
    templateFile += `\n#define $__DIR__ "${parsedAddress.dir}"`;
    templateFile += `\n#define $__FILE_BASE__ "${parsedAddress.base}"`;
    templateFile += `\n#define $__FILE_NAME__ "${parsedAddress.name}"`;
    templateFile += `\n#define $__FILE_EXT__ "${parsedAddress.ext}"`;
    templateFile += `\n`;
    templateFile += `\n#define $__OS_TYPE__ "${os.platform()}"`;
    templateFile += `\n#define $__OS_TOTAL_MEMORY__ "${os.totalmem()}"`;
    templateFile += `\n#define $__OS_FREE_SPACE_MEMORY__ "${os.freemem()}"`;
    templateFile += `\n#define $__OS_OCCUPIED_SPACE_MEMORY__ "${os.totalmem() - os.freemem()}"`;
    templateFile += `\n#define $__OS_HOSTNAME__ "${os.hostname()}"`;
    templateFile += `\n`;

    source = templateFile + source;

    function readTemplateFile() {
        try {
            return require('fs').readFileSync(__dirname + '\\template.tl', 'utf-8');
        }catch (error) {
            throw error;
        }
    }

    return source;
}

module.exports = { template } ;
