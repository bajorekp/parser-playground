# Parser playground

The repository contains JSON parser playground to learn how parser works.

# Play

Install node, yarn and packages.

```
brew install n        # install node manager
n 12.16               # install node
npm install -g npm    # upgrade npm
npm install -g yarn   # upgrade yarn
yarn install          # install packages
```

To run all check

```bash
yarn all
```

To tests in watch mode and play around:

```
yarn test:watch
```


# JSON parser

Great reading how parser works: https://lihautan.com/json-parser-with-javascript/

;TLDR

* Go from start to end
* Run jsonValue on top and return value
* value can be: false, true, null, string, nuber, object or array
* its array, if starts with '['
  * return array if ']' is next 
  * run jsonValue and add result to array
  * eat comma
  * repeat
* its object, if starts with '{'
  * return object if '}' is next 
  * fetch key
  * run jsonValue and add it under the key into the object 
  * eat comma
  * repeat
