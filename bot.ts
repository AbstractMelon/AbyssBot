import { Client, GatewayIntentBits, VoiceState, ChannelType } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const TOKEN = "token";
const GUILD_ID = "1210949353087434822";
const VC_ID = "1249917690626310264";
const ROLE_ID = "1249921454850707507";

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.once("ready", () => {
  console.log(`Bot is ready!`);
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error(`Guild with ID ${GUILD_ID} not found.`);
  } else {
    console.log(`Connected to guild: ${guild.name}`);
  }
});

client.on(
  "voiceStateUpdate",
  async (oldState: VoiceState, newState: VoiceState) => {
    console.log("User vc status updated!");
    try {
      const member = newState.member;
      if (!member || member.user.bot) {
        console.log("Member not found or is a bot.");
        return;
      }

      const guild = member.guild;
      if (!guild || guild.id !== GUILD_ID) {
        console.log("Guild not found or does not match.");
        return;
      }

      const voiceChannel = guild.channels.cache.get(VC_ID);
      if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
        console.log("Voice channel not found or is not a guild voice channel.");
        return;
      }

      const role = guild.roles.cache.get(ROLE_ID);
      if (!role) {
        console.error("Role not found!");
        return;
      }

      if (newState.channelId === voiceChannel.id) {
        await member.roles.add(role);
        console.log(`Added role ${role.name} to ${member.user.tag}`);
      } else if (
        oldState.channelId === voiceChannel.id &&
        newState.channelId !== voiceChannel.id
      ) {
        await member.roles.remove(role);
        console.log(`Removed role ${role.name} from ${member.user.tag}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
);

client.on("error", (error) => {
  console.error("Client error:", error);
});

client
  .login(TOKEN)
  .then(() => console.log("Logging in..."))
  .catch((error) => console.error("Login error:", error));
