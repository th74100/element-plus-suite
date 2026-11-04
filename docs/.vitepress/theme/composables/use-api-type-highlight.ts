import type { HighlighterCore } from 'shiki'
import { createHighlighterCore, createJavaScriptRegexEngine } from 'shiki'
import typescript from 'shiki/langs/typescript.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'

const LIGHT_THEME = 'vitesse-light'
const DARK_THEME = 'vitesse-dark'

let highlighterPromise: Promise<HighlighterCore> | undefined

function getHighlighter() {
  highlighterPromise ??= createHighlighterCore({
    themes: [vitesseLight, vitesseDark],
    langs: [typescript],
    engine: createJavaScriptRegexEngine(),
  })

  return highlighterPromise
}

/** 把类型签名高亮成 HTML，并同时生成亮色、暗色主题需要的颜色变量。 */
export async function highlightApiType(signature: string) {
  const highlighter = await getHighlighter()

  return highlighter.codeToHtml(signature, {
    lang: 'typescript',
    themes: {
      light: LIGHT_THEME,
      dark: DARK_THEME,
    },
  })
}