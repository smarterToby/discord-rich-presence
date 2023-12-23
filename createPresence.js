export const createPresence = (config) => {
	let presence = {};

	if (config.rich_presence.details && config.rich_presence.details.show) {
		presence.details = config.rich_presence.details.text;
	}
	if (config.rich_presence.state && config.rich_presence.state.show) {
		presence.state = config.rich_presence.state.text;
	}
	if (config.rich_presence.assets.largeImage && config.rich_presence.assets.largeImage.show) {
		presence.largeImageKey = config.rich_presence.assets.largeImage.key;
		presence.largeImageText = config.rich_presence.assets.largeImage.text;
	}
	if (config.rich_presence.assets.smallImage && config.rich_presence.assets.smallImage.show) {
		presence.smallImageKey = config.rich_presence.assets.smallImage.key;
		presence.smallImageText = config.rich_presence.assets.smallImage.text;
	}
	if (config.rich_presence.timestamps && config.rich_presence.timestamps.show) {
		if (config.rich_presence.timestamps.autoStart) {
			presence.startTimestamp = Math.floor(Date.now() / 1000);
		} else {
			presence.startTimestamp = config.rich_presence.timestamps.startTimestamp;
		}
		if (config.rich_presence.timestamps.mode !== 'elapsed') {
			presence.endTimestamp = config.rich_presence.timestamps.endTimestamp;
		}
	}
	if (config.rich_presence.party && config.rich_presence.party.show) {
		presence.partyId = config.rich_presence.party.id;
		presence.partySize = config.rich_presence.party.size.currentSize;
		presence.partyMax = config.rich_presence.party.size.maxSize;
	}

	const primaryButton = config.rich_presence.buttons.primary;
	const secondaryButton = config.rich_presence.buttons.secondary;

	if ((primaryButton && primaryButton.show) || (secondaryButton && secondaryButton.show)) {
		presence.buttons = [];

		if (primaryButton && primaryButton.show) {
			presence.buttons.push({
				label: primaryButton.labelText,
				url: primaryButton.redirectUrl
			});
		}
		if (secondaryButton && secondaryButton.show) {
			presence.buttons.push({
				label: secondaryButton.labelText,
				url: secondaryButton.redirectUrl
			});
		}
	}

	return presence;
}