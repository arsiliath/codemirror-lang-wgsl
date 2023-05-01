import { parser } from "./syntax.grammar"
// import {parser} from "@lezer/javascript"

import {LRLanguage, LanguageSupport, 
        delimitedIndent, flatIndent, continuedIndent, indentNodeProp,
        foldNodeProp, foldInside} from "@codemirror/language"
import {completeFromList, ifNotIn} from "@codemirror/autocomplete"


/// A language provider based on the [Lezer JavaScript
/// parser](https://github.com/lezer-parser/javascript), extended with
/// highlighting and indentation information.
export const WGSLLanguage = LRLanguage.define({
  name: "wgsl",
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        // ifStatement: continuedIndent({except: /^\s*({|else\b)/}),
        // TryStatement: continuedIndent({except: /^\s*({|catch\b|finally\b)/}),
        // LabeledStatement: flatIndent,
        // switchBody: context => {
        //   let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after)
        //   return context.baseIndent + (closed ? 0 : isCase ? 1 : 2) * context.unit
        // },
        // // Block: delimitedIndent({closing: "}"}),
        // ArrowFunction: cx => cx.baseIndent + cx.unit,
        // "TemplateString BlockComment": () => null,
        // "Statement Property": continuedIndent({except: /^{/}),
      }),
      foldNodeProp.add({
        // "Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType": foldInside,
        // BlockComment(tree) { return {from: tree.from + 2, to: tree.to - 2} }
      })
    ]
  }),
  languageData: {
    closeBrackets: {brackets: ["(", "[", "{", "'", '"', "`"]},
    commentTokens: {line: "//", block: {open: "/*", close: "*/"}},
    indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
    wordChars: "$"
  }
})

const keywords = "break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield".split(" ").map(kw => ({label: kw, type: "keyword"}))
export const dontComplete = [
  "TemplateString", "String", "RegExp",
  "LineComment", "BlockComment",
  "VariableDefinition", "TypeDefinition", "Label",
  "PropertyDefinition", "PropertyName",
  "PrivatePropertyDefinition", "PrivatePropertyName"
]

export function WGSL() {
  return new LanguageSupport(WGSLLanguage, [WGSLLanguage.data.of({
    autocomplete: ifNotIn(dontComplete, completeFromList(keywords))
  })]);
}
