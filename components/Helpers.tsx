import { parse } from 'node-html-parser'

function htmlDecode(input: string) {
  const parsed = parse(input || '')
  return { __html: parsed.toString() }
}

function pluralize(word: string, number: number, plural = null) {
  const pluralWord = plural || word + 's'
  if (number == 1) {
    return `${number} ${word}`
  } else {
    return `${number} ${pluralWord}`
  }
}

export { htmlDecode, pluralize }
