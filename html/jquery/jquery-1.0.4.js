/**
 * Copyright (C) <ano>  Chifrudo <chifrudo@localhost.com.br>
 *
 * Este programa é um software livre: você pode redistribuí-lo e/ou
 * modificá-lo sob os termos da GNU General Public License conforme
 * publicada por a Free Software Foundation, seja a versão 3 da
 * Licença, ou (a seu critério) qualquer versão posterior.
 *
 * Este programa é distribuído na esperança de que seja útil,
 * mas SEM QUALQUER GARANTIA; mesmo sem a garantia implícita de
 * COMERCIABILIDADE ou ADEQUAÇÃO PARA UM FIM ESPECÍFICO. Veja a
 * Licença Pública Geral GNU para mais detalhes.
 *
 * Você deve ter recebido uma cópia da GNU General Public License
 * juntamente com este programa. Caso contrário, consulte
 * <https://www.gnu.org/licenses/>.
 */


/**
 * Impede a execução do jQuery se incluído mais de uma vez.
 */
if (typeof window.jQuery == "undefined")
{
    /**
     * Variável global indefinida.
     */
    window.undefined = window.undefined;

    /**
     *
     */
    var jQuery = function(a, c)
    {
        /**
         * Atalho para documento pronto.
         */
        if (a && typeof a == "function" && jQuery.fn.ready && !a.nodeType && a[0] == undefined)
        {
            /**
             * Safari reporta typeof em DOM NodeLists como uma função.
             */
            return jQuery(document).ready(a);
        }

        /**
         * Certifique-se de que uma seleção foi fornecida.
         */
        a = a || document;

        /**
         * Observe quando um objeto jQuery é passado como seletor.
         */
        if (a.jquery)
        {
            return jQuery(
                jQuery.merge(a, [])
            );
        }

        /**
         * Observe quando um objeto jQuery é passado no contexto.
         */
        if (c && c.jquery)
        {
            return jQuery(c).find(a);
        }

        /**
         * Se o contexto for global, retorne um novo objeto.
         */
        if (window == this)
        {
            return new jQuery(a, c);
        }

        /**
         * Lidar com strings HTML.
         */
        if (typeof a  == "string")
        {
            var m = /^[^<]*(<.+>)[^>]*$/.exec(a);

            if (m)
            {
                a = jQuery.clean([m[1]]);
            }
        }

        /**
         * Observe quando um array é passado.
         */
        this.set(a.constructor == Array || a.length && a != window && !a.nodeType && a[0] != undefined && a[0].nodeType ?
            /**
             * Suponha que seja um vetor de elementos DOM.
             */
            jQuery.merge(a, []) :

            /**
             * Encontre os elementos correspondentes e salve-os
             * para mais tarde.
             */
            jQuery.find(a, c)
        );

        /**
         * Veja se uma função extra foi fornecida.
         */
        var fn = arguments[arguments.length - 1];

        /**
         * Nesse caso, execute-o no contexto.
         */
        if (fn && typeof fn == "function")
        {
            this.each(fn);
        }

        return this;
    };

    /**
     * Mapeie sobre $ em caso de substituição.
     */
    if (typeof $ != "undefined")
    {
        jQuery._$ = $;
    }

    /**
     * Mapeie o namespace jQuery para o '$'.
     */
    var $ = jQuery;

    /**
     *
     */
    jQuery.fn = jQuery.prototype = {
        /**
         *
         */
        jquery: "1.0.4",

        /**
         *
         */
        size: function()
        {
            return this.length;
        },

        /**
         *
         */
        get: function(num)
        {
            return num == undefined ?
                /**
                 * Retorne um vetor 'clean' (limpo ?).
                 */
                jQuery.merge( this, [] ) :

                /**
                 * Retorne apenas o objeto.
                 */
                this[num];
        },

        /**
         *
         */
        set: function(array)
        {
            /**
             * Use um hack complicado para fazer o objeto jQuery
             * parecer um array.
             */
            this.length = 0;

            /**
             *
             */
            [].push.apply(this, array);

            /**
             *
             */
            return this;
        },

        /**
         *
         */
        each: function(fn, args)
        {
            return jQuery.each(this, fn, args);
        },

        /**
         *
         */
        index: function(obj)
        {
            var pos = -1;

            this.each(function(i)
            {
                if (this == obj)
                {
                    pos = i;
                }
            });

            return pos;
        },

        /**
         *
         */
        attr: function(key, value, type)
        {
            /**
             * Verifique se estamos definindo valores de estilo.
             */
            return key.constructor != String || value != undefined ?
                this.each(function()
                {
                    /**
                     * Veja se estamos definindo um hash de estilos.
                     */
                    if (value == undefined)
                    {
                        /**
                         * Defina todos os estilos.
                         */
                        for (var prop in key)
                        {
                            jQuery.attr(type ? this.style : this, prop, key[prop]);
                        }
                    } else
                    {
                        /**
                         * Veja se estamos definindo um único estilo
                         * de chave/valor.
                         */
                        jQuery.attr(type ? this.style : this, key, value);
                    }
                }) :

                /**
                 * Procure o caso em que estamos acessando um
                 * valor de estilo.
                 */
                jQuery[type || "attr"](this[0], key);
        },

        /**
         *
         */
        css: function(key, value)
        {
            return this.attr(key, value, "curCSS");
        },

        /**
         *
         */
        text: function(e)
        {
            e = e || this;

            var t = "";
            for (var j = 0; j < e.length; j++)
            {
                var r = e[j].childNodes;
                for (var i = 0; i < r.length; i++)
                {
                    if (r[i].nodeType != 8)
                    {
                        t += r[i].nodeType != 1 ? r[i].nodeValue : jQuery.fn.text([ r[i] ]);
                    }
                }
            }

            return t;
        },

        /**
         *
         */
        wrap: function()
        {
            /**
             * Os elementos para envolver o alvo.
             */
            var a = jQuery.clean(arguments);

            /**
             * Envolva cada um dos elementos correspondentes
             * individualmente.
             */
            return this.each(function()
            {
                /**
                 * Clone a estrutura que estamos usando para encapsular.
                 */
                var b = a[0].cloneNode(true);

                /**
                 * Insira-o antes do elemento a ser encapsulado.
                 */
                this.parentNode.insertBefore(b, this);

                /**
                 * Encontre o ponto mais profundo na estrutura
                 * envolvente.
                 */
                while (b.firstChild)
                {
                    b = b.firstChild;
                }

                /**
                 * Mova o elemento correspondente para dentro
                 * da estrutura wrap.
                 */
                b.appendChild(this);
            });
        },

        /**
         *
         */
        append: function()
        {
            return this.domManip(arguments, true, 1, function(a)
            {
                this.appendChild(a);
            });
        },

        /**
         *
         */
        prepend: function()
        {
            return this.domManip(arguments, true, -1, function(a)
            {
                this.insertBefore(a, this.firstChild);
            });
        },

        /**
         *
         */
        before: function()
        {
            return this.domManip(arguments, false, 1, function(a)
            {
                this.parentNode.insertBefore(a, this);
            });
        },

        /**
         *
         */
        after: function()
        {
            return this.domManip(arguments, false, -1, function(a)
            {
                this.parentNode.insertBefore(a, this.nextSibling);
            });
        },

        /**
         *
         */
        end: function()
        {
            if (!(this.stack && this.stack.length))
            {
                return this;
            }

            return this.set(this.stack.pop());
        },

        /**
         *
         */
        find: function(t)
        {
            return this.pushStack(
                jQuery.map(this, function(a)
                {
                    return jQuery.find(t, a);
                }), arguments
            );
        },

        /**
         *
         */
        clone: function(deep)
        {
            return this.pushStack(
                jQuery.map(this, function(a)
                {
                    return a.cloneNode(deep != undefined ? deep : true);
                }), arguments
            );
        },

        /**
         *
         */
        filter: function(t)
        {
            return this.pushStack(
                t.constructor == Array &&
                jQuery.map(this, function(a)
                {
                    for (var i = 0; i < t.length; i++)
                    {
                        if (jQuery.filter(t[i],[a]).r.length)
                        {
                            return a;
                        }
                    }

                    return null;
                }) ||

                t.constructor == Boolean &&
                (t ? this.get() : []) ||

                typeof t == "function" &&
                jQuery.grep(this, t) ||
                jQuery.filter(t, this).r, arguments
            );
        },

        /**
         *
         */
        not: function(t)
        {
            return this.pushStack(typeof t == "string" ?
                jQuery.filter(t,this,false).r :
                jQuery.grep(this, function(a)
                {
                    return a != t;
                }), arguments
            );
        },

        /**
         *
         */
        add: function(t)
        {
            return this.pushStack(
                jQuery.merge(this, typeof t == "string" ? jQuery.find(t) : t.constructor == Array ? t : [t]),
                arguments
            );
        },

        /**
         *
         */
        is: function(expr)
        {
            return expr ? jQuery.filter(expr, this).r.length > 0 : false;
        },

        /**
         *
         */
        domManip: function(args, table, dir, fn)
        {
            var clone = this.size() > 1;
            var a = jQuery.clean(args);

            return this.each(function()
            {
                var obj = this;

                if (table && this.nodeName.toUpperCase() == "TABLE" && a[0].nodeName.toUpperCase() != "THEAD")
                {
                    var tbody = this.getElementsByTagName("tbody");

                    if (!tbody.length)
                    {
                        obj = document.createElement("tbody");
                        this.appendChild(obj);
                    } else
                    {
                        obj = tbody[0];
                    }
                }

                for (var i = (dir < 0 ? a.length - 1 : 0); i != (dir < 0 ? dir : a.length); i += dir)
                {
                    fn.apply(obj, [clone ? a[i].cloneNode(true) : a[i]]);
                }
            });
        },

        /**
         *
         */
        pushStack: function(a, args)
        {
            var fn = args && args[args.length - 1];
            var fn2 = args && args[args.length - 2];

            if (fn && fn.constructor != Function)
            {
                fn = null;
            }

            if (fn2 && fn2.constructor != Function)
            {
                fn2 = null;
            }

            if (!fn)
            {
                if (!this.stack)
                {
                    this.stack = [];
                }

                this.stack.push(this.get());
                this.set(a);
            } else
            {
                var old = this.get();
                this.set(a);

                if (fn2 && a.length || !fn2)
                {
                    this.each(fn2 || fn).set(old);
                } else
                {
                    this.set(old).each(fn);
                }
            }

            return this;
        }
    };

    /**
     *
     */
    jQuery.extend = jQuery.fn.extend = function()
    {
        /**
         * Copiar referência para o objeto de destino.
         */
        var target = arguments[0], a = 1;

        /**
         * Estenda o próprio jQuery se apenas um argumento
         * for passado.
         */
        if (arguments.length == 1)
        {
            target = this;
            a = 0;
        }

        var prop;
        while (prop = arguments[a++])
        {
            /**
             * Estenda o objeto base.
             */
            for (var i in prop)
            {
                target[i] = prop[i];
            }
        }

        /**
         * Retorne o objeto modificado.
         */
        return target;
    };

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        init: function()
        {
            jQuery.initDone = true;
            jQuery.each(
                jQuery.macros.axis, function(i, n)
                {
                    jQuery.fn[i] = function(a)
                    {
                        var ret = jQuery.map(this,n);
                        if (a && typeof a == "string")
                        {
                            ret = jQuery.filter(a, ret).r;
                        }

                        return this.pushStack(ret, arguments);
                    };
                }
            );

            jQuery.each(
                jQuery.macros.to, function(i, n)
                {
                    jQuery.fn[i] = function()
                    {
                        var a = arguments;
                        return this.each(function()
                        {
                            for (var j = 0; j < a.length; j++)
                            {
                                jQuery(a[j])[n](this);
                            }
                        });
                    };
                }
            );

            jQuery.each(
                jQuery.macros.each, function(i, n)
                {
                    jQuery.fn[i] = function()
                    {
                        return this.each(n, arguments);
                    };
                }
            );

            jQuery.each(
                jQuery.macros.filter, function(i, n)
                {
                    jQuery.fn[n] = function(num, fn)
                    {
                        return this.filter(":" + n + "(" + num + ")", fn);
                    };
                }
            );

            jQuery.each(
                jQuery.macros.attr, function(i, n)
                {
                    n = n || i;
                    jQuery.fn[i] = function(h)
                    {
                        return h == undefined ? this.length ? this[0][n] : null : this.attr(n, h);
                    };
                }
            );

            jQuery.each(
                jQuery.macros.css, function(i, n)
                {
                    jQuery.fn[n] = function(h)
                    {
                        return h == undefined ? (this.length ? jQuery.css(this[0], n) : null) : this.css(n, h);
                    };
                }
            );
        },

        /**
         * Args é apenas para uso interno.
         */
        each: function(obj, fn, args)
        {
            if (obj.length == undefined)
            {
                for (var i in obj)
                {
                    fn.apply(obj[i], args || [i, obj[i]]);
                }
            } else
            {
                for ( var i = 0; i < obj.length; i++ )
                {
                    if (fn.apply(obj[i], args || [i, obj[i]]) === false)
                    {
                        break;
                    }
                }
            }

            return obj;
        },

        /**
         *
         */
        className: {
            /**
             *
             */
            add: function(o, c)
            {
                if (jQuery.className.has(o, c))
                {
                    return;
                }

                o.className += (o.className ? " " : "") + c;
            },

            /**
             *
             */
            remove: function(o, c)
            {
                if(!c)
                {
                    o.className = "";
                } else
                {
                    var classes = o.className.split(" ");
                    for (var i = 0; i < classes.length; i++)
                    {
                        if (classes[i] == c)
                        {
                            classes.splice(i, 1);
                            break;
                        }
                    }

                    o.className = classes.join(' ');
                }
            },

            /**
             *
             */
            has: function(e, a)
            {
                if (e.className != undefined)
                {
                    e = e.className;
                }

                return new RegExp("(^|\\s)" + a + "(\\s|$)").test(e);
            }
        },

        /**
         *
         */
        swap: function(e, o, f)
        {
            for (var i in o)
            {
                e.style["old" + i] = e.style[i];
                e.style[i] = o[i];
            }

            f.apply(e, []);
            for (var i in o)
            {
                e.style[i] = e.style["old" + i];
            }
        },

        /**
         *
         */
        css: function(e, p)
        {
            if (p == "height" || p == "width")
            {
                var old = {},
                    oHeight,
                    oWidth,
                    d = [
                        "Top",
                        "Bottom",
                        "Right",
                        "Left"
                    ];

                for (var i = 0; i < d.length; i++)
                {
                    old["padding" + d[i]] = 0;
                    old["border" + d[i] + "Width"] = 0;
                }

                jQuery.swap(e, old, function()
                {
                    if (jQuery.css(e, "display") != "none")
                    {
                        oHeight = e.offsetHeight;
                        oWidth = e.offsetWidth;
                    } else
                    {
                        e = jQuery(e.cloneNode(true))
                            .find(":radio").removeAttr("checked").end()
                            .css({
                                visibility: "hidden",
                                position: "absolute",
                                display: "block",
                                right: "0",
                                left: "0"
                            }).appendTo(e.parentNode)[0];

                        var parPos = jQuery.css(e.parentNode,"position");
                        if (parPos == "" || parPos == "static")
                        {
                            e.parentNode.style.position = "relative";
                        }

                        oHeight = e.clientHeight;
                        oWidth = e.clientWidth;

                        if (parPos == "" || parPos == "static")
                        {
                            e.parentNode.style.position = "static";
                        }

                        e.parentNode.removeChild(e);
                    }
                });

                return p == "height" ? oHeight : oWidth;
            }

            return jQuery.curCSS(e, p);
        },

        /**
         *
         */
        curCSS: function(elem, prop, force)
        {
            var ret;

            if (prop == 'opacity' && jQuery.browser.msie)
            {
                return jQuery.attr(elem.style, 'opacity');
            }

            if (prop == "float" || prop == "cssFloat")
            {
                prop = jQuery.browser.msie ? "styleFloat" : "cssFloat";
            }

            if (!force && elem.style[prop])
            {
                ret = elem.style[prop];
            } else if (document.defaultView && document.defaultView.getComputedStyle)
            {
                if (prop == "cssFloat" || prop == "styleFloat")
                {
                    prop = "float";
                }

                prop = prop.replace(/([A-Z])/g,"-$1").toLowerCase();
                var cur = document.defaultView.getComputedStyle(elem, null);

                if (cur)
                {
                    ret = cur.getPropertyValue(prop);
                } else if (prop == 'display')
                {
                    ret = 'none';
                } else
                {
                    jQuery.swap(elem, { display: 'block' }, function()
                    {
                        var c = document.defaultView.getComputedStyle(this, '');
                        ret = c && c.getPropertyValue(prop) || '';
                    });
                }
            } else if (elem.currentStyle)
            {
                var newProp = prop.replace(/\-(\w)/g, function(m, c)
                {
                    return c.toUpperCase();
                });

                ret = elem.currentStyle[prop] || elem.currentStyle[newProp];
            }

            return ret;
        },

        /**
         *
         */
        clean: function(a)
        {
            var r = [];
            for (var i = 0; i < a.length; i++)
            {
                var arg = a[i];
                if (typeof arg == "string")
                {
                    /**
                     * Converta string HTML em nós DOM. Corte os espaços
                     * em branco, caso contrário, indexOf não funcionará
                     * conforme o esperado.
                     */
                    var s = jQuery.trim(arg), div = document.createElement("div"), wrap = [0,"",""];

                    if (!s.indexOf("<opt"))
                    {
                        /**
                         * option ou optgroup.
                         */
                        wrap = [1, "<select>", "</select>"];
                    } else if (!s.indexOf("<thead") || !s.indexOf("<tbody"))
                    {
                        wrap = [1, "<table>", "</table>"];
                    } else if (!s.indexOf("<tr"))
                    {
                        /**
                         * tbody auto-inserted.
                         */
                        wrap = [2, "<table>", "</table>"];
                    } else if (!s.indexOf("<td") || !s.indexOf("<th"))
                    {
                        wrap = [3, "<table><tbody><tr>", "</tr></tbody></table>"];
                    }

                    /**
                     * Vá para html e volte, depois retire os wrappers extras.
                     */
                    div.innerHTML = wrap[1] + s + wrap[2];
                    while (wrap[0]--)
                    {
                        div = div.firstChild;
                    }

                    arg = div.childNodes;
                }

                /**
                 * Safari relata typeof em um DOM NodeList como uma função.
                 */
                if (arg.length != undefined && ((jQuery.browser.safari && typeof arg == 'function') || !arg.nodeType))
                {
                    /**
                     * Lida com coleções Array, jQuery, DOM NodeList.
                     */
                    for (var n = 0; n < arg.length; n++)
                    {
                        r.push(arg[n]);
                    }
                } else
                {
                    r.push(arg.nodeType ? arg : document.createTextNode(arg.toString()));
                }
            }

            return r;
        },

        /**
         *
         */
        expr: {
            "": "m[2]== '*'||a.nodeName.toUpperCase()==m[2].toUpperCase()",
            "#": "a.getAttribute('id')&&a.getAttribute('id')==m[2]",
            ":": {
                /**
                 * Verificações de posição.
                 */
                lt: "i<m[3]-0",
                gt: "i>m[3]-0",
                nth: "m[3]-0==i",
                eq: "m[3]-0==i",
                first: "i==0",
                last: "i==r.length-1",
                even: "i%2==0",
                odd: "i%2",

                /**
                 * Verificações de crianças.
                 */
                "nth-child": "jQuery.sibling(a,m[3]).cur",
                "first-child": "jQuery.sibling(a,0).cur",
                "last-child": "jQuery.sibling(a,0).last",
                "only-child": "jQuery.sibling(a).length==1",

                /**
                 * Verificações dos pais.
                 */
                parent: "a.childNodes.length",
                empty: "!a.childNodes.length",

                /**
                 * Verificação de texto.
                 */
                contains: "jQuery.fn.text.apply([a]).indexOf(m[3])>=0",

                /**
                 * Visibilidade.
                 */
                visible: "a.type!='hidden'&&jQuery.css(a,'display')!='none'&&jQuery.css(a,'visibility')!='hidden'",
                hidden: "a.type=='hidden'||jQuery.css(a,'display')=='none'||jQuery.css(a,'visibility')=='hidden'",

                /**
                 * Atributos do formulário.
                 */
                enabled: "!a.disabled",
                disabled: "a.disabled",
                checked: "a.checked",
                selected: "a.selected || jQuery.attr(a, 'selected')",

                /**
                 * Elementos de formulário.
                 */
                text: "a.type=='text'",
                radio: "a.type=='radio'",
                checkbox: "a.type=='checkbox'",
                file: "a.type=='file'",
                password: "a.type=='password'",
                submit: "a.type=='submit'",
                image: "a.type=='image'",
                reset: "a.type=='reset'",
                button: "a.type=='button'",
                input: "/input|select|textarea|button/i.test(a.nodeName)"
            },

            ".": "jQuery.className.has(a,m[2])",
            "@": {
                "=": "z==m[4]",
                "!=": "z!=m[4]",
                "^=": "z && !z.indexOf(m[4])",
                "$=": "z && z.substr(z.length - m[4].length,m[4].length)==m[4]",
                "*=": "z && z.indexOf(m[4])>=0",
                "": "z"
            },

            "[": "jQuery.find(m[2],a).length"
        },

        /**
         *
         */
        token: [
            "\\.\\.|/\\.\\.", "a.parentNode",
            ">|/", "jQuery.sibling(a.firstChild)",
            "\\+", "jQuery.sibling(a).next",
            "~", function(a)
            {
                var s = jQuery.sibling(a);

                return s.n >= 0 ? s.slice(s.n + 1) : [];
            }
        ],

        /**
         *
         */
        find: function(t, context)
        {
            /**
             * Certifique-se de que o contexto seja um elemento DOM.
             */
            if (context && context.nodeType == undefined)
            {
                context = null;
            }

            /**
             * Defina o contexto correto (se nenhum for fornecido).
             */
            context = context || document;

            if (t.constructor != String)
            {
                return [t];
            }

            if (!t.indexOf("//"))
            {
                context = context.documentElement;
                t = t.substr(2,t.length);
            } else if (!t.indexOf("/"))
            {
                context = context.documentElement;
                t = t.substr(1, t.length);

                /**
                 * FIX Suponha que o elemento raiz esteja correto.
                 */
                if (t.indexOf("/") >= 1)
                {
                    t = t.substr(t.indexOf("/"), t.length);
                }
            }

            var ret = [context];
            var done = [];
            var last = null;

            while (t.length > 0 && last != t)
            {
                var r = [];

                last = t;
                t = jQuery.trim(t).replace( /^\/\//i, "" );

                var foundToken = false;
                for (var i = 0; i < jQuery.token.length; i += 2)
                {
                    if (foundToken)
                    {
                        continue;
                    }

                    var re = new RegExp("^(" + jQuery.token[i] + ")");
                    var m = re.exec(t);

                    if (m)
                    {
                        r = ret = jQuery.map(ret, jQuery.token[i + 1]);
                        t = jQuery.trim(t.replace(re, ""));
                        foundToken = true;
                    }
                }

                if (!foundToken)
                {
                    if (!t.indexOf(",") || !t.indexOf("|"))
                    {
                        if (ret[0] == context)
                        {
                            ret.shift();
                        }

                        done = jQuery.merge(done, ret);
                        r = ret = [context];
                        t = " " + t.substr(1, t.length);
                    } else
                    {
                        var re2 = /^([#.]?)([a-z0-9\\*_-]*)/i;
                        var m = re2.exec(t);

                        if (m[1] == "#")
                        {
                            /**
                             * Ummm, deveria fazer isso funcionar em todos
                             * os documentos XML.
                             */
                            var oid = document.getElementById(m[2]);

                            r = ret = oid ? [oid] : [];
                            t = t.replace( re2, "" );
                        } else
                        {
                            if (!m[2] || m[1] == ".")
                            {
                                m[2] = "*";
                            }

                            for (var i = 0; i < ret.length; i++)
                            {
                                r = jQuery.merge(r, m[2] == "*" ? jQuery.getAll(ret[i]) : ret[i].getElementsByTagName(m[2]));
                            }
                        }
                    }
                }

                if (t)
                {
                    var val = jQuery.filter(t,r);

                    ret = r = val.r;
                    t = jQuery.trim(val.t);
                }
            }

            if (ret && ret[0] == context)
            {
                ret.shift();
            }

            done = jQuery.merge(done, ret);

            return done;
        },

        /**
         *
         */
        getAll: function(o, r)
        {
            r = r || [];

            var s = o.childNodes;
            for (var i = 0; i < s.length; i++)
            {
                if (s[i].nodeType == 1)
                {
                    r.push(s[i]);
                    jQuery.getAll(s[i], r);
                }
            }

            return r;
        },

        /**
         *
         */
        attr: function(elem, name, value)
        {
            var fix = {
                "for": "htmlFor",
                "class": "className",
                "float": jQuery.browser.msie ? "styleFloat" : "cssFloat",
                cssFloat: jQuery.browser.msie ? "styleFloat" : "cssFloat",
                innerHTML: "innerHTML",
                className: "className",
                value: "value",
                disabled: "disabled",
                checked: "checked",
                readonly: "readOnly"
            };

            /**
             * Na verdade, o IE usa filtros para opacidade ... elem
             * é na verdade elem.style.
             */
            if (name == "opacity" && jQuery.browser.msie && value != undefined)
            {
                /**
                 * O IE tem problemas com opacidade se não tiver
                 * layout. Prefiro verificar element.hasLayout
                 * primeiro, mas não tenho acesso ao elemento
                 * aqui.
                 */
                elem['zoom'] = 1; 

                /**
                 * Remova o filtro para evitar mais estranhezas do IE.
                 */
                if (value == 1)
                {
                    return elem["filter"] = elem["filter"].replace(/alpha\([^\)]*\)/gi, "");
                } else
                {
                    return elem["filter"] = elem["filter"].replace(/alpha\([^\)]*\)/gi, "") + "alpha(opacity=" + value * 100 + ")";
                }
            } else if (name == "opacity" && jQuery.browser.msie)
            {
                return elem["filter"] ? parseFloat(elem["filter"].match(/alpha\(opacity=(.*)\)/)[1]) / 100 : 1;
            }

            /**
             * Mozilla não funciona bem com opacity 1.
             */
            if (name == "opacity" && jQuery.browser.mozilla && value == 1)
            {
                value = 0.9999;
            }

            if (fix[name])
            {
                if (value != undefined)
                {
                    elem[fix[name]] = value;
                }

                return elem[fix[name]];
            } else if(value == undefined && jQuery.browser.msie && elem.nodeName && elem.nodeName.toUpperCase() == 'FORM' && (name == 'action' || name == 'method'))
            {
                return elem.getAttributeNode(name).nodeValue;
            } else if (elem.tagName)
            {
                /**
                 * IE elem.getAttribute passa até para estilo.
                 */
                if (value != undefined)
                {
                    elem.setAttribute(name, value);
                }

                return elem.getAttribute(name);
            } else
            {
                name = name.replace(/-([a-z])/ig, function(z, b)
                {
                    return b.toUpperCase();
                });

                if (value != undefined)
                {
                    elem[name] = value;
                }

                return elem[name];
            }
        },

        /**
         * As expressões regulares que alimentam o mecanismo de análise.
         */
        parse: [
            /**
             * Corresponder: [@value='test'], [@foo].
             */
            "\\[ *(@)S *([!*$^=]*) *('?\"?)(.*?)\\4 *\\]",

            /**
             * Corresponder: [div], [div p].
             */
            "(\\[)\s*(.*?)\s*\\]",

            /**
             * Corresponder: :contains('foo').
             */
            "(:)S\\(\"?'?([^\\)]*?)\"?'?\\)",

            /**
             * Corresponder: :even, :last-chlid.
             */
            "([:.#]*)S"
        ],

        /**
         *
         */
        filter: function(t, r, not)
        {
            /**
             * Descubra se estamos fazendo filtragem regular ou inversa.
             */
            var g = not !== false ? jQuery.grep : function(a, f)
            {
                return jQuery.grep(a, f, true);
            };

            while (t && /^[a-z[({<*:.#]/i.test(t))
            {
                var p = jQuery.parse;
                for (var i = 0; i < p.length; i++)
                {
                    /**
                     * Procure e substitua sequências semelhantes a strings
                     * e, finalmente, crie um regexp a partir delas.
                     */
                    var re = new RegExp("^" + p[i].replace("S", "([a-z*_-][a-z0-9_-]*)"), "i");
                    var m = re.exec(t);

                    if (m)
                    {
                        /**
                         * Reorganize a primeira correspondência.
                         */
                        if (!i)
                        {
                            m = ["", m[1], m[3], m[2], m[5]];
                        }

                        /**
                         * Remova o que acabamos de combinar.
                         */
                        t = t.replace(re, "");

                        break;
                    }
                }

                /**
                 * :not() é um caso especial que pode ser otimizado
                 * mantendo-o fora da lista de expressões.
                 */
                if (m[1] == ":" && m[2] == "not")
                {
                    r = jQuery.filter(m[3], r, false).r;
                } else
                {
                    /**
                     * Caso contrário, encontre a expressão a ser executada.
                     */

                    var f = jQuery.expr[m[1]];
                    if (f.constructor != String)
                    {
                        f = jQuery.expr[m[1]][m[2]];
                    }

                    /**
                     * Crie uma macro personalizada para incluí-la.
                     */
                    eval("f = function(a,i){" + (m[1] == "@" ? "z=jQuery.attr(a,m[3]);" : "") + "return " + f + "}");

                    /**
                     * Execute-o no filtro atual.
                     */
                    r = g(r, f);
                }
            }

            /**
             * Retorna um vetor de elementos filtrados (r)
             * e a string de expressão modificada (t).
             */
            return {
                r: r,
                t: t
            };
        },

        /**
         *
         */
        trim: function(t)
        {
            return t.replace(/^\s+|\s+$/g, "");
        },

        /**
         *
         */
        parents: function(elem)
        {
            var matched = [];
            var cur = elem.parentNode;

            while (cur && cur != document)
            {
                matched.push(cur);
                cur = cur.parentNode;
            }

            return matched;
        },

        /**
         *
         */
        sibling: function(elem, pos, not)
        {
            var elems = [];

            if (elem)
            {
                var siblings = elem.parentNode.childNodes;

                for (var i = 0; i < siblings.length; i++)
                {
                    if (not === true && siblings[i] == elem)
                    {
                        continue;
                    }

                    if (siblings[i].nodeType == 1)
                    {
                        elems.push(siblings[i]);
                    }

                    if (siblings[i] == elem)
                    {
                        elems.n = elems.length - 1;
                    }
                }
            }

            return jQuery.extend( elems, {
                last: elems.n == elems.length - 1,
                cur: pos == "even" && elems.n % 2 == 0 || pos == "odd" && elems.n % 2 || elems[pos] == elem,
                prev: elems[elems.n - 1],
                next: elems[elems.n + 1]
            });
        },

        /**
         *
         */
        merge: function(first, second)
        {
            var result = [];

            /**
             * Mova b para o novo array (isso ajuda a evitar
             * instâncias de StaticNodeList).
             */
            for (var k = 0; k < first.length; k++)
            {
                result[k] = first[k];
            }

            /**
             * Agora verifique se há duplicatas entre (a e b)
             * e adicione apenas os itens exclusivos.
             */
            for (var i = 0; i < second.length; i++)
            {
                var noCollision = true;

                /**
                 * O processo de verificação de colisão.
                 */
                for (var j = 0; j < first.length; j++)
                {
                    if (second[i] == first[j])
                    {
                        noCollision = false;
                    }
                }

                /**
                 * Se o item for exclusivo, adicione-o.
                 */
                if (noCollision)
                {
                    result.push(second[i]);
                }
            }

            return result;
        },

        /**
         *
         */
        grep: function(elems, fn, inv)
        {
            /**
             * Se uma string for passada para a função, crie uma
             * função para ela (um atalho útil).
             */
            if (typeof fn == "string")
            {
                fn = new Function("a","i","return " + fn);
            }

            var result = [];

            /**
             * Percorra o array, salvando apenas os itens que passam
             * na função validadora.
             */
            for (var i = 0; i < elems.length; i++)
            {
                if (!inv && fn(elems[i], i) || inv && !fn(elems[i], i))
                {
                    result.push(elems[i]);
                }
            }

            return result;
        },

        /**
         *
         */
        map: function(elems, fn)
        {
            /**
             * Se uma string for passada para a função, crie uma
             * função para ela (um atalho útil).
             */
            if (typeof fn == "string")
            {
                fn = new Function("a", "return " + fn);
            }

            var result = [];

            /**
             * Percorra o vetor, traduzindo cada um dos itens para
             * seu novo valor (ou valores).
             */
            for (var i = 0; i < elems.length; i++)
            {
                var val = fn(elems[i], i);

                if (val !== null && val != undefined)
                {
                    if (val.constructor != Array)
                    {
                        val = [val];
                    }

                    result = jQuery.merge(result, val);
                }
            }

            return result;
        },

        /**
         * Diversas funções auxiliares usadas para gerenciar eventos.
         * Muitas das ideias por trás deste código originaram-se da
         * biblioteca addEvent.
         */
        event: {
            /**
             * Vincule um evento a um elemento.
             */
            add: function(element, type, handler)
            {
                /**
                 * Por alguma razão, o IE tem problemas para passar
                 * o objeto da janela, fazendo com que ele seja clonado
                 * no processo.
                 */
                if (jQuery.browser.msie && element.setInterval != undefined)
                {
                    element = window;
                }

                /**
                 * Certifique-se de que a função que está sendo
                 * executada tenha um ID exclusivo.
                 */
                if (!handler.guid)
                {
                    handler.guid = this.guid++;
                }

                /**
                 * Inicie a estrutura de eventos do elemento.
                 */
                if (!element.events)
                {
                    element.events = {};
                }

                /**
                 * Obtenha a lista atual de funções vinculadas a este evento.
                 */
                var handlers = element.events[type];

                /**
                 * Se ainda não foi inicializado.
                 */
                if (!handlers)
                {
                    /**
                     * Inicie a fila do manipulador de eventos.
                     */
                    handlers = element.events[type] = {};

                    /**
                     * Lembre-se de um manipulador existente, se já estiver lá.
                     */
                    if (element["on" + type])
                    {
                        handlers[0] = element["on" + type];
                    }
                }

                /**
                 * Adicione a função à lista de manipuladores do elemento.
                 */
                handlers[handler.guid] = handler;

                /**
                 * E vincule o manipulador de eventos global ao elemento.
                 */
                element["on" + type] = this.handle;

                /**
                 * Lembre-se da função em uma lista global (para acionamento).
                 */
                if (!this.global[type])
                {
                    this.global[type] = [];
                }

                this.global[type].push(element);
            },

            /**
             *
             */
            guid: 1,

            /**
             *
             */
            global: {},

            /**
             * Desanexe um evento ou conjunto de eventos de um elemento.
             */
            remove: function(element, type, handler)
            {
                if (element.events)
                {
                    if (type && element.events[type])
                    {
                        if (handler)
                        {
                            delete element.events[type][handler.guid];
                        } else
                        {
                            for (var i in element.events[type])
                            {
                                delete element.events[type][i];
                            }
                        }
                    } else
                    {
                        for (var j in element.events)
                        {
                            this.remove(element, j);
                        }
                    }
                }
            },

            /**
             *
             */
            trigger: function(type, data, element)
            {
                /**
                 * Clone os dados recebidos, se houver.
                 */
                data = $.merge([], data || []);

                /**
                 * Lidar com um gatilho global.
                 */
                if (!element)
                {
                    var g = this.global[type];
                    if (g)
                    {
                        for (var i = 0; i < g.length; i++)
                        {
                            this.trigger(type, data, g[i]);
                        }
                    }

                    /**
                     * Lidar com o acionamento de um único elemento.
                     */
                } else if (element["on" + type])
                {
                    /**
                     * Passe adiante um evento falso.
                     */
                    data.unshift(this.fix({ type: type, target: element }));

                    /**
                     * Acione o evento.
                     */
                    element["on" + type].apply(element, data);
                }
            },

            /**
             *
             */
            handle: function(event)
            {
                if (typeof jQuery == "undefined")
                {
                    return false;
                }

                /**
                 * O objeto vazio é para eventos acionados sem dados
                 */
                event = jQuery.event.fix(event || window.event || {});

                /**
                 * Se nenhum evento correto for encontrado, falhe.
                 */
                if (!event)
                {
                    return false;
                }

                var returnValue = true;
                var c = this.events[event.type];

                var args = [].slice.call(arguments, 1);
                    args.unshift(event);

                for (var j in c)
                {
                    if (c[j].apply( this, args ) === false)
                    {
                        event.preventDefault();
                        event.stopPropagation();
                        returnValue = false;
                    }
                }

                /**
                 * Limpe as propriedades adicionadas no IE para evitar
                 * vazamento de memória.
                 */
                if (jQuery.browser.msie)
                {
                    event.target = event.preventDefault = event.stopPropagation = null;
                }

                return returnValue;
            },

            /**
             *
             */
            fix: function(event)
            {
                /**
                 * Verifique o IE.
                 */
                if (jQuery.browser.msie)
                {
                    /**
                     * Corrigir a propriedade do alvo, se disponível, a
                     * verificação evita a substituição do alvo falso
                     * proveniente do trigger.
                     */
                    if (event.srcElement)
                    {
                        event.target = event.srcElement;
                    }

                    /**
                     * Calcular pageX/Y.
                     */
                    var e = document.documentElement, b = document.body;
                    event.pageX = event.clientX + (e.scrollLeft || b.scrollLeft);
                    event.pageY = event.clientY + (e.scrollTop || b.scrollTop);

                    /**
                     * Verifique o safari e se o destino é um nó de texto.
                     */
                } else if (jQuery.browser.safari && event.target.nodeType == 3)
                {
                    /**
                     * Target para somente leitura, clone o objeto de evento.
                     */
                    event = jQuery.extend({}, event);

                    /**
                     * Obtenha o nó pai do nó de texto.
                     */
                    event.target = event.target.parentNode;
                }

                /**
                 * Corrigir o preventDefault e stopPropagation.
                 */
                if (!event.preventDefault)
                {
                    event.preventDefault = function()
                    {
                        this.returnValue = false;
                    };
                }

                if (!event.stopPropagation)
                {
                    event.stopPropagation = function()
                    {
                        this.cancelBubble = true;
                    };
                }

                return event;
            }
        }
    });

    /**
     * Se o modelo de caixa compatível com W3C está sendo usado.
     *
     * @property
     * @name $.boxModel
     * @type Boolean
     * @cat Javascript
     */
    new function()
    {
        var b = navigator.userAgent.toLowerCase();

        /**
         * Descubra qual navegador está sendo usado.
         */
        jQuery.browser = {
            safari: /webkit/.test(b),
            opera: /opera/.test(b),
            msie: /msie/.test(b) && !/opera/.test(b),
            mozilla: /mozilla/.test(b) && !/(compatible|webkit)/.test(b)
        };

        /**
         * Verifique se o modelo de caixa W3C está sendo usado.
         */
        jQuery.boxModel = !jQuery.browser.msie || document.compatMode == "CSS1Compat";
    };

    /**
     *
     */
    jQuery.macros = {
        to: {
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after"
        },

        css: "width,height,top,left,position,float,overflow,color,background".split(","),
        filter: [ "eq", "lt", "gt", "contains" ],
        attr: {
            val: "value",
            html: "innerHTML",
            id: null,
            title: null,
            name: null,
            href: null,
            src: null,
            rel: null
        },

        axis: {
            parent: "a.parentNode",
            ancestors: jQuery.parents,
            parents: jQuery.parents,
            next: "jQuery.sibling(a).next",
            prev: "jQuery.sibling(a).prev",
            siblings: "jQuery.sibling(a, null, true)",
            children: "jQuery.sibling(a.firstChild)"
        },

        each: {
            /**
             *
             */
            removeAttr: function(key)
            {
                jQuery.attr(this, key, "");
                this.removeAttribute(key);
            },

            /**
             *
             */
            show: function()
            {
                this.style.display = this.oldblock ? this.oldblock : "";

                if (jQuery.css(this,"display") == "none")
                {
                    this.style.display = "block";
                }
            },

            /**
             *
             */
            hide: function()
            {
                this.oldblock = this.oldblock || jQuery.css(this,"display");

                if (this.oldblock == "none")
                {
                    this.oldblock = "block";
                }

                this.style.display = "none";
            },

            /**
             *
             */
            toggle: function()
            {
                jQuery(this)[
                    jQuery(this).is(":hidden") ? "show" : "hide"
                ].apply(jQuery(this), arguments);
            },

            /**
             *
             */
            addClass: function(c)
            {
                jQuery.className.add(this, c);
            },

            /**
             *
             */
            removeClass: function(c)
            {
                jQuery.className.remove(this, c);
            },

            /**
             *
             */
            toggleClass: function(c)
            {
                jQuery.className[
                    jQuery.className.has(this, c) ? "remove" : "add"
                ](this, c);
            },

            /**
             *
             */
            remove: function(a)
            {
                if (!a || jQuery.filter(a, [this]).r)
                {
                    this.parentNode.removeChild(this);
                }
            },

            /**
             *
             */
            empty: function()
            {
                while (this.firstChild)
                {
                    this.removeChild(this.firstChild);
                }
            },

            /**
             *
             */
            bind: function(type, fn)
            {
                jQuery.event.add(this, type, fn);
            },

            /**
             *
             */
            unbind: function(type, fn)
            {
                jQuery.event.remove(this, type, fn);
            },

            /**
             *
             */
            trigger: function(type, data)
            {
                jQuery.event.trigger(type, data, this);
            }
        }
    };

    /**
     *
     */
    jQuery.init();
    jQuery.fn.extend({
        /**
         * Estamos substituindo a antiga função de alternância,
         * então lembre-se dela para mais tarde.
         */
        _toggle: jQuery.fn.toggle,

        /**
         *
         */
        toggle: function(a, b)
        {
            /**
             * Se duas funções forem passadas, alternaremos com um clique.
             */
            return a && b && a.constructor == Function && b.constructor == Function ? this.click(function(e)
            {
                /**
                 * Descubra qual função executar.
                 */
                this.last = this.last == a ? b : a;

                /**
                 * Certifique-se de que os cliques parem.
                 */
                e.preventDefault();

                /**
                 * E execute a função.
                 */
                return this.last.apply(this, [e]) || false;
            }) :

            /**
             * Caso contrário, execute a antiga função de alternância.
             */
            this._toggle.apply(this, arguments);
        },

        /**
         *
         */
        hover: function(f, g)
        {
            /**
             * Uma função privada para manipular o mouse 'hovering'.
             */
            function handleHover(e)
            {
                /**
                 * Verifique se mouse(over|out) ainda está dentro
                 * do mesmo elemento pai.
                 */
                var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;

                /**
                 * Atravesse a árvore.
                 */
                while (p && p != this)
                {
                    try
                    {
                        p = p.parentNode;
                    } catch(e)
                    {
                        p = this;
                    };
                }

                /**
                 * Se realmente passarmos o mouse sobre um subelemento,
                 * ignore-o.
                 */
                if (p == this)
                {
                    return false;
                }

                /**
                 * Execute a função correta.
                 */
                return (e.type == "mouseover" ? f : g).apply(this, [e]);
            }

            /**
             * Vincule a função aos dois ouvintes de eventos.
             */
            return this.mouseover(handleHover).mouseout(handleHover);
        },

        /**
         *
         */
        ready: function(f)
        {
            /**
             * Se o DOM já estiver pronto.
             */
            if (jQuery.isReady)
            {
                /**
                 * Execute a função imediatamente.
                 */
                f.apply(document);
            } else
            {
                /**
                 * Caso contrário, lembre-se da função para mais tarde.
                 */

                /**
                 * Adicione a função à lista de espera.
                 */
                jQuery.readyList.push(f);
            }

            return this;
        }
    });

    /**
     *
     */
    jQuery.extend({
        /**
         * Todo o código que faz o DOM Ready funcionar bem.
         */
        isReady: false,

        /**
         *
         */
        readyList: [],

        /**
         * Tratar quando o DOM estiver pronto.
         */
        ready: function()
        {
            /**
             * Certifique-se de que o DOM ainda não esteja carregado.
             */
            if (!jQuery.isReady)
            {
                /**
                 * Lembre-se que o DOM está pronto.
                 */
                jQuery.isReady = true;

                /**
                 * Se houver funções vinculadas, para executar.
                 */
                if (jQuery.readyList)
                {
                    /**
                     * Execute todos eles.
                     */
                    for (var i = 0; i < jQuery.readyList.length; i++)
                    {
                        jQuery.readyList[i].apply(document);
                    }

                    /**
                     * Redefina a lista de funções.
                     */
                    jQuery.readyList = null;
                }

                /**
                 * Remova o ouvinte de eventos para evitar vazamento
                 * de memória.
                 */
                if (jQuery.browser.mozilla || jQuery.browser.opera)
                {
                    document.removeEventListener("DOMContentLoaded", jQuery.ready, false);
                }
            }
        }
    });

    /**
     *
     */
    new function()
    {
        var e = (
            "blur," +
            "focus," +
            "load," +
            "resize," +
            "scroll," +
            "unload," +
            "click," +
            "dblclick," +
            "mousedown," +
            "mouseup," +
            "mousemove," +
            "mouseover," +
            "mouseout," +
            "change," +
            "reset," +
            "select," + 
            "submit," +
            "keydown," +
            "keypress," +
            "keyup," +
            "error"
        ).split(",");

        /**
         * Verifique todos os nomes de eventos, mas certifique-se
         * de que estejam devidamente incluídos.
         */
        for (var i = 0; i < e.length; i++)
        {
            new function()
            {
                var o = e[i];

                /**
                 * Lidar com vinculação de eventos.
                 */
                jQuery.fn[o] = function(f)
                {
                    return f ? this.bind(o, f) : this.trigger(o);
                };

                /**
                 * Lidar com a desvinculação de eventos.
                 */
                jQuery.fn["un" + o] = function(f)
                {
                    return this.unbind(o, f);
                };

                /**
                 * Finalmente, lide com eventos que são disparados
                 * apenas uma vez.
                 */
                jQuery.fn["one" + o] = function(f)
                {
                    /**
                     * Salve a referência clonada para isso.
                     */
                    var element = jQuery(this);
                    var handler = function()
                    {
                        /**
                         * Desvincular-se quando executado.
                         */
                        element.unbind(o, handler);
                        element = null;

                        /**
                         * Aplique o manipulador original com os mesmos
                         * argumentos.
                         */
                        return f.apply(this, arguments);
                    };

                    return this.bind(o, handler);
                };
            };
        }

        /**
         * Se o Mozilla for usado.
         */
        if (jQuery.browser.mozilla || jQuery.browser.opera)
        {
            /**
             * Use o prático retorno de chamada de evento.
             */
            document.addEventListener("DOMContentLoaded", jQuery.ready, false);

            /**
             * Se o IE for usado, use o excelente hack.
             * http://www.outofhanwell.com/blog/index.php?title=the_window_onload_problem_revisited.
             */
        } else if (jQuery.browser.msie)
        {
            /**
             * Só funciona se você document.write() isso.
             */
            document.write("<scr" + "ipt id=__ie_init defer=true " + "src=//:><\/script>");

            /**
             * Use o hack do script adiar.
             */
            var script = document.getElementById("__ie_init");

            if (script)
            {
                /**
                 * Script não existe se o jQuery for carregado dinamicamente.
                 */
                script.onreadystatechange = function()
                {
                    if (this.readyState != "complete")
                    {
                        return;
                    }

                    this.parentNode.removeChild(this);
                    jQuery.ready();
                };
            }

            /**
             * Limpe da memória.
             */
            script = null;

            /**
             * Se o Safari for usado.
             */
        } else if (jQuery.browser.safari)
        {
            /**
             * Verifique continuamente se document.readyState é válido.
             */
            jQuery.safariTimer = setInterval(function()
            {
                /**
                 * Carregado e concluído são estados válidos.
                 */
                if (document.readyState == "loaded" || document.readyState == "complete")
                {
                    /**
                     * Se algum deles for encontrado, remova o cronômetro.
                     */
                    clearInterval(jQuery.safariTimer);
                    jQuery.safariTimer = null;

                    /**
                     * E execute quaisquer funções de espera.
                     */
                    jQuery.ready();
                }
            }, 10);
        }

        /**
         * Um substituto para window.onload, que sempre funcionará.
         */
        jQuery.event.add(window, "load", jQuery.ready);
    };

    /**
     * Limpe após o IE para evitar vazamentos de memória.
     */
    if (jQuery.browser.msie)
    {
        jQuery(window).unload(function()
        {
            var event = jQuery.event, global = event.global;

            for (var type in global)
            {
                var els = global[type], i = els.length;

                if (i > 0)
                {
                    do
                    {
                        if (type != 'unload')
                        {
                            event.remove(els[i - 1], type);
                        }
                    } while (--i);
                }
            }
        });
    }

    /**
     *
     */
    jQuery.fn.extend({
        /**
         * Sobrescreva o antigo método show.
         */
        _show: jQuery.fn.show,

        /**
         *
         */
        show: function(speed, callback)
        {
            return speed ? this.animate({
                height: "show",
                width: "show",
                opacity: "show"
            }, speed, callback) : this._show();
        },

        /**
         * Substitua o antigo método hide.
         */
        _hide: jQuery.fn.hide,

        /**
         *
         */
        hide: function(speed, callback)
        {
            return speed ? this.animate({
                height: "hide",
                width: "hide",
                opacity: "hide"
            }, speed, callback) : this._hide();
        },

        /**
         *
         */
        slideDown: function(speed, callback)
        {
            return this.animate({
                height: "show"
            }, speed, callback);
        },

        /**
         *
         */
        slideUp: function(speed, callback)
        {
            return this.animate({
                height: "hide"
            }, speed, callback);
        },

        /**
         *
         */
        slideToggle: function(speed, callback)
        {
            return this.each(function()
            {
                var state = jQuery(this).is(":hidden") ? "show" : "hide";

                jQuery(this).animate({
                    height: state
                }, speed, callback);
            });
        },

        /**
         *
         */
        fadeIn: function(speed, callback)
        {
            return this.animate({
                opacity: "show"
            }, speed, callback);
        },

        /**
         *
         */
        fadeOut: function(speed, callback)
        {
            return this.animate({
                opacity: "hide"
            }, speed, callback);
        },

        /**
         *
         */
        fadeTo: function(speed, to, callback)
        {
            return this.animate({
                opacity: to
            }, speed, callback);
        },

        /**
         *
         */
        animate: function(prop, speed, callback)
        {
            return this.queue(function()
            {
                this.curAnim = jQuery.extend({}, prop);

                for (var p in prop)
                {
                    var e = new jQuery.fx( this, jQuery.speed(speed,callback), p );

                    if (prop[p].constructor == Number)
                    {
                        e.custom(e.cur(), prop[p]);
                    } else
                    {
                        e[prop[p]](prop);
                    }
                }
            });
        },

        /**
         *
         */
        queue: function(type, fn)
        {
            if (!fn)
            {
                fn = type;
                type = "fx";
            }

            return this.each(function()
            {
                if (!this.queue)
                {
                    this.queue = {};
                }

                if (!this.queue[type])
                {
                    this.queue[type] = [];
                }

                this.queue[type].push(fn);

                if (this.queue[type].length == 1)
                {
                    fn.apply(this);
                }
            });
        }
    });

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        speed: function(s, o)
        {
            o = o || {};

            if (o.constructor == Function)
            {
                o = {
                    complete: o
                };
            }

            var ss = {
                slow: 600,
                fast: 200
            };

            /**
             *
             */
            o.duration = (s && s.constructor == Number ? s : ss[s]) || 400;

            /**
             * Na fila.
             */
            o.oldComplete = o.complete;
            o.complete = function()
            {
                jQuery.dequeue(this, "fx");

                if (o.oldComplete && o.oldComplete.constructor == Function)
                {
                    o.oldComplete.apply(this);
                }
            };

            return o;
        },

        /**
         *
         */
        queue: {},

        /**
         *
         */
        dequeue: function(elem, type)
        {
            type = type || "fx";

            if (elem.queue && elem.queue[type])
            {
                /**
                 * Remova a si mesmo.
                 */
                elem.queue[type].shift();

                /**
                 * Obtenha a próxima função.
                 */
                var f = elem.queue[type][0];

                if (f)
                {
                    f.apply(elem);
                }
            }
        },

        /**
         * Eu escrevi originalmente fx() como um clone de moo.fx
         * e no processo de torná-lo pequeno, o código tornou-se
         * ilegível para pessoas sãs. Voce foi avisado.
         */
        fx: function(elem, options, prop)
        {
            var z = this;

            /**
             * As opções dos usuários.
             */
            z.o = {
                duration: options.duration || 400,
                complete: options.complete,
                step: options.step
            };

            /**
             * O elemento.
             */
            z.el = elem;

            /**
             * Os estilos.
             */
            var y = z.el.style;

            /**
             * Armazene a propriedade de exibição.
             */
            var oldDisplay = jQuery.css(z.el, 'display');

            /**
             * Defina a propriedade de exibição como bloco para animação.
             */
            y.display = "block";

            /**
             * Certifique-se de que nada escape.
             */
            y.overflow = "hidden";

            /**
             * Função simples para definir um valor de estilo.
             */
            z.a = function()
            {
                if (options.step)
                {
                    options.step.apply(elem, [z.now]);
                }

                if (prop == "opacity")
                {
                    /**
                     * Deixe attr lidar com a opacidade.
                     */
                    jQuery.attr(y, "opacity", z.now);
                } else if (parseInt(z.now))
                {
                    /**
                     * Questão: falhas no IE ?
                     */
                    y[prop] = parseInt(z.now) + "px";
                }
            };

            /**
             * Descubra o número máximo para correr.
             */
            z.max = function()
            {
                return parseFloat(jQuery.css(z.el, prop));
            };

            /**
             * Obtenha o tamanho atual.
             */
            z.cur = function()
            {
                var r = parseFloat(jQuery.curCSS(z.el, prop));

                return r && r > -10000 ? r : z.max();
            };

            /**
             * Inicie uma animação de um número para outro.
             */
            z.custom = function(from, to)
            {
                z.startTime = (new Date()).getTime();
                z.now = from;
                z.a();

                z.timer = setInterval(function()
                {
                    z.step(from, to);
                }, 13);
            };

            /**
             * Função 'show' simples.
             */
            z.show = function()
            {
                if (!z.el.orig)
                {
                    z.el.orig = {};
                }

                /**
                 * Lembre-se de onde começamos, para que possamos voltar
                 * mais tarde.
                 */
                z.el.orig[prop] = this.cur();
                z.o.show = true;

                /**
                 * Comece a animação.
                 */
                z.custom(0, z.el.orig[prop]);

                /**
                 * Questão: falhas no IE ?
                 */
                if (prop != "opacity")
                {
                    y[prop] = "1px";
                }
            };

            /**
             * Função 'hide' simples.
             */
            z.hide = function()
            {
                if (!z.el.orig)
                {
                    z.el.orig = {};
                }

                /**
                 * Lembre-se de onde começamos, para que possamos
                 * voltar mais tarde.
                 */
                z.el.orig[prop] = this.cur();
                z.o.hide = true;

                /**
                 * Comece a animação.
                 */
                z.custom(z.el.orig[prop], 0);
            };

            /**
             * Função 'toggle' simples.
             */
            z.toggle = function()
            {
                if (!z.el.orig)
                {
                    z.el.orig = {};
                }

                /**
                 * Lembre-se de onde começamos, para que possamos
                 * voltar mais tarde.
                 */
                z.el.orig[prop] = this.cur();

                if (oldDisplay == 'none')
                {
                    z.o.show = true;

                    /**
                     * Questão: falhas no IE ?
                     */
                    if (prop != "opacity")
                    {
                        y[prop] = "1px";
                    }

                    // Begin the animation
                    z.custom(0, z.el.orig[prop]);
                } else
                {
                    z.o.hide = true;

                    /**
                     * Comece a animação.
                     */
                    z.custom(z.el.orig[prop], 0);
                }
            };

            /**
             * Cada etapa de uma animação.
             */
            z.step = function(firstNum, lastNum)
            {
                var t = (new Date()).getTime();

                if (t > z.o.duration + z.startTime)
                {
                    /**
                     * Pare o cronômetro.
                     */
                    clearInterval(z.timer);

                    z.timer = null;
                    z.now = lastNum;
                    z.a();
                    z.el.curAnim[prop] = true;

                    var done = true;
                    for (var i in z.el.curAnim)
                    {
                        if (z.el.curAnim[i] !== true)
                        {
                            done = false;
                        }
                    }

                    if (done)
                    {
                        /**
                         * Redefina o overflow.
                         */
                        y.overflow = '';

                        /**
                         * Reinicialize a tela.
                         */
                        y.display = oldDisplay;

                        if (jQuery.css(z.el, 'display') == 'none')
                        {
                            y.display = 'block';
                        }

                        /**
                         * Oculte o elemento se a operação "hide" (ocultar ?)
                         * tiver sido realizada.
                         */
                        if (z.o.hide)
                        {
                            y.display = 'none';
                        }

                        /**
                         * Redefina as propriedades, se o item estiver
                         * oculto ou exibido.
                         */
                        if (z.o.hide || z.o.show)
                        {
                            for (var p in z.el.curAnim)
                            {
                                if (p == "opacity")
                                {
                                    jQuery.attr(y, p, z.el.orig[p]);
                                } else
                                {
                                    y[p] = '';
                                }
                            }
                        }
                    }

                    /**
                     * Se um retorno de chamada foi fornecido, execute-o.
                     */
                    if (done && z.o.complete && z.o.complete.constructor == Function)
                    {
                        /**
                         * Execute a função completa.
                         */
                        z.o.complete.apply(z.el);
                    }
                } else
                {
                    /**
                     * Descubra onde estamos na animação e defina o número.
                     */
                    var p = (t - this.startTime) / z.o.duration;

                    /**
                     *
                     */
                    z.now = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (lastNum-firstNum) + firstNum;

                    /**
                     * Execute a próxima etapa da animação.
                     */
                    z.a();
                }
            };
        }
    });

    /**
     *
     */
    jQuery.fn.extend({
        /**
         *
         */
        loadIfModified: function(url, params, callback)
        {
            this.load(url, params, callback, 1);
        },

        /**
         *
         */
        load: function(url, params, callback, ifModified)
        {
            if (url.constructor == Function)
            {
                return this.bind("load", url);
            }

            callback = callback || function(){};

            /**
             * O padrão é uma solicitação GET.
             */
            var type = "GET";

            /**
             * Se o segundo parâmetro foi fornecido.
             */
            if (params)
            {
                /**
                 * Se for uma função.
                 */
                if (params.constructor == Function)
                {
                    /**
                     * Presumimos que seja o retorno de chamada.
                     */
                    callback = params;
                    params = null;

                    /**
                     * Caso contrário, crie uma sequência de parâmetros.
                     */
                } else
                {
                    params = jQuery.param(params);
                    type = "POST";
                }
            }

            var self = this;

            /**
             * Solicite o documento remoto.
             */
            jQuery.ajax({
                url: url,
                type: type,
                data: params,
                ifModified: ifModified,
                complete: function(res, status)
                {
                    if (status == "success" || !ifModified && status == "notmodified")
                    {
                        /**
                         * Injete o HTML em todos os elementos correspondentes.
                         */
                        self.html(res.responseText)
                            /**
                             * Execute todos os scripts dentro do HTML
                             * recém-injetado.
                             */
                            .evalScripts()

                            /**
                             * Execute o callback.
                             */
                            .each(callback, [res.responseText, status, res]);
                    } else
                    {
                        callback.apply(self, [res.responseText, status, res]);
                    }
                }
            });

            return this;
        },

        /**
         *
         */
        serialize: function()
        {
            return jQuery.param(this);
        },

        /**
         *
         */
        evalScripts: function()
        {
            return this.find('script').each(function()
            {
                if (this.src)
                {
                    /**
                     * Por algum motivo estranho, não funciona se o
                     * callback for omitido.
                     */
                    jQuery.getScript(this.src);
                } else
                {
                    jQuery.globalEval(this.text || this.textContent || this.innerHTML || "");
                }
            }).end();
        }
    });

    /**
     * Se o IE for usado, crie um wrapper para o objeto XMLHttpRequest.
     */
    if (jQuery.browser.msie && typeof XMLHttpRequest == "undefined")
    {
        XMLHttpRequest = function()
        {
            return new ActiveXObject("Microsoft.XMLHTTP");
        };
    }

    /**
     * Anexe um monte de funções para lidar com eventos
     * AJAX comuns.
     */
    new function()
    {
        var e = "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(",");

        for (var i = 0; i < e.length; i++)
        {
            new function()
            {
                var o = e[i];

                jQuery.fn[o] = function(f)
                {
                    return this.bind(o, f);
                };
            };
        }
    };

    /**
     *
     */
    jQuery.extend({
        /**
         *
         */
        get: function(url, data, callback, type, ifModified)
        {
            /**
             * shift argumentos se o argumento de dados foi omitido.
             */
            if (data && data.constructor == Function)
            {
                callback = data;
                data = null;
            }

            /**
             * Delegar.
             */
            jQuery.ajax({
                url: url,
                data: data,
                success: callback,
                dataType: type,
                ifModified: ifModified
            });
        },

        /**
         *
         */
        getIfModified: function(url, data, callback, type)
        {
            jQuery.get(url, data, callback, type, 1);
        },

        /**
         *
         */
        getScript: function(url, callback)
        {
            if (callback)
            {
                jQuery.get(url, null, callback, "script");
            } else
            {
                jQuery.get(url, null, null, "script");
            }
        },

        /**
         *
         */
        getJSON: function(url, data, callback)
        {
            jQuery.get(url, data, callback, "json");
        },

        /**
         *
         */
        post: function(url, data, callback, type)
        {
            /**
             * Delegar.
             */
            jQuery.ajax({
                type: "POST",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },

        /**
         * timeout (ms).
         */
        timeout: 0,

        /**
         *
         */
        ajaxTimeout: function(timeout)
        {
            jQuery.timeout = timeout;
        },

        /**
         * Cache de título modificado pela última vez
         * para a próxima solicitação.
         */
        lastModified: {},

        /**
         *
         */
        ajax: function(s)
        {
            /**
             * TODO: introduz configurações globais, permitindo ao
             * cliente modificá-las para todas as solicitações, não
             * apenas para o tempo limite.
             */
            s = jQuery.extend({
                global: true,
                ifModified: false,
                type: "GET",
                timeout: jQuery.timeout,
                complete: null,
                success: null,
                error: null,
                dataType: null,
                url: null,
                data: null,
                contentType: "application/x-www-form-urlencoded",
                processData: true,
                async: true,
                beforeSend: null
            }, s);

            /**
             * Se houver dados disponíveis.
             */
            if (s.data)
            {
                /**
                 * Converter dados se ainda não for uma string.
                 */
                if (s.processData && typeof s.data != 'string')
                {
                    s.data = jQuery.param(s.data);
                }

                /**
                 * Anexe dados ao URL para obter solicitações.
                 */
                if (s.type.toLowerCase() == "get")
                {
                    /**
                     * "?" + data ou "&" + data (caso já existam parâmetros).
                     */
                    s.url += ((s.url.indexOf("?") > -1) ? "&" : "?") + s.data;
                }
            }

            /**
             * Fique atento a um novo conjunto de solicitações.
             */
            if (s.global && ! jQuery.active++)
            {
                jQuery.event.trigger( "ajaxStart" );
            }

            var requestDone = false;

            /**
             * Crie o objeto de solicitação.
             */
            var xml = new XMLHttpRequest();

            /**
             * Abrir o soquete.
             */
            xml.open(s.type, s.url, s.async);

            /**
             * Defina o título correto, se os dados estiverem
             * sendo enviados.
             */
            if (s.data)
            {
                xml.setRequestHeader("Content-Type", s.contentType);
            }

            /**
             * Defina o título If-Modified-Since, se for modo ifModified.
             */
            if (s.ifModified)
            {
                xml.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT");
            }

            /**
             * Defina o título para que o script chamado saiba
             * que é um XMLHttpRequest.
             */
            xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");

            /**
             * Certifique-se de que o navegador envie o tamanho
             * correto do conteúdo.
             */
            if (xml.overrideMimeType)
            {
                xml.setRequestHeader("Connection", "close");
            }

            /**
             * Permitir personalização de headers/mimetypes.
             */
            if (s.beforeSend)
            {
                s.beforeSend(xml);
            }

            if (s.global)
            {
                jQuery.event.trigger("ajaxSend", [xml, s]);
            }

            /**
             * Aguarde uma resposta para voltar.
             */
            var onreadystatechange = function(isTimeout)
            {
                /**
                 * A transferência foi concluída e os dados estão
                 * disponíveis ou a solicitação expirou.
                 */
                if (xml && (xml.readyState == 4 || isTimeout == "timeout"))
                {
                    requestDone = true;

                    var status = jQuery.httpSuccess(xml) && isTimeout != "timeout" ?
                        s.ifModified && jQuery.httpNotModified(xml, s.url) ? "notmodified" : "success" : "error";

                    /**
                     * Certifique-se de que a solicitação foi bem-sucedida
                     * ou não foi modificada.
                     */
                    if (status != "error")
                    {
                        /**
                         * Título Last-Modified em cache, se estiver
                         * no modo ifModified.
                         */
                        var modRes;

                        /**
                         * Exceção de swallow lançada por FF se o
                         * título não estiver disponível.
                         */
                        try
                        {
                            modRes = xml.getResponseHeader("Last-Modified");
                        } catch(e)
                        {
                        }

                        if (s.ifModified && modRes)
                        {
                            jQuery.lastModified[s.url] = modRes;
                        }

                        /**
                         * Processar os dados (executa o xml por meio de
                         * httpData independentemente do retorno de chamada).
                         */
                        var data = jQuery.httpData(xml, s.dataType);

                        /**
                         * Se um retorno de chamada local foi especificado,
                         * acione-o e transmita os dados.
                         */
                        if (s.success)
                        {
                            s.success(data, status);
                        }

                        /**
                         * Envie o retorno de chamada global.
                         */
                        if (s.global)
                        {
                            jQuery.event.trigger("ajaxSuccess", [xml, s]);
                        }

                        /**
                         * Caso contrário, a solicitação não foi bem-sucedida.
                         */
                    } else
                    {
                        /**
                         * Se um retorno de chamada local foi especificado,
                         * envie-o.
                         */
                        if (s.error)
                        {
                            s.error(xml, status);
                        }

                        /**
                         * Envie o retorno de chamada global.
                         */
                        if(s.global)
                        {
                            jQuery.event.trigger("ajaxError", [xml, s]);
                        }
                    }

                    /**
                     * A solicitação foi concluída.
                     */
                    if (s.global)
                    {
                        jQuery.event.trigger("ajaxComplete", [xml, s]);
                    }

                    /**
                     * Lidar com o contador AJAX global.
                     */
                    if (s.global && !--jQuery.active)
                    {
                        jQuery.event.trigger("ajaxStop");
                    }

                    /**
                     * Resultado do processo.
                     */
                    if (s.complete)
                    {
                        s.complete(xml, status);
                    }

                    /**
                     * Pare de vazamentos de memória.
                     */
                    xml.onreadystatechange = function() {};
                    xml = null;
                }
            };

            /**
             *
             */
            xml.onreadystatechange = onreadystatechange;

            /**
             * Verificador de tempo limite.
             */
            if (s.timeout > 0)
                setTimeout(function()
                {
                    /**
                     * Verifique se a solicitação ainda está acontecendo.
                     */
                    if (xml)
                    {
                        /**
                         * Cancele a solicitação.
                         */
                        xml.abort();

                        if (!requestDone)
                        {
                            onreadystatechange("timeout");
                        }

                        /**
                         * Limpe da memória.
                         */
                        xml = null;
                    }
                }, s.timeout);

            /**
             * Envie os dados.
             */
            xml.send(s.data);

            /**
             * Retorne XMLHttpRequest para permitir o aborto
             * da solicitação, etc.
             */
            return xml;
        },

        /**
         * Contador para armazenar o número de consultas
         * ativas.
         */
        active: 0,

        /**
         * Determina se um XMLHttpRequest foi bem-sucedido ou não.
         */
        httpSuccess: function(r)
        {
            try
            {
                return !r.status && location.protocol == "file:" || (r.status >= 200 && r.status < 300) || r.status == 304 || jQuery.browser.safari && r.status == undefined;
            } catch(e)
            {
            }

            return false;
        },

        /**
         * Determina se um XMLHttpRequest retorna NotModified.
         */
        httpNotModified: function(xml, url)
        {
            try
            {
                var xmlRes = xml.getResponseHeader("Last-Modified");

                /**
                 * O Firefox sempre retorna 200. verifique a data da
                 * última modificação.
                 */
                return xml.status == 304 || xmlRes == jQuery.lastModified[url] || jQuery.browser.safari && xml.status == undefined;
            } catch(e)
            {
            }

            return false;
        },

        /**
         * Obtenha os dados de um XMLHttpRequest. Retorna XML
         * analisado se o título do tipo de conteúdo for "xml"
         * e o tipo for "xml" ou omitido, caso contrário, retorne
         * texto simples. (String) data - O tipo de dados que você
         * espera retornar (por exemplo, "xml", "html", "script").
         */
        httpData: function(r, type)
        {
            var ct = r.getResponseHeader("content-type");
            var data = !type && ct && ct.indexOf("xml") >= 0;
                data = type == "xml" || data ? r.responseXML : r.responseText;

            /**
             * Se o tipo for "script", avalie-o no contexto global.
             */
            if (type == "script")
            {
                jQuery.globalEval(data);
            }

            /**
             * Obtenha o objeto JavaScript, se JSON for usado.
             */
            if (type == "json")
            {
                eval("data = " + data);
            }

            /**
             * Avaliar scripts em HTML.
             */
            if (type == "html")
            {
                jQuery("<div>").html(data).evalScripts();
            }

            return data;
        },

        /**
         * Serialize um vetor de elementos de formulário ou um
         * conjunto de chaves/valores em uma string de consulta.
         */
        param: function(a)
        {
            var s = [];

            /**
             * Se um array foi passado, suponha que seja um
             * array de elementos de formulário.
             */
            if (a.constructor == Array || a.jquery)
            {
                /**
                 * Serialize os elementos do formulário.
                 */
                for (var i = 0; i < a.length; i++)
                {
                    s.push(a[i].name + "=" + encodeURIComponent(a[i].value));
                }

                /**
                 * Caso contrário, suponha que seja um objeto de pares
                 * chave/valor.
                 */
            } else
            {
                /**
                 * Serialize as chaves/valores.
                 */
                for (var j in a)
                {
                    /**
                     * Se o valor for um vetor, os nomes das chaves
                     * precisarão ser repetidos.
                     */
                    if (a[j].constructor == Array)
                    {
                        for (var k = 0; k < a[j].length; k++)
                        {
                            s.push(j + "=" + encodeURIComponent(a[j][k]));
                        }
                    } else
                    {
                        s.push(j + "=" + encodeURIComponent(a[j]));
                    }
                }
            }

            /**
             * Retorne a serialização resultante.
             */
            return s.join("&");
        },

        /**
         * Avalia um script em contexto global não confiável
         * para safari.
         */
        globalEval: function(data)
        {
            if (window.execScript)
            {
                window.execScript(data);
            } else if(jQuery.browser.safari)
            {
                /**
                 * Safari não fornece uma avaliação global síncrona.
                 */
                window.setTimeout(data, 0);
            } else
            {
                eval.call(window, data);
            }
        }
    });
}
