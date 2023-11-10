const axios = require('axios')
const config = require('../config.js')
const util = require('./util')

module.exports = async function (db, vk) {
    setInterval(async () => {
        let {
            data
        } = await axios.post(`https://api.keksik.io/donates/get`, {
            group: config.botPollingGroupId,
            token: config.keksikKey,
            v: Number(1)
        }).then((response) => {
            return response
        }).catch((err) => {
            console.error(err)
            return false
        })

        if(data == false || !data) return

        for (i in data.list) {
            if (!db.botSettings.botHistory.keksikHistory[data.list[i].id] && data.list[i].op && !data.list[i].anonym) {
                // ! Покупка баланса
                if (data.list[i].op == 100) {
                    db.botSettings.botHistory.keksikHistory[data.list[i].id] = {
                        id: data.list[i].id,
                        date: data.list[i].date,
                        amount: data.list[i].amount,
                        payload: data.list[i].op,
                        fromId: data.list[i].user,
                        transDate: util.getTimeStamp()
                    }
                    if (db.playersData[data.list[i].user]) {
                        // Уникальный айди транзакции
                        db.botSettings.botHistory.RepleinishId += Number(1)
                        db.playersData[data.list[i].user].bbalance += Math.floor(data.list[i].amount * 1000000 / 4.9)
                        vk.api.messages.send({
                            peer_id: data.list[i].user,
                            message: `🔥 Поступил платёж ${data.list[i].amount} ₽.\n🚀 Зачислили Вам ${util.number_format(data.list[i].amount * 1000000 / 4.9)} VkCoin\n\n⚙ ID: ${db.botSettings.botHistory.RepleinishId}`,
                            random_id: Date.now()
                        }).catch((err) => {
                            console.error(err)
                        })


                        let a = data.list[i].user
                        let b =data.list[i].amount
                        // Уведомление администратора
                        for( i in config.globalAdmins) {
                            vk.api.messages.send({
                                message: `!!! [id${a}|Пользователь] купил ${util.number_format(b * 1000000 / 4.9)} VkCoin на ${b} ₽\n(Куплено через Кексик)`,
                                peer_id: config.globalAdmins[i],
                                random_id: util.random(-2000000000, 2000000000)
                            }).catch((err) => {
                                console.error('VK API Error: ', err)
                            })
                        }

                    }
                }
                if (data.list[i].op == 200) {
                    db.botSettings.botHistory.keksikHistory[data.list[i].id] = {
                        id: data.list[i].id,
                        date: data.list[i].date,
                        amount: data.list[i].amount,
                        payload: data.list[i].op,
                        fromId: data.list[i].user,
                        transDate: util.getTimeStamp()
                    }
                    if (db.playersData[data.list[i].user]) {
                        // Уникальный айди транзакции
                        db.botSettings.botHistory.RepleinishId += Number(1)
                        db.playersData[data.list[i].user].vbalance += Math.floor(data.list[i].amount * 1000000 / 2.6)
                        vk.api.messages.send({
                            peer_id: data.list[i].user,
                            message: `🔥 Поступил платёж ${data.list[i].amount} ₽.\n🚀 Зачислили Вам ${util.number_format(data.list[i].amount * 1000000 / 2.6)} ${config.botVirtualCurrency}\n\n⚙ ID: ${db.botSettings.botHistory.RepleinishId}`,
                            random_id: Date.now()
                        }).catch((err) => {
                            console.error(err)
                        })


                        let a = data.list[i].user
                        let b =data.list[i].amount
                        // Уведомление администратора
                        for( i in config.globalAdmins) {
                            vk.api.messages.send({
                                message: `!!! [id${a}|Пользователь] купил ${util.number_format(b * 1000000 / 2.6)} ${config.botVirtualCurrency} на ${b} ₽\n(Куплено через Кексик)`,
                                peer_id: config.globalAdmins[i],
                                random_id: util.random(-2000000000, 2000000000)
                            }).catch((err) => {
                                console.error('VK API Error: ', err)
                            })
                        }

                    }
                }
            }
        }
    }, 5000)
}
