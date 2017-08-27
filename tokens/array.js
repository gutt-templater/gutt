module.exports = class Arr {
	constructor(...values) {
		this.type = 'array'

		if (values.length === 1) {
			this.values = values[0]
		} else if (values.length === 3) {
			this.range = {
				type: values[0],
				value: [values[1], values[2]]
			}
		}
	}
}
