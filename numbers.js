const {
    Keyboard
} = require('vk-io')
const config = require('../../../config')
const util = require('../../../addons/util')
const admin = require('../../../addons/changeMenu')



module.exports = async function (db, vk, context, limits) {
    if (!context.isChat) return
    if (db.gamesData[context.peerId].convData.isActive == true && db.gamesData[context.peerId].convData.gamemode == 'wheel' && context.messagePayload && context.messagePayload.command == 'wheel_bet_numbers') {
        if(db.playersData[context.senderId].userData.globalSettings.isVirtualPlay == true) return

        // Записываем число
        let number = await context.question({
            message: `${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, введи число на которое желаешь поставить:`
        })

        if(number.messagePayload && Object.keys(number.messagePayload).length > 0) return         
        if(isNaN(number.text)) return 
        if(number.text > 36 || number.text < 0) return context.send({
            message: `${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, нельзя поставить на число меньше 0 и больше 36`
        })
        number.text = Math.floor(number.text)

        let scale = Math.floor(db.playersData[context.senderId].balance + db.playersData[context.senderId].bbalance)
        let _coin = null
        if (scale <= 0 || db.playersData[context.senderId].userData.globalSettings.allowInlineButtons == false) {
            _coin = await context.question({
                message: `${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, введи сумму ставки на выпадение числа ${number.text}:`
            })
        }
        if (scale > 0 && db.playersData[context.senderId].userData.globalSettings.allowInlineButtons == true) {
            _coin = await context.question({
                message: `${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, введи сумму ставки на выпадение числа ${number.text}:`,
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
        if(number.messagePayload && Object.keys(number.messagePayload).length > 0) return         
     
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

        // ? Максимальная ставка на одно число число 
        let currentStavka = 0
        for (i in db.gamesData) {
            if (db.gamesData[i].convGame.bets[context.senderId] && db.gamesData[i].convGame.bets[context.senderId] && db.gamesData[i].convData.isActive == true && db.gamesData[i].convData.gamemode == 'wheel') {
                if(db.gamesData[i].convGame.bets[context.senderId].numbers && db.gamesData[i].convGame.bets[context.senderId].numbers[number.text]) {
                    currentStavka += Math.floor(db.gamesData[i].convGame.bets[context.senderId].numbers[number.text].amount)
                    console.log(`ok`, db.gamesData[i].convGame.bets[context.senderId].numbers[number.text].amount)
                }
            }
        }
        currentStavka += Number(_coin)
        if (Number(currentStavka > db.botSettings.gamesSettings.Wheel.maxBets.numbersOne)) {
            return context.send({
                message: `${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, общая сумма ставок на число ${number.text} не должна превышать ${util.number_format(db.botSettings.gamesSettings.Wheel.maxBets.numbersOne)}`
            })
        }
        // ? Максимальная ставка на сумму для чисел
        let currentSum = 0
        for (i in db.gamesData) {
            if (db.gamesData[i].convGame.bets[context.senderId] && db.gamesData[i].convGame.bets[context.senderId] && db.gamesData[i].convData.isActive == true && db.gamesData[i].convData.gamemode == 'wheel') {
                if(db.gamesData[i].convGame.bets[context.senderId].numbers) { 
                    for(d in db.gamesData[i].convGame.bets[context.senderId].numbers) {
                        currentSum += Math.floor(db.gamesData[i].convGame.bets[context.senderId].numbers[d].amount)
                        console.log(`ok`, db.gamesData[i].convGame.bets[context.senderId].numbers[d].amount)
                    }
                }
            }
        }
        currentSum += Number(_coin)
        if (Number(currentSum > db.botSettings.gamesSettings.Wheel.maxBets.numberSum)) {
            return context.send({
                message: `${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, общая сумма ставок на числа не должна превышать ${util.number_format(db.botSettings.gamesSettings.Wheel.maxBets.numberSum)}`
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
        if (!db.gamesData[context.peerId].convGame.bets[context.senderId].numbers) {
            db.gamesData[context.peerId].convGame.bets[context.senderId].numbers = {}
        }

        if(!db.gamesData[context.peerId].convGame.bets[context.senderId].numbers[number.text]) {
            db.gamesData[context.peerId].convGame.bets[context.senderId].numbers[number.text] = {
                amount: 0,
                number: number.text
            }
        }
        db.gamesData[context.peerId].convGame.bets[context.senderId].numbers[number.text].amount += Math.floor(_coin)
        db.gamesData[context.peerId].convGame.amount += Math.floor(_coin)
 let amountToTake = Number(_coin) - Number(db.playersData[context.senderId].balance)        
scale = Math.floor(db.playersData[context.senderId].balance + db.playersData[context.senderId].bbalance)
        if (scale >= _coin) {

        // Снятие основного баланса
        if (Number(db.playersData[context.senderId].balance) >= Number(_coin)) {
            db.playersData[context.senderId].balance -= Number(_coin)
            context.send(`${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, успешная ставка ${util.number_format(_coin)} коинов на выпадение числа ${number.text}`)
            return admin.getWheelAdminMenu(db, vk, context, limits, _coin, `число ${number.text}`)
        }
        // Снятие бонусного баланса 
        if (Number(db.playersData[context.senderId].bbalance) >= Number(_coin)) {
            db.playersData[context.senderId].bbalance -= Number(_coin)
            context.send(`${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, успешная ставка ${util.number_format(_coin)} коинов на выпадение числа ${number.text}`)
            return admin.getWheelAdminMenu(db, vk, context, limits, _coin, `число ${number.text}`)
        }
        // Смешивание балансов
        if (Number(db.playersData[context.senderId].bbalance) >= amountToTake) {
            db.playersData[context.senderId].balance -= Number(db.playersData[context.senderId].balance)
            db.playersData[context.senderId].bbalance -= Number(amountToTake)
            context.send(`${db.playersData[context.senderId].userData.globalSettings.allowCallNickname == true ? `[id${context.senderId}|${db.playersData[context.senderId].name}]` : `${db.playersData[context.senderId].name}`}, успешная ставка ${util.number_format(_coin)} коинов на выпадение числа ${number.text}`)
            return admin.getWheelAdminMenu(db, vk, context, limits, _coin, `число ${number.text}`)
        }


        }
    }

}