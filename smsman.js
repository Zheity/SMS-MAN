const {  SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()  
    .setName('smsman')
    .setDescription('Generate asci.')
    .addSubcommand(subcommand =>
        subcommand.setName('balance')
        .setDescription('see the balance you have in your account')
        .addStringOption(option => 
            option.setName("token")
            .setDescription("Put your account token")
            .setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand.setName('request-number')
        .setDescription('Buy a phone number.')
        .addStringOption(option => 
            option.setName("token")
            .setDescription("Put your account token")
            .setRequired(true))
            .addIntegerOption(option => 
                option.setName("country_id")
                .setDescription("Put the country id")
                .setRequired(true))
                .addIntegerOption(option => 
                    option.setName("application_id")
                    .setDescription("Put the application id")
                    .setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand.setName('get-sms')
        .setDescription('Receive the sms of the number you bought.')
        .addStringOption(option => 
            option.setName("token")
            .setDescription("Put your account token")
            .setRequired(true))
            .addIntegerOption(option => 
                option.setName("request_id")
                .setDescription("Put the Request id that you received when you bought the phone number.")
                .setRequired(true))
    ),

    async execute(interaction, client) {

        const getSubCommand = interaction.options.getSubcommand();

        await interaction.deferReply({ ephemeral: true });

        if (getSubCommand === "balance") {
            const { options } = interaction;
            const token  = options.getString("token")

            const money = await fetch(`http://api.sms-man.com/control/get-balance?token=${token}`).then((res) => res.json());

            const embed = new EmbedBuilder()
            .setTitle("SMS-MAN")
            .setDescription(`View your account balance in RUB`)
            .setColor("Random")
            .addFields(
                {
                    name: "Balance",
                    value: `${money.balance} RUB`,
                },
            )
            .setFooter({text: interaction.user.username, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setImage("https://pbs.twimg.com/media/FCTieJhXIBUU7cc.jpg:large")
    
            interaction.editReply({ embeds: [embed]})
    
          } else if(getSubCommand === "request-number") {

            const { options } = interaction;
            const token  = options.getString("token")
            const country =  options.getInteger("country_id")
            const application =  options.getInteger("application_id")

            const requestNumber = await fetch(`http://api.sms-man.com/control/get-number?token=${token}&country_id=${country}&application_id=${application}`).then((res) => res.json());
 
            const embed2 = new EmbedBuilder()
            .setTitle("SMS-MAN")
            .setDescription("**IMPORTANTE: SAVE THE REQUEST_ID YOU WILL NEED IT TO GET THE SMS**")
            .setColor("Random")
            .addFields(
                {
                    name: "Phone Number",
                    value: `${requestNumber.number || requestNumber.error_msg}`,
                },
                {
                    name: "Request id",
                    value: `${requestNumber.request_id || "NULL"}`
                },
            )
            .setFooter({text: interaction.user.username, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setImage("https://pbs.twimg.com/media/FCTieJhXIBUU7cc.jpg:large")
    
            interaction.editReply({ embeds: [embed2]})

      } else if(getSubCommand === "get-sms") {

            const { options } = interaction;
            const token  = options.getString("token")
            const request =  options.getInteger("request_id")
 
            const requestID = await fetch(`http://api.sms-man.com/control/get-sms?token=${token}&request_id=${request}`).then((res) => res.json());
 
            const embed3 = new EmbedBuilder()
            .setTitle("SMS-MAN")
            .setDescription("Receive here the SMS of the number you purchased to receive the SMS and the value of your phone number will be permanently deducted")
            .setColor("Random")
            .addFields(
                {
                    name: "Phone Number",
                    value: `${requestID.number || "NULL"}`,
                },
                {
                    name: "SMS Code",
                    value: `${requestID.sms_code || requestID.error_msg}`,
                }
            )
            .setFooter({text: interaction.user.username, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setImage("https://pbs.twimg.com/media/FCTieJhXIBUU7cc.jpg:large")
    
            interaction.editReply({ embeds: [embed3]})

      }

    }
}