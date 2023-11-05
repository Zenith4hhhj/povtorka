const config = require('../config')
const util = require('../addons/util')
const {
    Keyboard
} = require('vk-io')

// Функция для проверок :3
function nols(num) {
    if (num < 10) return ('0' + num)
    if (num > 9) return (num)
}

module.exports = async function (db, vk) {
    // Топ за сутки
    setInterval(() => {
        let hour = new Date().getHours()
        let minute = new Date().getMinutes()
        let o = `${nols(hour)}:${nols(minute)}`
        if (o == '00:00') {
            let topS = 0
            let top = []
            let topme = []

            for (let i in db.playersData) {
                top.push({
                    id: db.playersData[i].id,
                    name: db.playersData[i].name,
                    win: db.playersData[i].userStatistics.winDay
                })
            }

            top.sort(function (a, b) {
                if (b.win > a.win) return 1
                if (b.win < a.win) return -1
                return 0
            });
            for (let s = 0; s < top.length; s++) {
                topme.push(top[s].id)
            }
            for (let j in top) {
                topS += 1
                if (topS > 10) {
                    for (i in db.playersData) {
                        db.playersData[i].userStatistics.winDay = Number(0)
                    }
                    return vk.api.messages.send({
                        peer_id: config.adminConv,
                        message: `Награды за ежедневный топ успешно выданы :3`,
                        random_id: util.random(-200000000, 200000000)
                    }).catch((err) => {
                        console.log(`Ошибка при отправлке сообщения ${err}`);
                    });
                }




                if(topS == 1) {
                    db.playersData[top[j].id].pCoins += Number(3)

                    db.playersData[top[j].id].bbalance += Number(db.botSettings.topSettings.dayTop.amount[topS - 1])
                    vk.api.messages.send({
                        peer_id: top[j].id,
                        message: `Поздравляем!\nТы занял ${topS} место в ежедневном розыгрыше! ${util.number_format(db.botSettings.topSettings.dayTop.amount[topS -1])} VkCoin уже на твоём бонусном счету! Так же, мы начислили вам 3 конкурсных очка для конкурсна на 30 000р`,
                        random_id: util.random(-200000000, 200000000)
                    }).catch((err) => {
                        console.log(`Ошибка при отправлке сообщения ${err}`);
                    });
                }
                if(topS == 2) {
                    db.playersData[top[j].id].pCoins += Number(2)

                    db.playersData[top[j].id].bbalance += Number(db.botSettings.topSettings.dayTop.amount[topS - 1])
                    vk.api.messages.send({
                        peer_id: top[j].id,
                        message: `Поздравляем!\nТы занял ${topS} место в ежедневном розыгрыше! ${util.number_format(db.botSettings.topSettings.dayTop.amount[topS -1])} VkCoin уже на твоём бонусном счету! Так же, мы начислили вам 2 конкурсных очка для конкурсна на 30 000р`,
                        random_id: util.random(-200000000, 200000000)
                    }).catch((err) => {
                        console.log(`Ошибка при отправлке сообщения ${err}`);
                    });
                }
                if(topS == 3) {
                    db.playersData[top[j].id].pCoins += Number(1)
                    db.playersData[top[j].id].bbalance += Number(db.botSettings.topSettings.dayTop.amount[topS - 1])
                    vk.api.messages.send({
                        peer_id: top[j].id,
                        message: `Поздравляем!\nТы занял ${topS} место в ежедневном розыгрыше! ${util.number_format(db.botSettings.topSettings.dayTop.amount[topS -1])} VkCoin уже на твоём бонусном счету! Так же, мы начислили вам 1 конкурсных очка для конкурсна на 30 000р`,
                        random_id: util.random(-200000000, 200000000)
                    }).catch((err) => {
                        console.log(`Ошибка при отправлке сообщения ${err}`);
                    });
                }
                if(topS == 4) {
                    db.playersData[top[j].id].bbalance += Number(db.botSettings.topSettings.dayTop.amount[topS - 1])
                    vk.api.messages.send({
                        peer_id: top[j].id,
                        message: `Поздравляем!\nТы занял ${topS} место в ежедневном розыгрыше! ${util.number_format(db.botSettings.topSettings.dayTop.amount[topS -1])} VkCoin уже на твоём бонусном счету!`,
                        random_id: util.random(-200000000, 200000000)
                    }).catch((err) => {
                        console.log(`Ошибка при отправлке сообщения ${err}`);
                    });
                }
                if(topS == 5) {
                    db.playersData[top[j].id].bbalance += Number(db.botSettings.topSettings.dayTop.amount[topS - 1])
                    vk.api.messages.send({
                        peer_id: top[j].id,
                        message: `Поздравляем!\nТы занял ${topS} место в ежедневном розыгрыше! ${util.number_format(db.botSettings.topSettings.dayTop.amount[topS -1])} VkCoin уже на твоём бонусном счету!`,
                        random_id: util.random(-200000000, 200000000)
                    }).catch((err) => {
                        console.log(`Ошибка при отправлке сообщения ${err}`);
                    });
                }
                if(topS == 6) {
                    db.playersData[top[j].id].bbalance += Number(db.botSettings.topSettings.dayTop.amount[topS - 1])
                    vk.api.messages.send({
                        peer_id: top[j].id,
                        message: `Поздравляем!\nТы занял ${topS} место в ежедневном розыгрыше! ${util.number_format(db.botSettings.topSettings.dayTop.amount[topS -1])} VkCoin уже на твоём бонусном счету!`,
                        random_id: util.random(-200000000, 200000000)
                    }).catch((err) => {
                        console.log(`Ошибка при отправлке сообщения ${err}`);
                    });
                }
                if(topS == 7) {
                    db.playersData[top[j].id].bbalance += Number(db.botSettings.topSettings.dayTop.amount[topS - 1])
                    vk.api.messages.send({
                        peer_id: top[j].id,
                        message: `Поздравляем!\nТы занял ${topS} место в ежедневном розыгрыше! ${util.number_format(db.botSettings.topSettings.dayTop.amount[topS -1])} VkCoin уже на твоём бонусном счету!`,
                        random_id: util.random(-200000000, 200000000)
                    }).catch((err) => {
                        console.log(`Ошибка при отправлке сообщения ${err}`);
                    });
                }
                if(topS == 8) {
                    db.playersData[top[j].id].bbalance += Number(db.botSettings.topSettings.dayTop.amount[topS - 1])
                    vk.api.messages.send({
                        peer_id: top[j].id,
                        message: `Поздравляем!\nТы занял ${topS} место в ежедневном розыгрыше! ${util.number_format(db.botSettings.topSettings.dayTop.amount[topS -1])} VkCoin уже на твоём бонусном счету!`,
                        random_id: util.random(-200000000, 200000000)
                    }).catch((err) => {
                        console.log(`Ошибка при отправлке сообщения ${err}`);
                    });
                }
                if(topS == 9) {
                    db.playersData[top[j].id].bbalance += Number(db.botSettings.topSettings.dayTop.amount[topS - 1])
                    vk.api.messages.send({
                        peer_id: top[j].id,
                        message: `Поздравляем!\nТы занял ${topS} место в ежедневном розыгрыше! ${util.number_format(db.botSettings.topSettings.dayTop.amount[topS -1])} VkCoin уже на твоём бонусном счету!`,
                        random_id: util.random(-200000000, 200000000)
                    }).catch((err) => {
                        console.log(`Ошибка при отправлке сообщения ${err}`);
                    });
                }
                if(topS == 10) {
                    db.playersData[top[j].id].bbalance += Number(db.botSettings.topSettings.dayTop.amount[topS - 1])
                    vk.api.messages.send({
                        peer_id: top[j].id,
                        message: `Поздравляем!\nТы занял ${topS} место в ежедневном розыгрыше! ${util.number_format(db.botSettings.topSettings.dayTop.amount[topS -1])} VkCoin уже на твоём бонусном счету!`,
                        random_id: util.random(-200000000, 200000000)
                    }).catch((err) => {
                        console.log(`Ошибка при отправлке сообщения ${err}`);
                    });
                }
            }





        }
    }, 60000);


}