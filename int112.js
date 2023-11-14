const {
    Keyboard
} = require('vk-io')
const config = require('../../../config')
const util = require('../../../addons/util')
const admin = require('../../../addons/changeMenu')



module.exports = async function (db, vk, context, limits) {
    if (!context.isChat) return
    if (db.gamesData[context.peerId].convData.isActive == true && db.gamesData[context.peerId].convData.gamemode == 'wheel' && context.messagePayload && context.messagePayload.command == 'wheel_bet_int112') {
        if(db.playersData[context.senderId].userData.globalSettings.isVirtualPlay == true) return

        let scale = Math.floor(db.playersData[context.senderId].balance + db.playersData[context.senderId].bbalance)
        let _coin = null
        if (scale <= 0 || db.playersData[context.senderId].userData.globalSettings.allowInlineButtons == false) {
            _coin = await context.question({
                message: `${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, введи сумму ставки на промежуток 1-12:`
            })
        }
        if (scale > 0 && db.playersData[context.senderId].userData.globalSettings.allowInlineButtons == true) {
            _coin = await context.question({
                message: `${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, введи сумму ставки на промежуток 1-12 ИЛИ нажми на кнопку:`,
                keyboard: Keyboard.builder()
                    .textButton({
                        label: `${util.number_format(scale / 4)}`
                    }).row()
                    .textButton({
                        label: `${util.number_format(scale / 2)}`
                    }).row()
                    .textButton({
                        label: `${util.number_format(scale / 1)}`
                    }).inline()
            })
        }
        if(_coin.messagePayload && Object.keys(_coin.messagePayload).length > 0) return         

        _coin = _coin.text
        _coin = util.rewrite_numbers(_coin)
        let message = _coin == null ? '' : _coin
        let noti = message.split('] ')
        console.log(noti)
        if (message[0] == '[' && noti[0].split('|').length == 2 && (noti[0].split('|')[0] == `[club` + config.botPollingGroupId || noti[0].split('|')[0] == `[public` + config.botPollingGroupId)) {
            noti.splice(0, 1)
            _coin = noti.join('] ')
            _coin = _coin.replace(/(\ |\,)/ig, '');
        }

        if (_coin.endsWith('к') || _coin.endsWith('k')) {
            let colva = ((_coin.match(/к|k/g) || []).length);
            console.log(colva)
            _coin = _coin.replace(/к/g, '')
            _coin = _coin.replace(/k/g, '')
            _coin = _coin * Math.pow(1000, colva);
        }

        if (_coin < 1 || isNaN(_coin)) return
        _coin = Math.floor(_coin)

        console.log(_coin)
        scale = Math.floor(db.playersData[context.senderId].balance + db.playersData[context.senderId].bbalance)
        if (scale < _coin) {
            return context.send({
                message: `${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, вам не хватает ${util.number_format(_coin - scale)} коинов`
            })
        }        // ? Проверка на минимальную ставку 
        if (_coin < db.botSettings.gamesSettings.minimalBet) {
            return context.send({
                message: `${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, минимальная сумма ставки ${util.number_format(db.botSettings.gamesSettings.minimalBet)} коинов`
            })
        }
        // ! Наконец-то нормальная максимальная ставка
        let currentStavka = 0
        for (i in db.gamesData) {
            if (db.gamesData[i].convGame.bets[context.senderId] && db.gamesData[i].convGame.bets[context.senderId].int112 && db.gamesData[i].convData.isActive == true && db.gamesData[i].convData.gamemode == 'wheel') {
                currentStavka += Math.floor(db.gamesData[i].convGame.bets[context.senderId].int112)
                console.log(`ok`, db.gamesData[i].convGame.bets[context.senderId].int112)
            }
        }
        currentStavka += Number(_coin)
        if (Number(currentStavka > db.botSettings.gamesSettings.Wheel.maxBets.intS)) {
            return context.send({
                message: `${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, общая сумма ставок промежутки не должна превышать ${util.number_format(db.botSettings.gamesSettings.Wheel.maxBets.intS)} коинов`
            })
        }
        // ? Проверка таймера беседы (важная вещь, чтобы код не багали)
        if (limits.conv.includes(context.peerId)) return
        // Ограничение действий
        if (limits.users.includes(context.senderId)) {
            limits.push(context.senderId)
            return setTimeout(async () => {
                limits.users.splice(-1, context.senderId)
            }, 500)
        }
        limits.users.push(context.senderId)
        setTimeout(async () => {
            limits.users.splice(-1, context.senderId)
        }, 500)
        if (!db.gamesData[context.peerId].convGame.bets[context.senderId]) {
            db.gamesData[context.peerId].convGame.bets[context.senderId] = {
                id: context.senderId,
                peerId: context.peerId,
                top_data: 0
            }
        }
        if (!db.gamesData[context.peerId].convGame.bets[context.senderId].int112) {
            db.gamesData[context.peerId].convGame.bets[context.senderId].int112 = 0
        }
        db.gamesData[context.peerId].convGame.bets[context.senderId].int112 += Math.floor(_coin)
        db.gamesData[context.peerId].convGame.amount += Math.floor(_coin)
 let amountToTake = Number(_coin) - Number(db.playersData[context.senderId].balance)
        scale = Math.floor(db.playersData[context.senderId].balance + db.playersData[context.senderId].bbalance)
        if (scale >= _coin) {
        // Снятие основного баланса
        if (Number(db.playersData[context.senderId].balance) >= Number(_coin)) {
            db.playersData[context.senderId].balance -= Number(_coin)
            context.send(`${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, успешная ставка ${util.number_format(_coin)} коинов на промежуток 1-12`)
            return admin.getWheelAdminMenu(db, vk, context, limits, _coin, 'промежуток 1-12')
        }
        // Снятие бонусного баланса 
        if (Number(db.playersData[context.senderId].bbalance) >= Number(_coin)) {
            db.playersData[context.senderId].bbalance -= Number(_coin)
            context.send(`${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, успешная ставка ${util.number_format(_coin)} коинов на промежуток 1-12`)
            return admin.getWheelAdminMenu(db, vk, context, limits, _coin, 'промежуток 1-12')
        }
        // Смешивание балансов
        if (Number(db.playersData[context.senderId].bbalance) >= amountToTake) {
            db.playersData[context.senderId].balance -= Number(db.playersData[context.senderId].balance)
            db.playersData[context.senderId].bbalance -= Number(amountToTake)
            context.send(`${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, успешная ставка ${util.number_format(_coin)} коинов на промежуток 1-12`)
            return admin.getWheelAdminMenu(db, vk, context, limits, _coin, 'промежуток 1-12')
        }
        }
    }

}