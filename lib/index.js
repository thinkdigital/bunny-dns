const BUNNY_API_URL = "https://api.bunny.net";

import got from "got";

class Bunny {
	#key = "";

	constructor(options = {}) {
		this.#key = options.key;
	}

	async zones() {
		let result = await this.#get("/dnszone");

		return result.Items;
	}

	async zone(zone_id) {
		return await this.#get(`/dnszone/${await this.#zone_id(zone_id)}`);
	}

	async add_zone(name) {
		return await this.#post("/dnszone", { Domain: name });
	}

	async remove_zone(zone_id) {
		return await this.#delete(`/dnszone/${await this.#zone_id(zone_id)}`);
	}

	async add_zone_record(zone_id, { type = "A", name, value, ttl = 3600, weight = 0 }) {
		if (typeof type == "string") {
			type = this.#type2number(type);
		}

		return await this.#put(`/dnszone/${await this.#zone_id(zone_id)}/records`, {
			Id     : 1,
			Type   : type,
			Name   : name,
			Value  : value,
			Ttl    : ttl,
			Weight : weight,
		});
	}

	async update_zone_record(zone_id, record_id, options) {
		let updates = {};

		if ("value" in options) {
			updates.Value = options.value;
		}

		if ("ttl" in options) {
			updates.Ttl = options.ttl;
		}

		if ("weight" in options) {
			updates.Weight = options.weight;
		}

		if (!Object.keys(updates).length) {
			throw new Error("No valid updates defined");
		}

		return await this.#post(`/dnszone/${await this.#zone_id(zone_id)}/records/${record_id}`, updates);
	}

	async remove_zone_record(zone_id, record_id) {
		return await this.#delete(`/dnszone/${await this.#zone_id(zone_id)}/records/${record_id}`);
	}

	async #zone_id(id) {
		if (typeof id == "number") {
			return id;
		}

		let zones = await this.zones();
		let zone  = zones.filter((zone) => (zone.Domain == id))[0];

		return zone?.Id ?? null;
	}

	#type2number(type) {
		switch (type) {
			case "A":     return 0;
			case "AAAA":  return 1;
			case "CNAME": return 2;
			case "TXT":   return 3;
			case "MX":    return 4;
			case "RDR":   return 5;
			case "PZ":    return 7;
			case "SRV":   return 8;
			case "CAA":   return 9;
			case "PTR":   return 10;
			case "NS":    return 12;
		}
	}

	async #get(url) {
		return await got(`${BUNNY_API_URL}${url}`, {
			headers : {
				AccessKey : this.#key,
			}
		}).json();
	}

	async #delete(url) {
		return await got.delete(`${BUNNY_API_URL}${url}`, {
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
