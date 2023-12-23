import chalk from "chalk";

// Validate config schema
const validateObject = (obj, schema, path = []) => {
	for (const key in schema) {
		if (schema.hasOwnProperty(key)) {
			const fieldType = schema[key];
			const fieldValue = obj[key];
			const fieldPath = [...path, key];

			if (typeof fieldType === 'string') {
				if (typeof fieldValue !== fieldType) {
					return `Field ${chalk.italic(fieldPath.join(' > '))} should be of type ${fieldType}.`;
				}
			} else if (typeof fieldType === 'object' && fieldType !== null) {
				if (typeof fieldValue !== 'object') {
					return `Field ${chalk.italic(fieldPath.join(' > '))} should be an object.`;
				}
				const nestedError = validateObject(fieldValue, fieldType, fieldPath);
				if (nestedError) {
					return nestedError;
				}
			}
		}
	}
	return null;
}
const validateConfigSchema = (config) => {
	const schema = {
		clientId: 'string',
		rich_presence: {
			details: {
				text: 'string',
				show: 'boolean'
			},
			state: {
				text: 'string',
				show: 'boolean'
			},
			assets: {
				largeImage: {
					text: 'string',
					key: 'string',
					show: 'boolean'
				},
				smallImage: {
					text: 'string',
					key: 'string',
					show: 'boolean'
				}
			},
			buttons: {
				primary: {
					labelText: 'string',
					redirectUrl: 'string',
					show: 'boolean'
				},
				secondary: {
					labelText: 'string',
					redirectUrl: 'string',
					show: 'boolean'
				}
			},
			timestamps: {
				mode: 'string',
				autoStart: 'boolean',
				startTimestamp: 'number',
				endTimestamp: 'number',
				show: 'boolean'
			},
			party: {
				id: 'string',
				size: {
					currentSize: 'number',
					maxSize: 'number'
				},
				show: 'boolean'
			}
		}
	};

	return validateObject(config, schema);
}

// Validate config values
const validateValues = (config) => {
	validateDetails(config.rich_presence.details);
	validateState(config.rich_presence.state);
	validateImage(config.rich_presence.assets.largeImage, "LargeImage");
	validateImage(config.rich_presence.assets.smallImage, "SmallImage");
	validateButton(config.rich_presence.buttons.primary, "Primary");
	validateButton(config.rich_presence.buttons.secondary, "Secondary");
	validateTimestamps(config.rich_presence.timestamps);
	validateParty(config.rich_presence.party);
}

const validateDetails = (details) => {
	if (details.show) {
		if (details && details.text) {
			if (details.text.length > 128) {
				logError("Details provided exceeds the maximum character length of 128.");
			} else if (details.text.length < 2) {
				logError("Details provided does not meet the minimum character length of 2.");
			}
		}
	}
};

const validateState = (state) => {
	if (state.show) {
		if (state && state.text) {
			if (state.text.length > 128) {
				logError("State provided exceeds the maximum character length of 128.");
			} else if (state.text.length < 2) {
				logError("State provided does not meet the minimum character length of 2.");
			}
		}
	}
};

const validateImage = (largeImage, imagetype) => {
	if (largeImage.show) {
		if (largeImage.text.length > 128) {
			logError(`${imagetype}Text provided exceeds the maximum character length of 128.`);
		} else if (largeImage.text.length < 2) {
			logError(`${imagetype}Text provided does not meet the minimum character length of 2.`);
		}

		if (largeImage.key.length > 256) {
			logError(`${imagetype}Key provided exceeds the maximum character length of 256.`);
		}
	}
};

const validateButton = (button, buttonType) => {
	if (button.show) {
		if (button.labelText.length > 32) {
			logError(`${buttonType} button label provided exceeds the maximum character length of 32.`);
		} else if (button.labelText.length < 1) {
			logError(`${buttonType} button label provided does not meet the minimum character length of 1.`);
		}
		if (button.redirectUrl.length > 512) {
			logError(`${buttonType} button URL provided exceeds the maximum character length of 512.`);
		} else if (button.redirectUrl.length < 1) {
			logError(`${buttonType} button URL provided does not meet the minimum character length of 1.`);
		}

		if (!/^https?:\/\//.test(button.redirectUrl)) {
			logError(`${buttonType} button URL provided does not contain either 'http://' OR 'https://'.`);
		}
	}
}

const validateTimestamps = (timestamps) => {
	if (timestamps.show) {
		if (timestamps) {
			const validModes = ["remaining", "elapsed"];
			if (timestamps.mode && !validModes.includes(timestamps.mode)) {
				logError("Invalid mode provided for timestamps.");
			}

			if (timestamps.startTimestamp !== undefined) {
				if (typeof timestamps.startTimestamp !== 'number') {
					logError("startTimestamp should be a number.");
				}
			}

			if (timestamps.endTimestamp !== undefined) {
				if (typeof timestamps.endTimestamp !== 'number') {
					logError("endTimestamp should be a number.");
				}
			}
		}
	}
};

const validateParty = (party) => {
	if (party.show) {
		if (party) {
			if (!party.id) {
				logError("Party id is required.");
			}

			if (party.size) {
				if (typeof party.size.currentSize !== 'number' || typeof party.size.maxSize !== 'number') {
					logError("Party size should be numbers.");
				}
			}
		}
	}
};

export const validateConfig = (config) => {
	console.log(chalk.blue("Validating configuration..."));

	const schemaValidResult = validateConfigSchema(config);
	if (schemaValidResult) {
		logError(schemaValidResult);
	} else {
		console.log(chalk.green("Configuration Schema is valid!"));
	}

	const configValidResult = validateValues(config);
	if (configValidResult) {
		logError(configValidResult);
	} else {
		console.log(chalk.green("Configuration values are valid!"));
	}

}

const logError = (message) => {
	console.error(chalk.red.bold(message));
	process.exit(1);
};