import Bunny from "./lib/index.js";

const connection = new Bunny({
	key : "...",
});

synchronize([{
	domain  : "sdrthealth.eu",
	records : [{
		type  : 0,
		name  : "www",
		value : "88.157.139.110",
		ttl   : 3600,
	}]
}]).then(() => {
	console.log("sync done");
});

async function synchronize(domains) {
	let remote_domains = await connection.domains();

	console.log(remote_domains);
}
