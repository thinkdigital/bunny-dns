const BUNNY_API_URL = "https://api.bunny.net";

import got from "got";

class Bunny {
	#key = "";

	constructor(options = {}) {
		this.#key = options.key;
	}

	async domains() {
		let result = await this.#fetch("/dnszone");

		return result.Items;
	}

	async #fetch(url, data) {
		let options = {
			headers : {
				AccessKey : this.#key,
			}
		};

		if (data) {
			options.json = data;
		}

		return await got(`${BUNNY_API_URL}${url}`, options).json();
	}
}

export default Bunny;
