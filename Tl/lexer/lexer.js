function lexer(address, source) {
    // Error handler
    if (source.startsWith("#ERR:")) {
        let msg = source.slice(5);
        return [{ id : 'ERR', value : msg }];
    }
    // Error handler

    const _private = {
        status : true,

        tokens : [],

        position: 0,

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
            this.status = false;
            this.tokens = [{ id : 'ERR', value : msg }];
        },

        isSeparator : function (ch) {
            ch = ch.charCodeAt(0);

            if (ch <= 47)
                return true;
            else if (ch >= 58 && ch <= 64)
                return true;
            else if (ch >= 91 && ch <= 96)
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

        isNumber : function () {
            // ["+" | "-"]digit["."digit]
            if (_private.isDigit(_private.char))
                return true;
            else if ((_private.char == '+' || _private.char == '-') && _private.isDigit(_private.showChar(1)))
                return true;
            else
                return false;
        },

        getNumber : function () {
            let
                num         = ''    ,
                type        = 'int' ,
                dotCounter  = 0
            ;

            if (_private.char == '-' || _private.char == '+') {
                num += _private.char;
                _private.position++;
            }

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
                }
                else if (!_private.isDigit(_private.char)) {
                    break;
                }

                num += _private.char;
                _private.position++;
            }

            return { value: num, type };
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
                    _private.position++;
                    let scapeChar = _private.convertEscapeChar(_private.char);
                    scapeChar = (scapeChar === false) ? _private.char : scapeChar;
                    str += scapeChar;
                    _private.position++;
                    continue;
                }

                str += _private.char;

                _private.position++;
            }

            return str;
        },

        getKeyword : function () {
            const keywords = ['print'];
            let result = false;

            for (let i = 0; i < keywords.length; i++) {
                if (_private.isSeparator(_private.showChar(keywords[i].length)) && source.startsWith(keywords[i], _private.position)) {
                    result = true;
                    _private.tokens.push({
                        id : 'keyword',
                        value : keywords[i]
                    });
                    _private.position += keywords[i].length;
                    break;
                }
            }

            return result;
        },

        convertEscapeChar : function (ch) {
            switch (ch) {
                case '\\':
                    return '\\';
                case 'n':
                    return '\n';
                case 't':
                    return '\t';
                case 'n':
                    return '\n';
                default :
                    return false;
            }
        },
    };

    // main
    __main__ : while (_private.status) {
        if (_private.char == '\0') {
            _private.tokens.push({
                id : 'EOF',
                value : 'EOF'
            });
            break;
        }else if (_private.char == ' ') {
            _private.position++;
            continue;
        }else if (_private.char == ';') {
            _private.tokens.push({
                id : 'semicolon',
                value : _private.char
            });
            _private.position++;
            continue;
        }else if (_private.char == '"' || _private.char == '\'') {
            _private.tokens.push({
                id : 'string',
                value : _private.getString(_private.char)
            });
            continue;
        }else if (_private.isNumber()) {
            const num = _private.getNumber();
            _private.tokens.push({
                id : num.type,
                value : num.value
            });
            continue;
        }else if (_private.getKeyword()) {
            continue;
        }

        // Invalid token
        let invalidToken = '';

        while (true) {
            if (_private.char == ' ' || _private.char == ';' || _private.char == '\n' || _private.char == '\0')
                break;

            invalidToken += _private.char;
            _private.position++;
        }

        _private.stopProcess(`Invalid or unexpected token. <TOKEN : '${invalidToken}' & POSITION : '${_private.position}'>`);
        break __main__;
        // Invalid token
    }
    // main

    return _private.tokens;
}

module.exports = { lexer } ;
