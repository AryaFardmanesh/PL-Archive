function main(address, source) {
    const code = (typeof source != 'string') ? readTargetFile() : source;

    const { template } = require('./template/template');
    const { preprocessor } = require('./preprocessor/preprocessor');
    const { lexer } = require('./lexer/lexer');
    const { parser } = require('./parser/parser');
    const { tokenExecutor } = require('./tokenExecutor/tokenExecutor');

    const templated = template(address, code);
    const processored = preprocessor(address, templated);
    const tokens = lexer(address, processored);
    const ast = parser(address, tokens);
    tokenExecutor(ast);

    function readTargetFile() {
        try {
            return require('fs').readFileSync(address, 'utf-8');
        }catch (error) {
            throw new Error(`Invalid Address: ${error}`);
        }
    }
}

module.exports = { main } ;
