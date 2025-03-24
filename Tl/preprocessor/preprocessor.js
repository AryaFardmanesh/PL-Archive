function preprocessor(address, source) {
    // init
    const _private = {
        processed : '',
        status: true,
        position: 0,
        defineBox : [],
        get char() {
            if (this.position < source.length)
                return source[this.position];
            return '\0';
        },
        showChar : function (index = 0) {
            if ((this.position + index) < source.length)
                return source[this.position + index];
            return '\0';
        },
        stopProcess : function (msg = '') {
            this.processed = '#ERR:' + msg;
            this.status = false;
        },
        isSeparator : function (ch) {
            ch = ch.charCodeAt(0);

            if (ch <= 47)
                return true;
            else if (ch >= 58 && ch <= 64)
                return true;
            else if (ch >= 92 && ch <= 96)
                return true;
            else if (ch >= 123)
                return true;
            else
                return false;
        },
        isDigit : function (ch) {
            ch = ch.charCodeAt(0);

            if (ch >= 48 && ch <= 57)
                return true;
            return false;
        },
        getString : function (sign) {
            let str = '';

            _private.position++;

            while (true) {
                if (_private.char == sign) {
                    _private.position++;
                    break;
                }else if (_private.char == '\0') {
                    _private.stopProcess(`Syntax Error: String is not closed.`);
                    break;
                }else if (_private.char == '\\') {
                    str += _private.char;
                    _private.position++;
                    str += _private.char;
                    _private.position++;
                    continue;
                }

                str += _private.char;

                _private.position++;
            }

            return str;
        },
        getNumber : function () {
            let num = '';
            let type = 'int';
            let dotCounter = 0;

            if (_private.isDigit(_private.char) || _private.isDigit(_private.showChar(1))) {
                if (_private.isDigit(_private.showChar(1)) && (_private.char == '+' || _private.char == '-')) {
                    num += _private.char;
                    _private.position++;
                }

                if (_private.isDigit(_private.char)) {
                    while (true) {
                        if (_private.char == '.') {
                            if (dotCounter) {
                                _private.stopProcess(`You define float-point number with more 1 dot.`);
                                break;
                            }
                            num += _private.char;
                            _private.position++;
                            type = 'float';
                            dotCounter++;
                            continue;
                        }else if (!_private.isDigit(_private.char)) {
                            break;
                        }

                        num += _private.char;

                        _private.position++;
                    }
                }

                return { value: num, type };
            }
        },
        checkIdentifier : function () {
            const id = this.getIdentifier();
            let result = false;

            for (let i = 0; i < this.defineBox.length; i++) {
                if (this.defineBox[i].id == id) {
                    result = { value: this.defineBox[i].value, type: this.defineBox[i].type };
                    break;
                }
            }

            return result;
        },
        getIdentifier : function () {
            let id = '';

            if (_private.char == '$') {
                id += _private.char;
                _private.position++;
                while (true) {
                    if (_private.char != '_' && _private.isSeparator(_private.char)) {
                        break;
                    }

                    id += _private.char;
                    _private.position++;
                }
            }

            return id;
        },
        skip : {
            singleLineComment : function () {
                while (true) {
                    if (_private.char == '\n' || _private.char == '\0')
                        break;
                    _private.position++;
                }
                _private.position++;
            },
            multiLineComment : function () {
                while (true) {
                    if (_private.char == '*' && _private.showChar(1) == '/')
                        break;
                    else if (_private.char == '\0') {
                        _private.stopProcess(`Syntax Error: Multi line comment is not closed.`);
                        break;
                    }
                    _private.position++;
                }
                _private.position += 2;
            },
            whitespace : function () {
                while (true) {
                    if (_private.char != ' ')
                        break;
                    _private.position++;
                }
            }
        },
        checkPreprocessorDirective : function () {
            const preprocessorDirectiveList = ["#include", "#define"];

            for (let i = 0; i < preprocessorDirectiveList.length; i++) {
                if (source.startsWith(preprocessorDirectiveList[i], _private.position) && _private.isSeparator(_private.showChar(preprocessorDirectiveList[i].length))) {
                    _private.position += preprocessorDirectiveList[i].length;
                    if (preprocessorDirectiveList[i] == '#include') {
                        _private.preprocessorDirective.include();
                    }else if (preprocessorDirectiveList[i] == '#define') {
                        _private.preprocessorDirective.define();
                    }
                    break;
                }
            }
        },
        preprocessorDirective : {
            include : function () {
                    // ISSUE | Bug : This only support ./ and root:/ address.
                const path = require('path');
                let _address;

                _private.skip.whitespace();

                if (_private.char == '"' || _private.char == '\'') {
                    _address = _private.getString(_private.char);
                }else {
                    _private.stopProcess(`Invalid address for #include.`);
                }

                _address = path.parse(_address);
                _address = (_address.dir == '.') ? path.parse(address).dir + '\\' + _address.base : _address.dir + _address.name;

                let file;
                try {
                    file = require('fs').readFileSync(_address, 'utf-8');
                }catch (error) {
                    _private.stopProcess(`Invalid Address: Could not find the address '${_address}'.`);
                }

                source = source.slice(0, _private.position) + file + source.slice(_private.position);
            },
            define : function () {
                _private.skip.whitespace();
                let id = _private.getIdentifier();
                _private.skip.whitespace();
                let value, type;

                if (_private.char == '"' || _private.char == '\'') {
                    type = 'string';
                    value = _private.getString(_private.char);
                }else if (_private.isDigit(_private.char) || ((_private.char == '+' || _private.char == '-') && _private.isDigit(_private.showChar(1)))) {
                    const getNum = _private.getNumber();
                    type = getNum.type;
                    value = getNum.value;
                }

                _private.defineBox.push({
                    id,
                    type,
                    value
                });
            },
            insertDefine : function (data) {
                if (data !== false) {
                    let value = data.value;

                    if (data.type == 'string')
                        value = '"' + value + '"';

                    source = source.slice(0, _private.position) + value + source.slice(_private.position);
                }
            }
        },
    };
    // init

    // main
    __main__ : while (_private.status) {
        if (_private.char == '\0') {
            break;
        }else if (_private.char == '\n' || _private.char == '\r') {
            _private.position++;
            _private.char;
            continue;
        }else if (_private.char == '/' && _private.showChar(1) == '/') {
            _private.skip.singleLineComment();
            continue;
        }else if (_private.char == '/' && _private.showChar(1) == '*') {
            _private.skip.multiLineComment();
            continue;
        }else if (_private.char == '#') {
            _private.checkPreprocessorDirective();
            continue;
        }else if (_private.char == '$') {
            _private.preprocessorDirective.insertDefine(_private.checkIdentifier());
            continue;
        }else if (_private.char == '"' || _private.char == '\'') {
            _private.processed += `"${_private.getString(_private.char)}"`;
            continue;
        }

        _private.processed += _private.char;
        _private.position++;
    }
    // main

    function writeTemp(content = '') {
        try {
            let _address = require('path').parse(address).dir + '\\temp.ptl';
            require('fs').writeFileSync(_address, content, 'utf-8');
        }catch (error) {
            throw error;
        }
    }

    writeTemp(_private.processed);

    return _private.processed;
}

module.exports = { preprocessor } ;
