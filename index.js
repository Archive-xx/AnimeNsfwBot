const config = require("./botconfig.json");
const nekoclient = require('nekos.life');
const Discord = require("discord.js");
const RichEmbed = require("discord.js");
const neko = new nekoclient();
const request = require("request");
// need rework https://nekos.life/api/v2/endpoints
const nsfwlist = ["nsfw_neko_gif", "randomHentaiGif", "pussy", "nekoGif", "neko", "lesbian", "kuni", "cumsluts", "classic", "boobs", "bJ", "anal", "avatar", "yuri", "trap", "tits", "girlSoloGif", "girlSolo", "smallBoobs", "pussyWankGif", "pussyArt", "kemonomimi", "kitsune", "keta", "holo", "holoEro", "hentai", "futanari", "femdom", "feetGif", "eroFeet", "feet", "ero", "eroKitsune", "eroKemonomimi", "eroNeko", "eroYuri", "cumArts", "blowJob", "pussyGif"];


const bot = new Discord.Client();

bot.on("ready", async() => {
    console.log(`${bot.user.username} is online`);
    bot.user.setActivity("<h for help", "PLAYING");
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray[1];

    if(cmd == `${prefix}help`){
        return message.author.send("No help");
    }

    if(cmd == `${prefix}neko`){
        if(args == undefined){
            request("https://nekos.life/api/v2/img/neko", function(error, response, body){
                let msg = JSON.parse(body);
                return message.channel.send(msg.url);
            });
        }else{
            if(nsfwlist.includes(args)){
                if(message.channel.nsfw){
                    request("https://nekos.life/api/v2/img/" + args, function(error, response, body){
                        let msg = JSON.parse(body);
                            try{
                                return message.channel.send(msg.url);
                            }
                            catch{
                                return message.channel.send("Does the tag exist?");
                            }
                        });
                } else {
                    return message.channel.send("Channel is not set nsfw");
                }
            } else {
                request("https://nekos.life/api/v2/img/" + args, function(error, response, body){
                    let msg = JSON.parse(body);
                        try{
                            return message.channel.send(msg.url);
                        }
                        catch{
                            return message.channel.send("Does the tag exist?");
                        }
                    });
            }
            
        }
    }


});

bot.login(config.token);