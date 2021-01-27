const parse = require('./json_parser')

describe('.parse', () => {
  test('empty json', () => {
    expect(parse('{}')).toEqual({})
  })

  test('throw error when quotes are missing', () => {
    expect(() => parse('{foo: 1}')).toThrow(/missing quotes near key/)
  })

  test('throw error when value is missing', () => {
    expect(() => parse('{"foo": }')).toThrow(/missing value/)
  })

  test('throw error when object closing is missing', () => {
    expect(() => parse('{"foo": 1')).toThrow(/syntax error/)
  })

  test('throw error when array closing is missing', () => {
    expect(() => parse('{"foo": [}')).toThrow(/syntax error/)
  })

  describe('one letter key', () => {
    test('with digit value', () => {
      expect(parse('{"a": 1}')).toEqual({ a: 1 })
    })

    test('with string value', () => {
      expect(parse('{"a": "a"}')).toEqual({ a: 'a' })
    })
  })

  describe('number values', () => {
    test('positive', () => {
      expect(parse('{"positive": 100}')).toEqual({ positive: 100 })
    })

    test('zero', () => {
      expect(parse('{"zero": 0}')).toEqual({ zero: 0 })
    })

    test('zeros', () => {
      expect(parse('{"zero": 0000}')).toEqual({ zero: 0 })
    })

    test('negative', () => {
      expect(parse('{"negative": -100}')).toEqual({ negative: -100 })
    })

    test('float', () => {
      expect(parse('{"float": 10.01}')).toEqual({ float: 10.01 })
    })

    test('negative float', () => {
      expect(parse('{"float": -10.01}')).toEqual({ float: -10.01 })
    })

    test('zero float', () => {
      expect(parse('{"float": 0.0}')).toEqual({ float: 0 })
    })

    test('arround 0', () => {
      expect(parse('{"float": 0.01}')).toEqual({ float: 0.01 })
    })

    test('exponent', () => {
      expect(parse('{"exponent": 1e2}')).toEqual({ exponent: 100 })
    })

    test('exponent to 0', () => {
      expect(parse('{"exponent": 1e0}')).toEqual({ exponent: 1 })
    })

    test('negative exponent', () => {
      expect(parse('{"exponent": 1e-1}')).toEqual({ exponent: 0.1 })
    })
  })

  describe('string values', () => {
    test('foo bar', () => {
      expect(parse('{"foo": "bar"}')).toEqual({ foo: 'bar' })
    })

    test('long strings', () => {
      expect(
        parse('{"foo": "barbarbarbarbarbarbarbarbarbarbarbarbarbarbarbar"}')
      ).toEqual({ foo: 'barbarbarbarbarbarbarbarbarbarbarbarbarbarbarbar' })
    })

    test('strings with spaces', () => {
      expect(parse('{"foo": "bar bar"}')).toEqual({ foo: 'bar bar' })
    })

    test('strings starting with digits', () => {
      expect(parse('{"foo": "1 bar"}')).toEqual({ foo: '1 bar' })
    })

    test('strings starting with single quotes', () => {
      expect(parse('{"foo": "bar \'bar\' bar"}')).toEqual({
        foo: 'bar \'bar\' bar',
      })
    })

    test('strings starting with double quotes', () => {
      expect(parse('{"foo": "bar \\"bar\\" bar"}')).toEqual({
        foo: 'bar "bar" bar',
      })
    })
  })

  describe('object value', () => {
    test('empty object', () => {
      expect(parse('{"foo": {}}')).toEqual({ foo: {} })
    })

    test('simple object', () => {
      expect(parse('{"foo": {"bar": 1}}')).toEqual({ foo: { bar: 1 } })
    })
  })

  describe('array value', () => {
    test('empty array', () => {
      expect(parse('{"foo": []}')).toEqual({ foo: [] })
    })

    test('single int array', () => {
      expect(parse('{"foo": [1]}')).toEqual({ foo: [1] })
    })

    test('multiple int array', () => {
      expect(parse('{"foo": [1, 2, 3]}')).toEqual({ foo: [1, 2, 3] })
    })

    test('single string array', () => {
      expect(parse('{"foo": ["bar"]}')).toEqual({ foo: ['bar'] })
    })

    test('multiple string array', () => {
      expect(parse('{"foo": ["bar 1", "bar 2"]}')).toEqual({
        foo: ['bar 1', 'bar 2'],
      })
    })

    test('only arrray', () => {
      expect(parse('["bar 1", "bar 2"]')).toEqual(['bar 1', 'bar 2'])
    })

    test('arrray of objects', () => {
      expect(parse('[{"bar": 1}, {"bar": 2}]')).toEqual([
        { bar: 1 },
        { bar: 2 },
      ])
    })
  })

  describe('special values', () => {
    test('true value', () => {
      expect(parse('{"foo": true}')).toEqual({ foo: true })
    })

    test('false value', () => {
      expect(parse('{"foo": false}')).toEqual({ foo: false })
    })

    test('null value', () => {
      expect(parse('{"foo": null}')).toEqual({ foo: null })
    })
  })

  describe('multiline json', () => {
    test('simple json', () => {
      expect(
        parse(`{
        "foo": 1
      }`)
      ).toEqual({ foo: 1 })
    })

    test('multiline object', () => {
      expect(
        parse(`{
        "foo": {
          "bar1": 1, 
          "bar2": 2
        }
      }`)
      ).toEqual({ foo: { bar1: 1, bar2: 2 } })
    })

    test('multiline array', () => {
      expect(
        parse(`{
        "foo": [
          1, 
          2,
          3
        ]
      }`)
      ).toEqual({ foo: [1, 2, 3] })
    })
  })

  test('big JSON', () => {
    const json = bigJsonPayload()
    const expectedObject = JSON.parse(json)
    expect(parse(json)).toEqual(expectedObject)
  })
})

const bigJsonPayload = () => `[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  },
  {
    "id": 2,
    "name": "Ervin Howell",
    "username": "Antonette",
    "email": "Shanna@melissa.tv",
    "address": {
      "street": "Victor Plains",
      "suite": "Suite 879",
      "city": "Wisokyburgh",
      "zipcode": "90566-7771",
      "geo": {
        "lat": "-43.9509",
        "lng": "-34.4618"
      }
    },
    "phone": "010-692-6593 x09125",
    "website": "anastasia.net",
    "company": {
      "name": "Deckow-Crist",
      "catchPhrase": "Proactive didactic contingency",
      "bs": "synergize scalable supply-chains"
    }
  },
  {
    "id": 3,
    "name": "Clementine Bauch",
    "username": "Samantha",
    "email": "Nathan@yesenia.net",
    "address": {
      "street": "Douglas Extension",
      "suite": "Suite 847",
      "city": "McKenziehaven",
      "zipcode": "59590-4157",
      "geo": {
        "lat": "-68.6102",
        "lng": "-47.0653"
      }
    },
    "phone": "1-463-123-4447",
    "website": "ramiro.info",
    "company": {
      "name": "Romaguera-Jacobson",
      "catchPhrase": "Face to face bifurcated interface",
      "bs": "e-enable strategic applications"
    }
  },
  {
    "id": 4,
    "name": "Patricia Lebsack",
    "username": "Karianne",
    "email": "Julianne.OConner@kory.org",
    "address": {
      "street": "Hoeger Mall",
      "suite": "Apt. 692",
      "city": "South Elvis",
      "zipcode": "53919-4257",
      "geo": {
        "lat": "29.4572",
        "lng": "-164.2990"
      }
    },
    "phone": "493-170-9623 x156",
    "website": "kale.biz",
    "company": {
      "name": "Robel-Corkery",
      "catchPhrase": "Multi-tiered zero tolerance productivity",
      "bs": "transition cutting-edge web services"
    }
  },
  {
    "id": 5,
    "name": "Chelsey Dietrich",
    "username": "Kamren",
    "email": "Lucio_Hettinger@annie.ca",
    "address": {
      "street": "Skiles Walks",
      "suite": "Suite 351",
      "city": "Roscoeview",
      "zipcode": "33263",
      "geo": {
        "lat": "-31.8129",
        "lng": "62.5342"
      }
    },
    "phone": "(254)954-1289",
    "website": "demarco.info",
    "company": {
      "name": "Keebler LLC",
      "catchPhrase": "User-centric fault-tolerant solution",
      "bs": "revolutionize end-to-end systems"
    }
  },
  {
    "id": 6,
    "name": "Mrs. Dennis Schulist",
    "username": "Leopoldo_Corkery",
    "email": "Karley_Dach@jasper.info",
    "address": {
      "street": "Norberto Crossing",
      "suite": "Apt. 950",
      "city": "South Christy",
      "zipcode": "23505-1337",
      "geo": {
        "lat": "-71.4197",
        "lng": "71.7478"
      }
    },
    "phone": "1-477-935-8478 x6430",
    "website": "ola.org",
    "company": {
      "name": "Considine-Lockman",
      "catchPhrase": "Synchronised bottom-line interface",
      "bs": "e-enable innovative applications"
    }
  },
  {
    "id": 7,
    "name": "Kurtis Weissnat",
    "username": "Elwyn.Skiles",
    "email": "Telly.Hoeger@billy.biz",
    "address": {
      "street": "Rex Trail",
      "suite": "Suite 280",
      "city": "Howemouth",
      "zipcode": "58804-1099",
      "geo": {
        "lat": "24.8918",
        "lng": "21.8984"
      }
    },
    "phone": "210.067.6132",
    "website": "elvis.io",
    "company": {
      "name": "Johns Group",
      "catchPhrase": "Configurable multimedia task-force",
      "bs": "generate enterprise e-tailers"
    }
  },
  {
    "id": 8,
    "name": "Nicholas Runolfsdottir V",
    "username": "Maxime_Nienow",
    "email": "Sherwood@rosamond.me",
    "address": {
      "street": "Ellsworth Summit",
      "suite": "Suite 729",
      "city": "Aliyaview",
      "zipcode": "45169",
      "geo": {
        "lat": "-14.3990",
        "lng": "-120.7677"
      }
    },
    "phone": "586.493.6943 x140",
    "website": "jacynthe.com",
    "company": {
      "name": "Abernathy Group",
      "catchPhrase": "Implemented secondary concept",
      "bs": "e-enable extensible e-tailers"
    }
  },
  {
    "id": 9,
    "name": "Glenna Reichert",
    "username": "Delphine",
    "email": "Chaim_McDermott@dana.io",
    "address": {
      "street": "Dayna Park",
      "suite": "Suite 449",
      "city": "Bartholomebury",
      "zipcode": "76495-3109",
      "geo": {
        "lat": "24.6463",
        "lng": "-168.8889"
      }
    },
    "phone": "(775)976-6794 x41206",
    "website": "conrad.com",
    "company": {
      "name": "Yost and Sons",
      "catchPhrase": "Switchable contextually-based project",
      "bs": "aggregate real-time technologies"
    }
  },
  {
    "id": 10,
    "name": "Clementina DuBuque",
    "username": "Moriah.Stanton",
    "email": "Rey.Padberg@karina.biz",
    "address": {
      "street": "Kattie Turnpike",
      "suite": "Suite 198",
      "city": "Lebsackbury",
      "zipcode": "31428-2261",
      "geo": {
        "lat": "-38.2386",
        "lng": "57.2232"
      }
    },
    "phone": "024-648-3804",
    "website": "ambrose.net",
    "company": {
      "name": "Hoeger LLC",
      "catchPhrase": "Centralized empowering task-force",
      "bs": "target end-to-end models"
    }
  }
]
`
