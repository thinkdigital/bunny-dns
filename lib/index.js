const BUNNY_API_URL = "https://api.bunny.net";

import got from "got";

class Bunny {
	#key = "";

	constructor(options = {}) {
		this.#key = options.key;
	}

	async domains() {
		let result = await this.#get("/dnszone");

		return result.Items;
	}

	async #get(url) {
		return await got(`${BUNNY_API_URL}${url}`, {
			headers : {
				AccessKey : this.#key,
			}
		}).json();
	}

	async #post(url, json) {
		return await got.post(`${BUNNY_API_URL}${url}`, {
			headers : {
				AccessKey : this.#key,
			},
			json
		}).json();
	}

	async #put(url, json) {
		return await got.put(`${BUNNY_API_URL}${url}`, {
			headers : {
				AccessKey : this.#key,
			},
			json
		}).json();
	}
}

export default Bunny;
