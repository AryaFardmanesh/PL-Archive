function tokenExecutor(ast) {
    if (ast.scripts[0].mid == 'ERR') {
        console.log(ast.scripts[0].left);
        return;
    }

    const _private = {
        status : true,

        position : 0,

        get node() {
            if (this.position < ast.scripts.length)
                return ast.scripts[this.position];
            return { left : null, mid: 'END', right: null };
        },
    };

    // main
    __main__ : while (_private.status) {
        if (_private.node.mid == 'END') {
            break;
        }else if (_private.node.mid == 'print') {
            const { log } = require('console');
            log(_private.node.left.value);
            _private.position++;
            continue;
        }

        _private.position++;
    }
    // main

    return;
}

module.exports = { tokenExecutor } ;
