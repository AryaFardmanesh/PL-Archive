function parser(address, source) {
    // Error handler
    if (source[0].id == 'ERR') {
        return {
            fileName : path.parse(address).base,
            fileAddress : address,
            scripts : [
                { left : source[0].value, mid : 'ERR', right : null }
            ]
        };
    }
    // Error handler

    const path = require('path');

    class Node {
        constructor() {
            this.left = null;
            this.mid = null;
            this.right = null;
        }
    }

    const _private = {
        status : true,

        ast : {
            fileName : path.parse(address).base,
            fileAddress : address,
            scripts : []
        },

        position : 0,

        get token() {
            if (this.position < source.length)
                return source[this.position];
            return { id : 'EOF', value : 'EOF' };
        },

        showToken : function (index = 0) {
            if ((this.position + index) < source.length)
                return source[this.position + index];
            return { id : 'EOF', value : 'EOF' };
        },

        stopProcess : function (msg = '') {
            this.status = false;
            this.ast.scripts = [{ left : msg, mid : 'ERR', right : null }];
        },

        isLiteral : function (tk) {
            switch (tk.id) {
                case 'string':
                    return true;
                case 'int':
                    return true;
                case 'float':
                    return true;
                default:
                    return false;
            }
        },
    };

    // main
    __main__ : while (true) {
        if (_private.token.id == 'EOF' && _private.token.value == 'EOF') {
            break;
        }else if (_private.token.id == 'semicolon' && _private.token.value == ';') {
            _private.position++;
            continue;
        }else if (_private.isLiteral(_private.token)) {
            _private.position++;
            continue;
        }else if (_private.token.id == 'keyword' && _private.token.value == 'print') {
            const node = new Node();
            node.mid = 'print';

            _private.position ++;

            if (!_private.isLiteral(_private.token)) {
                _private.stopProcess(`Unexpected token. <TOKEN : '${_private.token.value}' & TYPE : '${_private.token.id}'>`);
                break __main__;
            }

            node.left = { type : _private.token.id, value : _private.token.value };
            _private.position++;

            if (_private.token.id == 'semicolon' && _private.token.value == ';') {
                _private.ast.scripts.push(node);
                _private.position++;
                continue;
            }else {
                _private.stopProcess(`Unexpected token. <TOKEN : '${_private.token.value}' & TYPE : '${_private.token.id}'>`);
                break __main__;
            }
        }else {
            _private.stopProcess(`Unexpected token. <TOKEN : '${_private.token.value}' & TYPE : '${_private.token.id}'>`);
            break __main__;
        }
    }
    // main

    _private.ast.scriptsCount = _private.ast.scripts.length;

    function writeTemp(content = '') {
        try {
            let _address = require('path').parse(address).dir + '\\temp.json';
            require('fs').writeFileSync(_address, content, 'utf-8');
        }catch (error) {
            throw error;
        }
    }

    writeTemp(JSON.stringify(_private.ast));

    return _private.ast;
}

module.exports = { parser } ;
