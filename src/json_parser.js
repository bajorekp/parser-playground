function parse(inputJsonString) {
  let json = inputJsonString
  let index = 0

  function SyntaxError(code, message) {
    this.message = message
    this.code = code
    this.currentJsonState =
      inputJsonString.slice(index - 100, index) +
      '💩' +
      inputJsonString.slice(index, index + 100)
  }

  const match = (pattern) => {
    const result = json.match(pattern)
    if (result) {
      // console.log(`Match ${pattern} - (${json})`)
    }
    return result
  }

  const is = (str) => {
    const isIt = json.match('^' + str)
    if (isIt) {
      move(isIt[0].length)
      return isIt[0]
    }
  }

  const move = (count) => {
    json = json.slice(count)
    index += count
  }

  const skipWhitespace = () => is('\\s*')
  const skipComas = () => is('\\s*,?\\s*')

  const isString = () => {
    const stringMatch = is('(".*?(?<!\\\\)")')
    return (
      stringMatch &&
      stringMatch.slice(1, stringMatch.length - 1).replace(/\\/g, '')
    )
  }

  const isNumber = () => {
    const numberMatch = is('\\-?\\d+(?:\\.\\d+)?(?:[eE][\\-+]?\\d+)?')
    if (numberMatch) {
      return Number(numberMatch)
    }
  }

  // nulish operator is aviable since Node v14
  const jsonValue = () => {
    skipWhitespace()
    if (is('false')) {
      return false
    }
    if (is('true')) {
      return true
    }
    if (is('null')) {
      return null
    }
    let result = isString()
    if (result !== undefined) {
      return result
    }
    result = isNumber()
    if (result !== undefined) {
      return result
    }
    result = jsonArray()
    if (result !== undefined) {
      return result
    }
    result = jsonObject()
    if (result !== undefined) {
      return result
    }
  }

  const jsonObject = () => {
    const isObject = is('{')
    if (isObject) {
      const object = {}
      const endOfObject = '\\s*}\\s*'
      while (!is(endOfObject)) {
        const keyMatch = match(/^\s*"(?<key>\w+)"\s*:\s*/)
        if (keyMatch) {
          move(keyMatch[0].length)
          const key = keyMatch['groups']['key']

          const value = jsonValue()
          if (value === undefined) {
            throw new SyntaxError('ERROR_OBJ_4', 'missing value for key')
          }
          object[key] = value
          skipComas()
        } else if (match(/^\s*"?(?<key>\w+)"?\s*:\s*/)) {
          throw new SyntaxError('ERROR_OBJ_2', 'missing quotes near key')
        } else {
          throw new SyntaxError('ERROR_OBJ_1', 'syntax error')
        }
      }
      return object
    }
  }

  const jsonArray = () => {
    const isArray = is('\\[')
    if (isArray) {
      const arr = []
      const endOfArray = '\\s*]\\s*'
      while (!is(endOfArray)) {
        const nextValue = jsonValue()
        if (nextValue === undefined) {
          throw new SyntaxError('ERROR_ARRAY_1', 'syntax error')
        }

        arr.push(nextValue)
        skipComas()
      }
      return arr
    }
  }

  return jsonValue(inputJsonString)
}

module.exports = parse
