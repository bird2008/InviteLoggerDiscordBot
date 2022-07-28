# Instruction
1.  Install [Node.js](https://nodejs.org/en/).
2.  Click on the file __**install.bat**__ which allows you to install the dependencies.
3.  Create an application by connecting to the [Portail Developers](https://discordapp.com/developers/applications/) on the Discord site then activate the bot options via the **Bot** tab and retrieve the token.
4.  At the bottom of the **Bot** tab page, enable the __**SERVER MEMBERS INTENT**__ ![Server Members Instant](https://i.imgur.com/ywbvEv0.png)
5.  Add the emojis that are in the __/assets/emojis__ folder (You can however choose another one)
6.  Open the __**config.js**__ file.
7.  Enter the requested information.
8.  Create a file that you will name **.env** in which you will write:
```
token=WWWWW
statusWebhookURL=XXXXX
addWebhookURL=YYYYY
removeWebhookURL=ZZZZZ
```
9.  Replace:
     * __WWWWWW__ with your bot token copied earlier.
     * __XXXXX__ by the link of the webhook through which the bot will send the message when it connects.
     * __YYYYY__ with the webhook link through which the bot will send the message when it joins a server.
     * __ZZZZZ__ with the webhook link through which the bot will send the message when it leaves a server.
10.  Invite your bot via the invitation link via the **OAuth2** tab.
11.  Finally, to launch the bot, double-click on the file __**start.bat**__.
12.  If you have any questions, open a comment in the GitHub tab **[Issues](https://github.com/aeziotech/bunny-logger/issues)**.

__**JOIN THE DISCORD SERVER OF THE BOT CREATOR:**__
[![discord-banner](./assets/img/discord-banner.png)](https://discord.gg/jHkcbS9YWC)
