const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionsBitField,
  AttachmentBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const axios = require("axios");
const { saveLog } = require("./saveLog");
const prisma = require("../config/prisma");

// ===== CONFIG =====
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const EXPRESS_API_BASE_URL =
  process.env.EXPRESS_API_BASE_URL || "http://localhost:3000/api";

// ===== THEMES =====
const lightTheme = {
  color: "#00C6FF",
  thumbnail:
    "https://images-ext-1.discordapp.net/external/MZKJugC-7p7uTOUlg41zHOh0_mViUL-uQkAQgcAni1w/https/cdn-icons-png.flaticon.com/512/3062/3062634.png?format=webp&quality=lossless",
  title: "🌞 Daytime Membership Registration!",
  description:
    "> Embrace the sunshine of success!\n\n✅ Exclusive benefits | 🎁 Rewards | 📈 Grow together",
};

const darkTheme = {
  color: "#3A0CA3",
  thumbnail:
    "https://images-ext-1.discordapp.net/external/MZKJugC-7p7uTOUlg41zHOh0_mViUL-uQkAQgcAni1w/https/cdn-icons-png.flaticon.com/512/3062/3062634.png?format=webp&quality=lossless",
  title: "🌙 Nighttime Membership Registration!",
  description:
    "> Immerse yourself in opportunities!\n\n✅ Exclusive benefits | 🎁 Rewards | 📈 Path to success",
};

// ===== EMBED TEMPLATES =====
const createErrorEmbed = (errorMessage) =>
  new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("❌ Error Occurred")
    .setDescription(errorMessage)
    .setThumbnail("https://cdn-icons-png.flaticon.com/512/753/753345.png")
    .setTimestamp();

const createSuccessEmbed = (successMessage) =>
  new EmbedBuilder()
    .setColor("#00FF00")
    .setTitle("✅ Operation Successful")
    .setDescription(successMessage)
    .setThumbnail("https://cdn-icons-png.flaticon.com/512/190/190411.png")
    .setTimestamp();

const createWarningEmbed = (warningMessage) =>
  new EmbedBuilder()
    .setColor("#FFFF00")
    .setTitle("⚠️ Warning")
    .setDescription(warningMessage)
    .setThumbnail("https://cdn-icons-png.flaticon.com/512/4219/4219517.png")
    .setTimestamp();

const createInfoEmbed = (infoMessage) =>
  new EmbedBuilder()
    .setColor("#0099FF")
    .setTitle("ℹ️ Information")
    .setDescription(infoMessage)
    .setThumbnail("https://cdn-icons-png.flaticon.com/512/157/157933.png")
    .setTimestamp();

// ===== Discord Client =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ===== Function to create beautiful table =====
function createBeautifulTable(users) {
  const maxIdLength = Math.max(...users.map((u) => u.id.toString().length), 4);
  const maxEmailLength = Math.max(...users.map((u) => u.email.length), 5);
  const maxDateLength = 10;

  const horizontalLine =
    "┣" +
    "━".repeat(maxIdLength + 2) +
    "╋" +
    "━".repeat(maxEmailLength + 2) +
    "╋" +
    "━".repeat(maxDateLength + 2) +
    "┫";

  let table =
    "```diff\n" +
    "┏" +
    "━".repeat(maxIdLength + 2) +
    "┳" +
    "━".repeat(maxEmailLength + 2) +
    "┳" +
    "━".repeat(maxDateLength + 2) +
    "┓\n" +
    `┃ ${"ID".padEnd(maxIdLength)} ┃ ${"Email".padEnd(
      maxEmailLength
    )} ┃ ${"Registration Date".padEnd(maxDateLength)} ┃\n` +
    horizontalLine +
    "\n";

  users.forEach((user) => {
    const date = new Date(user.createdAt).toLocaleDateString("en-US");
    table +=
      `┃ ${user.id.toString().padEnd(maxIdLength)} ┃ ` +
      `${user.email.padEnd(maxEmailLength)} ┃ ` +
      `${date.padEnd(maxDateLength)}  ┃\n`;
  });

  table +=
    "┗" +
    "━".repeat(maxIdLength + 2) +
    "┻" +
    "━".repeat(maxEmailLength + 2) +
    "┻" +
    "━".repeat(maxDateLength + 2) +
    "┛\n" +
    "```";

  return table;
}

// ===== Function to fetch member statistics =====
async function getMemberStats() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const totalUsers = await prisma.user.count();
  const todayCount = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  return { users, totalUsers, todayCount };
}

// ===== Function to create user selection menu =====
function createUserSelectMenu(users, customId) {
  const options = users.map((user) => ({
    label: `${user.email} (ID: ${user.id})`.slice(0, 100),
    value: user.id.toString(),
    description: `Registered: ${new Date(user.createdAt).toLocaleDateString(
      "en-US"
    )}`.slice(0, 100),
  }));

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder("Select user to delete")
      .addOptions(options)
  );
}

async function getDatabaseName() {
  try {
    // ใช้ Raw Query เพื่อขอชื่อฐานข้อมูลปัจจุบันจาก MySQL
    const result = await prisma.$queryRaw`SELECT DATABASE() as dbName`;
    return result[0].dbName || "Unknown database";
  } catch (error) {
    console.error("Error getting database name:", error);
    // ถ้าไม่สามารถใช้ Raw Query ได้ ให้ลองดึงจาก DATABASE_URL
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      try {
        const urlParts = dbUrl.split("/");
        return urlParts[urlParts.length - 1].split("?")[0];
      } catch (e) {
        return "Unknown database";
      }
    }
    return "Unknown database";
  }
}

client.once("ready", async () => {
  const botPresence = {
    activities: [
      {
        name: "New members registration",
        type: "WATCHING",
        url: "https://twitch.tv/your_channel",
      },
    ],
    status: "dnd",
  };

  client.user.setPresence(botPresence);

  // Fancy console output
  console.log(`\n\x1b[35m┌──────────────────────────────┐\x1b[0m`);
  console.log(`\x1b[35m│          BOT ONLINE         │\x1b[0m`);
  console.log(`\x1b[35m├──────────────────────────────┤\x1b[0m`);
  console.log(`\x1b[36m│ Name: \x1b[33m${client.user.username}\x1b[0m`);
  console.log(`\x1b[36m│ Tag:  \x1b[33m${client.user.tag}\x1b[0m`);
  console.log(`\x1b[36m│ ID:   \x1b[33m${client.user.id}\x1b[0m`);
  console.log(`\x1b[36m│ DB:   \x1b[33m${await getDatabaseName()}\x1b[0m`);
  console.log(`\x1b[36m│ Status: \x1b[33m${botPresence.status}\x1b[0m`);
  console.log(
    `\x1b[36m│ Activity: \x1b[33m${botPresence.activities[0].name}\x1b[0m`
  );
  console.log(
    `\x1b[36m│ Activity Type: \x1b[33m${botPresence.activities[0].type}\x1b[0m`
  );
  console.log(
    `\x1b[36m│ Activity: \x1b[33mWatching "New members registration"\x1b[0m`
  );
  console.log(
    `\x1b[36m│ Activity URL: \x1b[33m${botPresence.activities[0].url}\x1b[0m`
  );
  console.log(`\x1b[36m│ Prefix: \x1b[33m/\x1b[0m`);
  console.log(`\x1b[35m└──────────────────────────────┘\x1b[0m\n`);

  try {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
    if (channel) {
      const pinnedMessages = await channel.messages.fetchPinned();
      const existingPanel = pinnedMessages.find(
        (msg) => msg.author.id === client.user.id
      );

      if (!existingPanel) {
        const now = new Date();
        const hour = now.getHours();
        const theme = hour >= 6 && hour < 18 ? lightTheme : darkTheme;

        const embed = new EmbedBuilder()
          .setColor(theme.color)
          .setTitle(theme.title)
          .setDescription(theme.description)
          .setThumbnail(theme.thumbnail)
          .setImage(
            "https://user-images.githubusercontent.com/74038190/238355349-7d484dc9-68a9-4ee6-a767-aea59035c12d.gif"
          ) // Add your image URL here
          .setFooter({
            text: `${client.user.username} | ${now.toLocaleString("en-US")}`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Register")
            .setStyle(ButtonStyle.Success)
            .setEmoji("📝")
            .setCustomId("Register"),
          new ButtonBuilder()
            .setLabel("Info")
            .setStyle(ButtonStyle.Link)
            .setEmoji("ℹ️")
            .setURL("http://localhost:5173/"),
          new ButtonBuilder()
            .setLabel("View Members")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("📊")
            .setCustomId("show_database"),
          new ButtonBuilder()
            .setLabel("showtable")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("show_table")
            .setDisabled(false)
        );

        const sentMessage = await channel.send({
          embeds: [embed],
          components: [row],
        });
        await sentMessage.pin();

        console.log("✅ Panel sent and pinned with Dynamic Theme.");
      } else {
        console.log(
          "⚡️ A panel is already pinned. Skipping sending a new one."
        );
      }
    }
  } catch (err) {
    console.error("Error sending or pinning the Dynamic Theme Panel:", err);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "register") {
      const email = interaction.options.getString("email");
      const password = interaction.options.getString("password");

      try {
        await axios.post(`${EXPRESS_API_BASE_URL}/register`, {
          email,
          password,
        });
        await interaction.reply({
          embeds: [createSuccessEmbed("🎉 Registration successful! Welcome!")],
        });
        saveLog(`New registration via SlashCommand: ${email}`);
      } catch (err) {
        saveLog(`❌ Registration failed: ${err.message}`);
        console.error(err.response?.data || err.message);
        await interaction.reply({
          embeds: [createErrorEmbed("❌ An error occurred. Please try again.")],
          ephemeral: true,
        });
      }
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === "Register") {
      const modal = new ModalBuilder()
        .setCustomId("registerModal")
        .setTitle("🚀 Membership Registration Form");

      const emailInput = new TextInputBuilder()
        .setCustomId("email")
        .setLabel("📧 Your Email")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("you@example.com")
        .setRequired(true);

      const passwordInput = new TextInputBuilder()
        .setCustomId("password")
        .setLabel("🔒 Password")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("********")
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(emailInput),
        new ActionRowBuilder().addComponents(passwordInput)
      );

      await interaction.showModal(modal);
    }

    // Button to show database
    if (interaction.customId === "show_database") {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return await interaction.reply({
          embeds: [
            createWarningEmbed(
              "⛔ You don't have permission to use this feature"
            ),
          ],
          ephemeral: true,
        });
      }

      await interaction.deferReply({ ephemeral: true });

      try {
        const dbName = await getDatabaseName();
        const { users, totalUsers, todayCount } = await getMemberStats();

        const mainEmbed = new EmbedBuilder()
          .setTitle("📊 Member Statistics")
          .setColor("#5865F2")
          .setThumbnail(
            "https://cdn-icons-png.flaticon.com/512/1265/1265531.png"
          )
          .addFields(
            {
              name: "Database",
              value: `\`${dbName}\``,
              inline: true,
            },
            {
              name: "Total Members",
              value: `\`${totalUsers}\` people`,
              inline: true,
            },
            {
              name: "Today's Members",
              value: `\`${todayCount}\` people`,
              inline: true,
            },
            {
              name: "Last Updated",
              value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
              inline: true,
            },
            {
              name: "Date",
              value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
              inline: true,
            },
            {
              name: "Time",
              value: `<t:${Math.floor(Date.now() / 1000)}:T>`,
              inline: true,
            },
            {
              name: "Timezone",
              value: `\`${new Date().toString().match(/\(([^)]+)\)/)[1]}\``,
              inline: true,
            }
          )
          .setFooter({
            text: `Show last 10 items • Reference code: ${interaction.id.slice(
              -6
            )}`,
          });

        const tableContent =
          users.length > 0
            ? createBeautifulTable(users)
            : "```diff\n- No member data available\n```";

        const tableEmbed = new EmbedBuilder()
          .setColor("#2b2d31")
          .setDescription(tableContent);

        const controlButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Refresh")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("refresh_database"),
          new ButtonBuilder()
            .setLabel("📥 Export CSV")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("export_csv"),
          new ButtonBuilder()
            .setLabel("Delete")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("delete_user"),
          new ButtonBuilder()
            .setLabel("Close")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("close_table")
        );

        await interaction.editReply({
          embeds: [mainEmbed, tableEmbed],
          components: [controlButtons],
        });
      } catch (error) {
        console.error("Database Error:", error);
        await interaction.editReply({
          embeds: [
            createErrorEmbed("⚠️ Error fetching data. Please try again later"),
          ],
        });
      }
    }

    if (interaction.customId === "show_table") {
      // ใช้โค้ดเดียวกันกับส่วน "show_database"
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return await interaction.reply({
          embeds: [createWarningEmbed("⛔ คุณไม่มีสิทธิ์ใช้คำสั่งนี้")],
          ephemeral: true,
        });
      }

      await interaction.deferReply({ ephemeral: true });

      try {
        const { users, totalUsers, todayCount } = await getMemberStats();
        const dbName = await getDatabaseName();

        const mainEmbed = new EmbedBuilder()
          .setTitle("📊 สถิติสมาชิก")
          .setColor("#5865F2")
          .addFields(
            { name: "🗃️ ฐานข้อมูล", value: `\`${dbName}\``, inline: true },
            {
              name: "👥 สมาชิกทั้งหมด",
              value: `\`${totalUsers}\` คน`,
              inline: true,
            },
            {
              name: "🆕 สมาชิกวันนี้",
              value: `\`${todayCount}\` คน`,
              inline: true,
            }
          );

        const tableContent =
          users.length > 0
            ? createBeautifulTable(users)
            : "```diff\n- ไม่พบข้อมูลสมาชิก\n```";

        const tableEmbed = new EmbedBuilder()
          .setColor("#2b2d31")
          .setDescription(tableContent);

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("รีเฟรช")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("refresh_table")
            .setEmoji("🔄"),
          new ButtonBuilder()
            .setLabel("ปิด")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("close_table")
            .setEmoji("❌")
        );

        await interaction.editReply({
          embeds: [mainEmbed, tableEmbed],
          components: [buttons],
        });
      } catch (error) {
        console.error("แสดงตารางข้อผิดพลาด:", error);
        await interaction.editReply({
          embeds: [createErrorEmbed("⚠️ โหลดข้อมูลไม่สำเร็จ")],
        });
      }
    }
    // Refresh data button
    if (interaction.customId === "refresh_database") {
      await interaction.deferUpdate();

      try {
        const { users, totalUsers, todayCount } = await getMemberStats();

        const updatedMainEmbed = new EmbedBuilder()
          .setTitle("📊 Member Statistics (Updated)")
          .setColor("#5865F2")
          .setThumbnail(
            "https://cdn-icons-png.flaticon.com/512/1265/1265531.png"
          )
          .addFields(
            {
              name: "All Members",
              value: `\`${totalUsers}\` people`,
              inline: true,
            },
            {
              name: "Member Today",
              value: `\`${todayCount}\` people`,
              inline: true,
            },
            {
              name: "Latest Update",
              value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
              inline: true,
            }
          )
          .setFooter({
            text: `Show last 10 items • Reference code: ${interaction.id.slice(
              -6
            )}`,
          });

        const updatedTable =
          users.length > 0
            ? createBeautifulTable(users)
            : "```diff\n- No member data available\n```";

        const updatedTableEmbed = new EmbedBuilder()
          .setColor("#2b2d31")
          .setDescription(updatedTable);

        const controlButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Refresh")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("refresh_database"),
          new ButtonBuilder()
            .setLabel("📥 Export CSV")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("export_csv"),
          new ButtonBuilder()
            .setLabel("Delete")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("delete_user"),
          new ButtonBuilder()
            .setLabel("Close")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("close_table")
        );

        await interaction.editReply({
          embeds: [updatedMainEmbed, updatedTableEmbed],
          components: [controlButtons],
        });
      } catch (error) {
        console.error("Refresh Error:", error);
        await interaction.editReply({
          embeds: [createErrorEmbed("⚠️ Error updating data")],
        });
      }
    }

    if (interaction.customId === "delete_user") {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return await interaction.reply({
          embeds: [
            createWarningEmbed(
              "⛔ You don't have permission to use this feature"
            ),
          ],
          ephemeral: true,
        });
      }

      await interaction.deferReply({ ephemeral: true });

      try {
        const { users } = await getMemberStats();

        if (users.length === 0) {
          return await interaction.editReply({
            embeds: [createWarningEmbed("⚠️ No member data available")],
          });
        }

        const selectMenu = createUserSelectMenu(users, "select_user_to_delete");
        const cancelButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("cancel_delete")
        );

        await interaction.editReply({
          content: "**Please select user to delete:**",
          components: [selectMenu, cancelButton],
        });
      } catch (error) {
        console.error("Delete User Error:", error);
        await interaction.editReply({
          embeds: [createErrorEmbed("⚠️ Error fetching user data")],
        });
      }
    }

    if (interaction.customId === "cancel_delete") {
      await interaction.deferUpdate();
      await interaction.deleteReply();
    }

    if (interaction.customId === "confirm_delete") {
      await interaction.deferUpdate();

      const userId = interaction.message.embeds[0].footer.text.split("ID: ")[1];
      const userEmail =
        interaction.message.embeds[0].description.split("**")[1];

      try {
        await prisma.user.delete({
          where: { id: parseInt(userId) },
        });

        await interaction.editReply({
          embeds: [
            createSuccessEmbed(
              `✅ Successfully deleted user **${userEmail}** (ID: ${userId})`
            ),
          ],
          components: [],
        });

        setTimeout(async () => {
          await interaction.deleteReply();
        }, 5000);
      } catch (error) {
        console.error("Delete Confirmation Error:", error);
        await interaction.editReply({
          embeds: [createErrorEmbed("⚠️ Error deleting user")],
          ephemeral: true,
        });
      }
    }

    if (interaction.customId === "close_table") {
      await interaction.deferUpdate();
      await interaction.deleteReply();
    }

    if (interaction.customId === "export_csv") {
      await interaction.deferReply({ ephemeral: true });

      try {
        const { users } = await getMemberStats();
        let csvContent = "ID,Email,Username,Registration Date\n";

        users.forEach((user) => {
          csvContent +=
            `${user.id},${user.email},${user.username || "N/A"},` +
            `${new Date(user.createdAt).toLocaleDateString("en-US")}\n`;
        });

        const attachment = new AttachmentBuilder()
          .setFile(Buffer.from(csvContent, "utf-8"))
          .setName("members_export.csv");

        await interaction.editReply({
          embeds: [createSuccessEmbed("Member data exported successfully")],
          files: [attachment],
        });
      } catch (error) {
        console.error("Export Error:", error);
        await interaction.editReply({
          embeds: [createErrorEmbed("Error exporting data")],
        });
      }
    }
  }

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === "select_user_to_delete") {
      await interaction.deferUpdate();

      const userId = interaction.values[0];
      const selectedUser = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!selectedUser) {
        return await interaction.editReply({
          embeds: [createWarningEmbed("Selected user not found")],
          components: [],
        });
      }

      const confirmEmbed = new EmbedBuilder()
        .setTitle("Confirm User Deletion")
        .setDescription(
          `You are about to delete user **${selectedUser.email}**\n\nID: ${
            selectedUser.id
          }\nRegistration Date: ${new Date(
            selectedUser.createdAt
          ).toLocaleDateString("en-US")}`
        )
        .setColor("#FF0000")
        .setFooter({ text: `User ID: ${selectedUser.id}` });

      const confirmButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Confirm Deletion")
          .setStyle(ButtonStyle.Danger)
          .setCustomId("confirm_delete"),
        new ButtonBuilder()
          .setLabel("Cancel")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("cancel_delete")
      );

      await interaction.editReply({
        content: "",
        embeds: [confirmEmbed],
        components: [confirmButtons],
      });
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === "registerModal") {
      const email = interaction.fields.getTextInputValue("email");
      const password = interaction.fields.getTextInputValue("password");

      try {
        await axios.post(`${EXPRESS_API_BASE_URL}/register`, {
          email,
          password,
        });
        await interaction.reply({
          embeds: [
            createSuccessEmbed(`🎉 Welcome **${email}** to our system!`),
          ],
          ephemeral: true,
        });
        saveLog(
          `Modal registration by ${interaction.user.tag} (Email: ${email})`
        );
      } catch (err) {
        saveLog(`❌ Registration failed: ${err.message}`);
        console.error(err.response?.data || err.message);
        await interaction.reply({
          embeds: [
            createErrorEmbed("❌ Registration failed. Please try again."),
          ],
          ephemeral: true,
        });
      }
    }
  }
});

client.login(DISCORD_TOKEN);

module.exports = { client };
