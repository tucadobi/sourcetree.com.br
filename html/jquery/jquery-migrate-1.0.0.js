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
 *
 */
(function(jQuery, window, undefined)
{
    "use strict";

    /**
     *
     */
    var warnedAbout = {};

    /**
     * Lista de avisos já dados; somente leitura pública.
     */
    jQuery.migrateWarnings = [];

    /**
     * //
     * // Defina como verdadeiro para evitar a saída
     * // do console; migrateWarnings ainda mantido.
     * //
     * jQuery.migrateMute = false;
     */

    /**
     * Esqueça todos os avisos que já demos; público.
     */
    jQuery.migrateReset = function()
    {
        warnedAbout = {};
        jQuery.migrateWarnings.length = 0;
    };

    /**
     *
     */
    function migrateWarn(msg)
    {
        if (!warnedAbout[msg])
        {
            warnedAbout[msg] = true;
            jQuery.migrateWarnings.push(msg);

            if (window.console && console.warn && !jQuery.migrateMute)
            {
                console.warn("JQMIGRATE: " + msg);
            }
        }
    }

    /**
     *
     */
    function migrateWarnProp(obj, prop, value, msg)
    {
        if (Object.defineProperty)
        {
            /**
             * Em navegadores ES5 (não antigos), avisa se o código
             * tentar obter prop; permitir que a propriedade seja
             * substituída caso algum outro plugin queira.
             */
            try
            {
                Object.defineProperty(obj, prop, {
                    configurable: true,
                    enumerable: true,

                    /**
                     *
                     */
                    get: function()
                    {
                        migrateWarn(msg);

                        return value;
                    },

                    /**
                     *
                     */
                    set: function(newValue)
                    {
                        migrateWarn(msg);
                        value = newValue;
                    }
                });

                return;
            } catch(err)
            {
                /**
                 * Questão: O IE8 é tem falhas sobre Object.defineProperty ?
                 *     - Resposta: não posso avisar sobre isso.
                 */
            }
        }

        /**
         * Navegador não ES5 (ou com falhas); basta definir a propriedade.
         */
        jQuery._definePropertyBroken = true;
        obj[prop] = value;
    }

    /**
     *
     */
    if (document.compatMode === "BackCompat")
    {
        /**
         * jQuery nunca suportou ou testou o modo Quirks.
         */
        migrateWarn("jQuery is not compatible with Quirks Mode");
    }

    /**
     *
     */
    var attrFn = {},
        attr = jQuery.attr,
        valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get || function() { return null; },
        valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set || function() { return undefined; },
        rnoType = /^(?:input|button)$/i,
        rnoAttrNodeType = /^[238]$/,
        rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        ruseDefault = /^(?:checked|selected)$/i;

    /**
     * jQuery.attrFn.
     */
    migrateWarnProp(jQuery, "attrFn", attrFn, "jQuery.attrFn is deprecated");

    /**
     *
     */
    jQuery.attr = function(elem, name, value, pass)
    {
        var lowerName = name.toLowerCase(),
            nType = elem && elem.nodeType;

        if (pass)
        {
            migrateWarn("jQuery.fn.attr( props, pass ) is deprecated");

            if (elem && !rnoAttrNodeType.test(nType) && jQuery.isFunction(jQuery.fn[name]))
            {
                return jQuery(elem)[name](value);
            }
        }

        /**
         * Avisar se o usuário tentar definir `type`, pois
         * ele falha no IE 6/7/8.
         */
        if (name === "type" && value !== undefined && rnoType.test(elem.nodeName))
        {
            migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
        }

        /**
         * Restaure boolHook para sincronização de propriedades/atributos
         * booleanos.
         */
        if (!jQuery.attrHooks[lowerName] && rboolean.test(lowerName))
        {
            jQuery.attrHooks[lowerName] = {
                /**
                 *
                 */
                get: function(elem, name)
                {
                    /**
                     * Alinhe atributos booleanos com propriedades
                     * correspondentes. Volte para atribuir presença
                     * onde alguns booleanos não são suportados.
                     */
                    var attrNode, property = jQuery.prop(elem, name);

                    /**
                     *
                     */
                    return property === true || typeof property !== "boolean" && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== false ? name.toLowerCase() : undefined;
                },

                /**
                 *
                 */
                set: function(elem, value, name)
                {
                    var propName;

                    if (value === false)
                    {
                        /**
                         * Remova atributos booleanos quando definidos
                         * como falso.
                         */
                        jQuery.removeAttr(elem, name);
                    } else
                    {
                        /**
                         * value é verdadeiro, pois sabemos que neste ponto
                         * é do tipo booleano e não falso. Defina atributos
                         * booleanos com o mesmo nome e defina a propriedade
                         * DOM.
                         */
                        propName = jQuery.propFix[name] || name;

                        if (propName in elem)
                        {
                            /**
                             * Defina o IDL especificamente apenas se ele
                             * já existir no elemento.
                             */
                            elem[propName] = true;
                        }

                        elem.setAttribute(name, name.toLowerCase());
                    }

                    return name;
                }
            };

            /**
             * Avisar apenas para atributos que podem permanecer
             * distintos de suas propriedades após 1.9.
             */
            if (ruseDefault.test(lowerName))
            {
                migrateWarn("jQuery.fn.attr(" + lowerName + ") may use property instead of attribute");
            }
        }

        return attr.call(jQuery, elem, name, value);
    };

    /**
     * attrHooks: value.
     */
    jQuery.attrHooks.value = {
        /**
         *
         */
        get: function(elem, name)
        {
            var nodeName = (elem.nodeName || "").toLowerCase();

            if (nodeName === "button")
            {
                return valueAttrGet.apply(this, arguments);
            }

            if (nodeName !== "input" && nodeName !== "option")
            {
                migrateWarn("property-based jQuery.fn.attr('value') is deprecated");
            }

            return name in elem ? elem.value : null;
        },

        /**
         *
         */
        set: function(elem, value)
        {
            var nodeName = (elem.nodeName || "").toLowerCase();

            if (nodeName === "button")
            {
                return valueAttrSet.apply(this, arguments);
            }

            if (nodeName !== "input" && nodeName !== "option")
            {
                migrateWarn("property-based jQuery.fn.attr('value', val) is deprecated");
            }

            /**
             * Não retorna para que setAttribute também seja usado.
             */
            elem.value = value;
        }
    };

    /**
     *
     */
    var matched,
        browser,
        oldInit = jQuery.fn.init,
        /**
         * Observe que isso NÃO inclui a correção #XSS da versão 1.7!
         */
        rquickExpr = /^(?:.*(<[\w\W]+>)[^>]*|#([\w\-]*))$/;

    /**
     * $(html) "looks like html" mudança de regra.
     */
    jQuery.fn.init = function(selector, context, rootjQuery)
    {
        var match;

        if (selector && typeof selector === "string" && !jQuery.isPlainObject(context) && (match = rquickExpr.exec(selector)) && match[1])
        {
            /**
             * Esta é uma string HTML de acordo com as regras "antigas";
             * ainda está ?
             */
            if (selector.charAt( 0 ) !== "<")
            {
                migrateWarn("$(html) HTML strings must start with '<' character");
            }

            /**
             * Agora processe usando regras flexíveis; deixe o
             * pré-1.8 tocar também.
             */
            if (context && context.context)
            {
                /**
                 * Objeto jQuery como contexto; parseHTML espera
                 * um objeto DOM.
                 */
                context = context.context;
            }

            if (jQuery.parseHTML)
            {
                return oldInit.call(this, jQuery.parseHTML(jQuery.trim(selector), context, true), context, rootjQuery);
            }
        }

        return oldInit.apply(this, arguments);
    };

    /**
     *
     */
    jQuery.fn.init.prototype = jQuery.fn;
    jQuery.uaMatch = function(ua)
    {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };

    /**
     *
     */
    matched = jQuery.uaMatch(navigator.userAgent);

    /**
     *
     */
    browser = {};

    /**
     *
     */
    if (matched.browser)
    {
        browser[matched.browser] = true;
        browser.version = matched.version;
    }

    /**
     * Chrome é Webkit, mas Webkit também é Safari.
     */
    if (browser.chrome)
    {
        browser.webkit = true;
    } else if (browser.webkit)
    {
        browser.safari = true;
    }

    /**
     *
     */
    jQuery.browser = browser;

    /**
     * Avisar se o código tentar obter o jQuery.browser.
     */
    migrateWarnProp(jQuery, "browser", browser, "jQuery.browser is deprecated");

    /**
     *
     */
    jQuery.sub = function()
    {
        function jQuerySub(selector, context)
        {
            return new jQuerySub.fn.init(selector, context);
        }

        jQuery.extend(true, jQuerySub, this);
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;

        jQuerySub.fn.init = function init(selector, context)
        {
            if (context && context instanceof jQuery && !(context instanceof jQuerySub))
            {
                context = jQuerySub(context);
            }

            return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
        };

        jQuerySub.fn.init.prototype = jQuerySub.fn;

        var rootjQuerySub = jQuerySub(document);
            migrateWarn("jQuery.sub() is deprecated");

        return jQuerySub;
    };

    /**
     *
     */
    var oldFnData = jQuery.fn.data;

    /**
     *
     */
    jQuery.fn.data = function(name)
    {
        var ret,
            evt,
            elem = this[0];

        /**
         * Lida com 1.7 que tem esse comportamento e 1.8 que não tem.
         */
        if (elem && name === "events" && arguments.length === 1)
        {
            ret = jQuery.data(elem, name);
            evt = jQuery._data(elem, name);

            if ((ret === undefined || ret === evt) && evt !== undefined)
            {
                migrateWarn("Use of jQuery.fn.data('events') is deprecated");

                return evt;
            }
        }

        return oldFnData.apply(this, arguments);
    };

    /**
     *
     */
    var rscriptType = /\/(java|ecma)script/i,
        oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack,
        oldFragment = jQuery.buildFragment;

    /**
     *
     */
    jQuery.fn.andSelf = function()
    {
        migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");

        return oldSelf.apply(this, arguments);
    };

    /**
     * Como jQuery.clean é usado internamente em versões
     * mais antigas, apenas corrigimos se estiver faltando.
     */
    if (!jQuery.clean)
    {
        jQuery.clean = function(elems, context, fragment, scripts)
        {
            /**
             * Defina o contexto de acordo com a lógica 1.8.
             */
            context = context || document;
            context = !context.nodeType && context[0] || context;
            context = context.ownerDocument || context;

            migrateWarn("jQuery.clean() is deprecated");

            var i,
                elem,
                handleScript,
                jsTags,
                ret = [];

            jQuery.merge(ret, jQuery.buildFragment(elems, context).childNodes);

            /**
             * Lógica complexa retirada diretamente do jQuery 1.8.
             */
            if (fragment)
            {
                /**
                 * Tratamento especial de cada elemento do script.
                 */
                handleScript = function(elem)
                {
                    /**
                     * Verifique se o consideramos executável.
                     */
                    if (!elem.type || rscriptType.test(elem.type))
                    {
                        /**
                         * Desanexe o script e armazene-o no vetor de
                         * scripts (se fornecida) ou no fragmento. Retorne
                         * a verdade para indicar que foi tratado.
                         */
                        return scripts ? scripts.push(elem.parentNode ? elem.parentNode.removeChild(elem) : elem) : fragment.appendChild(elem);
                    }
                };

                for (i = 0; (elem = ret[i]) != null; i++)
                {
                    /**
                     * Verifique se terminamos depois de manipular um
                     * script executável.
                     */
                    if (!(jQuery.nodeName(elem, "script") && handleScript(elem)))
                    {
                        /**
                         * Anexar para fragmentar e manipular scripts incorporados.
                         */
                        fragment.appendChild(elem);

                        if (typeof elem.getElementsByTagName !== "undefined")
                        {
                            /**
                             * handleScript altera o DOM, então use jQuery.merge
                             * para garantir a iteração do instantâneo.
                             */
                            jsTags = jQuery.grep(jQuery.merge([], elem.getElementsByTagName("script")), handleScript);

                            /**
                             * Divida os scripts em ret após seu ancestral
                             * anterior e avance nosso índice além deles.
                             */
                            ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
                            i += jsTags.length;
                        }
                    }
                }
            }

            return ret;
        };
    }

    /**
     *
     */
    jQuery.buildFragment = function(elems, context, scripts, selection)
    {
        var ret,
            warning = "jQuery.buildFragment() is deprecated";

        /**
         * Defina o contexto de acordo com a lógica 1.8.
         */
        context = context || document;
        context = !context.nodeType && context[0] || context;
        context = context.ownerDocument || context;

        try
        {
            ret = oldFragment.call(jQuery, elems, context, scripts, selection);

            /**
             * jQuery < 1.8 requer contexto de array;
             * jQuery 1.9 falha nisso.
             */
        } catch(x)
        {
            ret = oldFragment.call(jQuery, elems, context.nodeType ? [context] : context[0], scripts, selection);

            /**
             * O sucesso do ajuste do contexto significa que
             * buildFragment foi chamado pelo usuário.
             */
            migrateWarn(warning);
        }

        /**
         * jQuery <1.9 retornou um objeto em vez do próprio fragmento.
         */
        if (!ret.fragment)
        {
            migrateWarnProp(ret, "fragment", ret, warning);
            migrateWarnProp(ret, "cacheable", false, warning);
        }

        return ret;
    };

    /**
     *
     */
    var eventAdd = jQuery.event.add,
        eventRemove = jQuery.event.remove,
        eventTrigger = jQuery.event.trigger,
        oldToggle = jQuery.fn.toggle,
        oldLive = jQuery.fn.live,
        oldDie = jQuery.fn.die,
        ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
        rajaxEvent = new RegExp("\\b(?:" + ajaxEvents + ")\\b"),
        rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
        hoverHack = function(events)
        {
            if (typeof(events) != "string" || jQuery.event.special.hover)
            {
                return events;
            }

            if (rhoverHack.test(events))
            {
                migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'");
            }

            return events && events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
        };

    /**
     * Adereços de evento removidos em 1.9, coloque-os de volta
     * se necessário; nenhuma maneira prática de avisá-los.
     */
    if (jQuery.event.props && jQuery.event.props[0] !== "attrChange")
    {
        jQuery.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement");
    }

    /**
     * O jQuery.event.handle não documentado foi "obsoleto"
     * no jQuery 1.7.
     */
    migrateWarnProp( jQuery.event, "handle", jQuery.event.dispatch, "jQuery.event.handle is undocumented and deprecated" );

    /**
     * Suporte para avisos de pseudoevento 'hover' e eventos ajax.
     */
    jQuery.event.add = function(elem, types, handler, data, selector)
    {
        if (elem !== document && rajaxEvent.test(types))
        {
            migrateWarn("AJAX events should be attached to document: " + types);
        }

        eventAdd.call(this, elem, hoverHack(types || ""), handler, data, selector);
    };

    /**
     *
     */
    jQuery.event.remove = function(elem, types, handler, selector, mappedTypes)
    {
        eventRemove.call(this, elem, hoverHack(types) || "", handler, selector, mappedTypes);
    };

    /**
     *
     */
    jQuery.fn.error = function()
    {
        var args = Array.prototype.slice.call( arguments, 0);

        migrateWarn("jQuery.fn.error() is deprecated");
        args.splice(0, 0, "error");

        if (arguments.length)
        {
            return this.bind.apply(this, args);
        }

        /**
         * O evento de erro não deve aparecer na janela, embora
         * isso aconteça antes da versão 1.7.
         */
        this.triggerHandler.apply(this, args);

        return this;
    };

    /**
     *
     */
    jQuery.fn.toggle = function(fn, fn2)
    {
        /**
         * Não mexa com animações ou alternâncias de CSS.
         */
        if (!jQuery.isFunction(fn) || !jQuery.isFunction(fn2))
        {
            return oldToggle.apply(this, arguments);
        }

        /**
         *
         */
        migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");

        /**
         * Salve a referência aos argumentos para acesso
         * no encerramento.
         */
        var args = arguments,
            guid = fn.guid || jQuery.guid++,
            i = 0,
            toggler = function(event)
            {
                /**
                 * Descubra qual função executar.
                 */
                var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;

                /**
                 *
                 */
                jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);

                /**
                 * Certifique-se de que os cliques parem.
                 */
                event.preventDefault();

                /**
                 * E execute a função.
                 */
                return args[lastToggle].apply(this, arguments) || false;
            };

        /**
         * Vincule todas as funções, para que qualquer uma
         * delas possa desvincular esse manipulador de cliques.
         */
        toggler.guid = guid;

        while (i < args.length)
        {
            args[ i++ ].guid = guid;
        }

        return this.click(toggler);
    };

    /**
     *
     */
    jQuery.fn.live = function(types, data, fn)
    {
        migrateWarn("jQuery.fn.live() is deprecated");

        if (oldLive)
        {
            return oldLive.apply(this, arguments);
        }

        jQuery(this.context).on(types, this.selector, data, fn);

        return this;
    };

    /**
     *
     */
    jQuery.fn.die = function(types, fn)
    {
        migrateWarn("jQuery.fn.die() is deprecated");

        if (oldDie)
        {
            return oldDie.apply(this, arguments);
        }

        jQuery(this.context).off(types, this.selector || "**", fn);

        return this;
    };

    /**
     * Transforme eventos globais em eventos acionados
     * por documentos.
     */
    jQuery.event.trigger = function(event, data, elem, onlyHandlers)
    {
        if (!elem & !rajaxEvent.test(event))
        {
            migrateWarn("Global events are undocumented and deprecated");
        }

        return eventTrigger.call(this,  event, data, elem || document, onlyHandlers);
    };

    /**
     *
     */
    jQuery.each(ajaxEvents.split("|"), function(_, name)
    {
        jQuery.event.special[name] = {
            /**
             *
             */
            setup: function()
            {
                var elem = this;

                /**
                 * O documento não precisa de calços; deve ser !== para oldIE.
                 */
                if (elem !== document)
                {
                    jQuery.event.add(document, name + "." + jQuery.guid, function()
                    {
                        jQuery.event.trigger(name, null, elem, true);
                    });

                    jQuery._data(this, name, jQuery.guid++);
                }

                return false;
            },

            /**
             *
             */
            teardown: function()
            {
                if (this !== document)
                {
                    jQuery.event.remove(document, name + "." + jQuery._data(this, name));
                }

                return false;
            }
        };
    });
})(jQuery, window);
