import DiscordRPC from 'discord-rpc';
import {promises as fs} from 'fs';
import {validateConfig} from './validateConfig.js';
import chalk from "chalk";
import {createPresence} from "./createPresence.js";

const data = await fs.readFile('config.json', 'utf8');
const config = JSON.parse(data);
validateConfig(config);

const clientId = config.clientId;

const rpc = new DiscordRPC.Client({transport: 'ipc'});
DiscordRPC.register(clientId);

console.log(chalk.yellow("RPC Client is connecting..."));
rpc.login({clientId});

rpc.on('ready', async () => {
	console.log(chalk.greenBright.bold("RPC Client is ready!"));
	console.log(chalk.blueBright("Set Activity..."));
	await setActivity();
	console.log(chalk.blueBright.bold("Activity set!"));
});

rpc.on("connected", () => {
	console.log(chalk.green.bold("RPC Client is connected!"));
});

const setActivity = async () => {
	if (!rpc) {
		console.error(chalk.red.bold("RPC Client is not connected!"));
		process.exit(1);
	}

	await rpc.setActivity(createPresence(config));
}
