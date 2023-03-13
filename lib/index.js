const BUNNY_API_URL = "https://api.bunny.net";

import got from "got";

class Bunny {
	#key = "";

	constructor(options = {}) {
		this.#key = options.key;
	}

	async zones() {
		let result = await this.#get("/dnszone");

		result.Items.map((zone) => {
			zone.Records.map((record) => {
				record.Type = this.type2string(record.Type);
			});
		});

		return result.Items;
	}

	async zone(zone_id) {
		let zone = await this.#get(`/dnszone/${await this.#zone_id(zone_id)}`);

		zone.Records.map((record) => {
			record.Type = this.type2string(record.Type);
		});

		return zone;
	}

	async zone_statistics(zone_id) {
		return await this.#get(`/dnszone/${await this.#zone_id(zone_id)}/statistics`);
	}

	async add_zone(name) {
		return await this.#post("/dnszone", { Domain: name });
	}

	async remove_zone(zone_id) {
		return await this.#delete(`/dnszone/${await this.#zone_id(zone_id)}`);
	}

	async add_zone_record(zone_id, { type = "A", name, value, ttl = 3600, weight = 0, disabled = false }) {
		return await this.#put(`/dnszone/${await this.#zone_id(zone_id)}/records`, {
			Id       : 1,
			Type     : this.type2number(type),
			Name     : name,
			Value    : value,
			Ttl      : ttl,
			Weight   : weight,
			Disabled : disabled,
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

		if ("disabled" in options) {
			updates.Disabled = !!options.disabled;
		}

		if (!Object.keys(updates).length) {
			throw new Error("No valid updates defined");
		}

		updates.Id = record_id;

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

	type2number(type) {
		if (typeof type == "number") {
			return type;
		}

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
			default: return type;
		}
	}

	type2string(type) {
		if (typeof type == "string") {
			return type;
		}

		switch (type) {
			case  0: return "A";
			case  1: return "AAAA";
			case  2: return "CNAME";
			case  3: return "TXT";
			case  4: return "MX";
			case  5: return "RDR";
			case  7: return "PZ";
			case  8: return "SRV";
			case  9: return "CAA";
			case 10: return "PTR";
			case 12: return "NS";
			default: return type;
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
