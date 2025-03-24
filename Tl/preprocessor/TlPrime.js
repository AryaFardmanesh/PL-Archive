function TlPrime(address, source) {
    // @ import modules
    const path = require('path');
    const { LinkedList } = require('ezlistjs');
    // @ import modules

    const _private = {
        // init
        processed   : ''     ,
        status      : true   ,
        position    : 0      ,
        defineBox   : []     ,
        // init

        get char() {
            return (this.position < source.length) ? source[this.position] : '\0';
        },

        showChar                    : function (index = 0) {
            return ((this.position + index) < source.length) ? source[this.position + index] : '\0';
        },

        stopProcess                 : function (msg = '') {
            _private.processed  = '#ERR:' + msg ;
            _private.status     = false         ;
        },

        isSeparator                 : function (ch) {
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

        isDigit                     : function (ch) {
            ch = ch.charCodeAt(0);
            return (ch >= 48 && ch <= 57);
        },

        isNumber                    : function () {
            return (
                _private.isDigit(_private.char)             ||
                (
                    _private.isDigit(_private.showChar(1))  &&
                    (
                        _private.char == '+'                ||
                        _private.char == '-'
                    )
                )
            );
        },

        getString                   : function (sign) {
            _private.position++;

            let str = '';

            while (true) {
                if (_private.char == sign) {
                    _private.position++ ;
                    break               ;
                }else if (_private.char == '\\') {
                    str += _private.char;
                    _private.position++ ;
                    str += _private.char;
                    _private.position++ ;
                    continue            ;
                }else if (_private.char == '\0') {
                    _private.stopProcess(`Syntax Error: String is not closed.`);
                    return false        ;
                }

                str += _private.char    ;
                _private.position++     ;
            }

            return str;
        },

        getNumber                   : function () {
            let is = _private.isNumber();

            if (is) {
                let
                    num         = ''    ,
                    type        = 'int' ,
                    dotCounter  = 0
                ;

                if (_private.char == '+' || _private.char == '-') {
                    num += _private.char;
                    _private.position++;
                }

                while (true) {
                    if (_private.char == '.') {
                        if (dotCounter) {
                            _private.stopProcess(`You define float-point number with more 1 dot.`);
                            break;
                        }
                        num += _private.char    ;
                        _private.position++     ;
                        type = 'float'          ;
                        dotCounter++            ;
                        continue                ;
                    }else if (!_private.isDigit(_private.char)) {
                        break;
                    }

                    num += _private.char        ;
                    _private.position++         ;
                }

                return { value: num, type };
            }

            return { value: undefined, type: undefined };
        },

        searchIdentifierInDefineBox : function () {
            const id    = _private.getIdentifier() ;
            let result  = false                    ;

            for (let i = 0; i < _private.defineBox.length; i++) {
                if (_private.defineBox[i].id == id) {
                    result = { value: _private.defineBox[i].value, type: _private.defineBox[i].type };
                    break;
                }
            }

            return result                           ;
        },

        getIdentifier               : function () {
            let id = '';

            if (_private.char == '$') {
                id += _private.char     ;
                _private.position++     ;
                while (!(_private.isSeparator(_private.char) && _private.char != '_')) {
                    id += _private.char ;
                    _private.position++ ;
                }
            }

            return id;
        },

        insert                      : function (text = '') {
            source = source.slice(0, _private.position) + text + source.slice(_private.position);
        },

        insertString                : function (sign) {
            const str = _private.getString(sign);
            if (str) {
                if (sign == '"')
                    _private.processed += `"${str}"`;
                else
                    _private.processed += `'${str}'`;
            }
        },

        checkIdentifierAsDefine     : function () {
            const result = _private.searchIdentifierInDefineBox();
            if (result) {
                let value = result.value;
                if (result.type == 'string')
                    _private.insert(`"${value}"`);
                else
                    _private.insert(value);
            }
        },

        skip : {
            singleLineComment       : function () {
                while (_private.char != '\n' && _private.char != '\0')
                    _private.position++;
                _private.position++;
            },

            multiLineComment        : function () {
                while (!(_private.char == '*' && _private.showChar(1) == '/')) {
                    if (_private.char == '\0') {
                        _private.stopProcess(`Syntax Error: Multi line comment is not closed.`);
                        break;
                    }
                    _private.position++;
                }
                _private.position += 2;
            },

            whitespace              : function () {
                while (_private.char == ' ')
                    _private.position++;
            }
        },

        checkPreprocessorDirective  : function () {
            const preprocessorDirectiveList = ["#include", "#define"];

            for (let i = 0; i < preprocessorDirectiveList.length; i++) {
                const keyword = preprocessorDirectiveList[i]        ;

                if (source.startsWith(keyword, _private.position) && _private.isSeparator(_private.showChar(keyword.length))) {
                    _private.position += keyword.length             ;
                    if (keyword == '#include')
                        _private.preprocessorDirective.include()    ;
                    else if (keyword == '#define')
                        _private.preprocessorDirective.define()     ;
                    break                                           ;
                }
            }
        },

        preprocessorDirective       : {
            include                 : function () {
                // ISSUE | Bug : This only support ./ and root:/ address.
                let _address;

                _private.skip.whitespace();

                if (_private.char == '"' || _private.char == '\'') {
                    _address = _private.getString(_private.char);
                }else {
                    _private.stopProcess(`Invalid address for #include.`);
                    return;
                }

                _address = path.parse(_address);
                _address = (_address.dir == '.') ? path.parse(address).dir + '\\' + _address.base : _address.dir + _address.name;

                let file;
                try {
                    file = require('fs').readFileSync(_address, 'utf-8');
                }catch (error) {
                    _private.stopProcess(`Invalid Address: Could not find the address '${_address}'.`);
                    return;
                }
                _private.insert(file);
            },

            define                  : function () {
                _private.skip.whitespace()          ;
                let id = _private.getIdentifier()   ;
                let value, type                     ;
                _private.skip.whitespace()          ;

                if (_private.char == '"' || _private.char == '\'') {
                    type    = 'string'                          ;
                    value   = _private.getString(_private.char) ;
                }else if (_private.isNumber()) {
                    const getNum = _private.getNumber()         ;
                    type    = getNum.type                       ;
                    value   = getNum.value                      ;
                }else {
                    _private.stopProcess(`Invalid Syntax for #define.`);
                    return;
                }

                _private.defineBox.push({
                    id                  ,
                    type                ,
                    value               ,
                });
            },
        },
    };

    // main
    __main__ : while (_private.status) {
        if (_private.char == '\0') {
            break                                   ;
        }else if (_private.char == '\n' || _private.char == '\r') {
            _private.position++                     ;
            continue                                ;
        }else if (_private.char == '/' && _private.showChar(1) == '/') {
            _private.skip.singleLineComment()       ;
            continue                                ;
        }else if (_private.char == '/' && _private.showChar(1) == '*') {
            _private.skip.multiLineComment()        ;
            continue                                ;
        }else if (_private.char == '#') {
            _private.checkPreprocessorDirective()   ;
            continue                                ;
        }else if (_private.char == '$') {
            _private.checkIdentifierAsDefine()      ;
            continue                                ;
        }else if (_private.char == '"' || _private.char == '\'') {
            _private.insertString(_private.char)    ;
            continue                                ;
        }

        _private.processed += _private.char         ;
        _private.position++                         ;
    }
    // main

    return _private.processed                       ;
}

module.exports = { TlPrime } ;
