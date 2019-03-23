const fs = require('fs');
const config = require("./botconfig.json");
const Discord = require("discord.js");
const request = require("request");
// need rework https://nekos.life/api/v2/endpoints
const nsfwlist = ["nsfw_neko_gif", "randomHentaiGif", "pussy", "nekoGif", "neko", "lesbian", "kuni", "cumsluts", "classic", "boobs", "bJ", "anal", "avatar", "yuri", "trap", "tits", "girlSoloGif", "girlSolo", "smallBoobs", "pussyWankGif", "pussyArt", "kemonomimi", "kitsune", "keta", "holo", "holoEro", "hentai", "futanari", "femdom", "feetGif", "eroFeet", "feet", "ero", "eroKitsune", "eroKemonomimi", "eroNeko", "eroYuri", "cumArts", "blowJob", "pussyGif"];

const channelsName = './channels.json';
const channels = require(channelsName);


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

    if(cmd == `${prefix}add`){
        channels.entries.push({"ch": message.channel.id, "sub": args});
        fs.writeFile(channelsName, JSON.stringify(channels), function(err){
            if(err) return console.log(err);
            console.log("Updated channels file:" + message.channel.id + ":" + args);
        });
        return message.channel.send("Added channel to update list with subreddit: " + args);
    }

    if(cmd == `${prefix}remove`){
        let channelid = message.channel.id;
        return message.channel.send("Faild! Code: ```RCF:" + channelid + "```Please message this code to @31ank#4002")
    }

    if(cmd == `${prefix}force`){
        sendMessage(true);
    }
});

function sendMessage(force = false){
    let rawdata = fs.readFileSync("./channels.json");
    let out_channels = JSON.parse(rawdata);
    var times = ['00', '04', '08', '12', '16', '20'];
    console.log(times);
    var update = false;
    currentDate = new Date();
    times.forEach(function(element){
        let time_min = new Date(currentDate.getTime());
        time_min.setHours(element);
        time_min.setMinutes(0);
        let time_max = new Date(time_min.getTime());
        time_max.setMinutes('30');
        if(currentDate.getTime() > time_min.getTime() && currentDate.getTime() < time_max.getTime()){
            update = true;
        }
    });
    if(force){
        update = true;
    }
    if(update){
        console.log("Updatetime: " + currentDate.getTime());
        out_channels.entries.forEach(element => {
            let channel = element["ch"];
            try{
                request(`https://www.reddit.com/r/${element.sub}/rising/.json?limit={1}`, function(error, response, body){
                    let items = JSON.parse(body);
                    let imgurl = items["data"]["children"]["0"]["data"]["url"];
                    bot.channels.get(channel).send(imgurl);
                });
            } catch {
                console.log("Send message error\nBot offline?")
            }
            setTimeout(sendMessage, 1800000); // Every half hour check
        });
    }
}

bot.login(config.token);

setTimeout(sendMessage, 10000);  // Wait till bot is online