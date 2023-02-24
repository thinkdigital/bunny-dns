## Bunny DNS

### Install

```sh
npm i bunny-dns
```

### Usage

```js
import Bunny from "bunny-dns";

const connection = new Bunny({
	key : "your-api-key",
});

let zones = await connection.zones();

zones.map((zone) => {
	console.log(zone);
});
```
