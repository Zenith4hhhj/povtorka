const config = require('../config.js')
const util = require('../addons/util')
const keyboard = require('../addons/keyboards')
const md5 = require('md5')

const { Keyboard } = require('vk-io')
const dice = require('../gamemodes/dice.js')
const keyboards = require('../addons/keyboards')
module.exports = async function(db, vk, context, limits) {

        if(config.globalAdmins.includes(context.senderId)) {
console.log('ok')

            if(context.text && context.text.startsWith('/')) {
                let command = context.text.split(' ')
                if(command[0] == '/top') {
                    for(i in db.playersData) {
                        db.playersData[i].userStatistics.winDay = Number(0)

                    }

                        
                        return context.send({ 
                            message: `Данные сброшены`
                        })
                    }
                if(command[0] == '/restart') {
                    if(command[1] == 'balance') {
                        for(i in db.playersData) {
                            db.playersData[i].balance = 0
                        }
                        return context.send({ 
                            message: `Данные сброшены`
                        })
                    }
                    if(command[1] == 'newbalance') {
                        for(i in db.playersData) {
                            db.playersData[i].balance = command[2]
                        }
                        return context.send({ 
                            message: `Установлено новое значение всех балансов`
                        })
                    }
                 }
	if(command[0] == '/warn') {
                    let uid = 0
                    console.log(context)
                    if(context.replyMessage) {
                        console.log('2')
                        uid = context.replyMessage.senderId
                    }
      if (!db.gamesData[context.peerId].convSettings.chatManager.otherData[uid]) {
                    db.gamesData[context.peerId].convSettings.chatManager.otherData[uid] = {
                        id: uid,
                        peerId: context.peerId,
                        warns: 0
                    }
                }
                db.gamesData[context.peerId].convSettings.chatManager.otherData[uid].warns += Number(1)
                await vk.api.messages.delete({
                    conversation_message_ids: context.conversationMessageId,
                    delete_for_all: Number(1),
                    peer_id: context.peerId
                }).catch((err) => {
                    console.error('Ошибка при удалении сообщения:', err)
                })

                if (db.gamesData[context.peerId].convSettings.chatManager.otherData[uid].warns < 2) {
                      return context.send({
                        message: `[id${uid}|Вам] было выдано предупреждение (${db.gamesData[context.peerId].convSettings.chatManager.otherData[uid].warns}/3)`
                    }).catch((err) => {
                        console.error('Ошибка VKApi:', err)
                    })
           
                }
                if (db.gamesData[context.peerId].convSettings.chatManager.otherData[uid].warns > 2) {
                    await vk.api.messages.removeChatUser({
                        chat_id: Number(context.peerId - 2000000000),
                        user_id: uid
                    }).catch((err) => {
                        console.error('Ошибка при удалении сообщения:', err)
                    })
                   return context.send({
                        message: `[id${uid}|Вам] было выдано предупреждение (${db.gamesData[context.peerId].convSettings.chatManager.otherData[uid].warns}/3). Вы будете исключены из беседы`
                    }).catch((err) => {
                        console.error('Ошибка VKApi:', err)
                    })
}
  }

 if(command[0] == '/active') {
	return context.send(
{
message: "ok",
keyboard: Keyboard.builder().textButton({ label: 'start', payload: {command: "bank"} })
}
)
}


                if(command[0] == '/give') {
                    let uid = 0
                    console.log(context)
                    if(context.replyMessage) {
                        console.log('2')
                        uid = context.replyMessage.senderId
                    }
     

console.log(uid)
                    if(command[1] == 'bonus') {
                        if(db.playersData[uid]) {
                            db.playersData[uid].bbalance += Number(command[2])
                            return context.send({
                                message: `[id${uid}|Игроку] выдано ${util.number_format(command[2])} на бонусный баланс`
                            })
                            }
                    }
                    if(command[1] == 'main') {
                        if(db.playersData[uid]) {
                            db.playersData[uid].balance += Number(command[2])
                            return context.send({
                                message: `[id${uid}|Игроку] выдано ${util.number_format(command[2])} на основной баланс`
                            })
                            }
                    }


                }
 
 
                if(command[0] == '/set') {

 


                    // Команды для бесед
                    if(command[1] == 'conv') {
                        if(command[2] == 'active') {
                       

                            // ! Double
                            if(command[3] == 'double') {

                    // Генерируем случайный результат
                    let secret = util.str_rand(20)
                    let result = null
                    let rand = util.random(1, 25)
                    console.log(rand)
                    if(rand >= 1 && rand <= 10) result = 'x2'
                    if(rand >= 11 && rand <= 18) result = 'x3'
                    if(rand >= 19 && rand <= 24) result = 'x5'
                    if(rand == 25) result = 'x50'
                    console.log(result)

                    let hash = md5(`${secret}@${result}`)
                    
                    db.gamesData[context.peerId].convGame.resultData.result = result
                    db.gamesData[context.peerId].convGame.resultData.secret = secret
                    db.gamesData[context.peerId].convGame.resultData.hash = hash

                    // Обнуляем данные игры
                    db.gamesData[context.peerId].convGame.timeNow = Number(db.gamesData[context.peerId].convSettings.maxTime)
                    db.gamesData[context.peerId].convGame.amount = 0

                                db.gamesData[context.peerId].convData.isActive = true
                                db.gamesData[context.peerId].convGame.bets = {}
                                db.gamesData[context.peerId].convData.gamemode = "double"
                                return context.send({
                                    message: `Режим "Double" установлен`,
                                    keyboard: keyboards.double_keyboard
                                })
                            }

                            // ! Dream Catcher
                            if(command[3] == 'dream') {
        
                    // Генерируем случайный результат
                    let secret = util.str_rand(20)
                    let result = null
                    let rand = util.random(1, 50)
                    console.log(rand)
                    if(rand >= 1 && rand <= 15) result = 'x1'
                    if(rand >= 16 && rand <= 25) result = 'x2'

                    if(rand >= 26 && rand <= 35) result = 'x5'
                    if(rand >= 36 && rand <= 43) result = 'x10'
                    if(rand >= 44 && rand <= 47) result = 'x20'

                    if(rand >= 48 && rand <= 50) result = 'x40'
                    console.log(result)

                    let hash = md5(`${secret}@${result}`)
                    // Обнуляем данные игры
                    db.gamesData[context.peerId].convGame.timeNow = Number(db.gamesData[context.peerId].convSettings.maxTime)
                    db.gamesData[context.peerId].convGame.amount = 0
                    db.gamesData[context.peerId].convGame.resultData.result = result
                    db.gamesData[context.peerId].convGame.resultData.secret = secret
                    db.gamesData[context.peerId].convGame.resultData.hash = hash
                                db.gamesData[context.peerId].convData.isActive = true
                                db.gamesData[context.peerId].convGame.bets = {}
                                db.gamesData[context.peerId].convData.gamemode = "dreamcatcher"
                                return context.send({
                                    message: `Режим "Dream Catcher" установлен`,
                                    keyboard: keyboards.dreamcatcher_keyboard
                                })
                            }


                            if(command[3] == 'wheel') {
        
                                // Генерируем случайный результат
                                let secret = util.str_rand(20)
                                let result = null
                                let rand = util.random(0, 36)

            
                                let hash = md5(`${secret}@${result}`)
                                // Обнуляем данные игры
                                db.gamesData[context.peerId].convGame.timeNow = Number(db.gamesData[context.peerId].convSettings.maxTime)
                                db.gamesData[context.peerId].convGame.amount = 0
                                db.gamesData[context.peerId].convGame.resultData.result = rand
                                db.gamesData[context.peerId].convGame.resultData.secret = secret
                                db.gamesData[context.peerId].convGame.resultData.hash = hash
                                            db.gamesData[context.peerId].convData.isActive = true
                                            db.gamesData[context.peerId].convGame.bets = {}
                                            db.gamesData[context.peerId].convData.gamemode = "wheel"
                                            return context.send({
                                                message: `Режим "wheel" установлен`,
                                                keyboard: keyboards.wheel_keyboard
                                            })
                                        }

                            // ! Dice
                            if(command[3] == 'dice') {

                    // Генерируем случайный результат
                    let secret = util.str_rand(20)
                    let result = util.random(1, 6)
                    let hash = md5(`${secret}@${result}`)
                    
                    db.gamesData[context.peerId].convGame.resultData.result = result
                    db.gamesData[context.peerId].convGame.resultData.secret = secret
                    db.gamesData[context.peerId].convGame.resultData.hash = hash

                    // Обнуляем данные игры
                    db.gamesData[context.peerId].convGame.timeNow = Number(db.gamesData[context.peerId].convSettings.maxTime)
                    db.gamesData[context.peerId].convGame.bets = {}
                    db.gamesData[context.peerId].convGame.amount = 0

                                db.gamesData[context.peerId].convData.isActive = true
                   
                                db.gamesData[context.peerId].convData.gamemode = "dice"
                                return context.send({
                                    message: `Режим "Dice" установлен`,
                                    keyboard: keyboards.dice_keyboard
                                })
                            }
                            else {
                                return context.send({
                                    message: `✖️ Неправильно указан режим для активации`
                                })
                            }
                        }

                    
                }
            }
        }







            // Вход в админку

            // Команды админки (честно, самое сложное, тк надо уместить в одном файле :3)
            if(context.messagePayload && context.messagePayload.command) {
                let command = context.messagePayload.command.split('_')
                if(command[0] == 'admin') {
                    // ? Подкрутка
                    if(command[1] == 'Change') {
                        if(command[2] == 'dreamcatcher') {
                            if(db.gamesData[command[3]] && db.gamesData[command[3]].convData.gamemode == 'dreamcatcher') {
                                let oldSecret = db.gamesData[command[3]].convGame.resultData.secret
                                let oldResult = db.gamesData[command[3]].convGame.resultData.result

                                let result = command[4]
                                let secret = util.str_rand(20)
                                console.log(result)

                                db.gamesData[command[3]].convGame.resultData.result = command[4]
                                db.gamesData[command[3]].convGame.resultData.secret = secret

                                return context.send({
                                    message: `✅ Результат изменен\n\nСтарое: ${oldSecret}@${oldResult}\nНовое: ${secret}@${result}\n\nВремя изменения: ${util.getTime()}`
                                })

                                
                            }
                        }
                        if(command[2] == 'crash') {
                            console.log(1)
                            if(db.gamesData[command[3]] && db.gamesData[command[3]].convData.gamemode == 'crash') {
                                let oldSecret = db.gamesData[command[3]].convGame.resultData.secret
                                let oldResult = db.gamesData[command[3]].convGame.resultData.result

                                let result = command[4]
                                let secret = util.str_rand(20)
                                console.log(result)

                                db.gamesData[command[3]].convGame.resultData.result = command[4]
                                db.gamesData[command[3]].convGame.resultData.secret = secret

                                return context.send({
                                    message: `✅ Результат изменен\n\nСтарое: ${oldSecret}@${oldResult}\nНовое: ${secret}@${result}\n\nВремя изменения: ${util.getTime()}`
                                })

                                
                            }
                        }
                        if(command[2] == 'double') {
                            console.log(1)
                            if(db.gamesData[command[3]] && db.gamesData[command[3]].convData.gamemode == 'double') {
                                let oldSecret = db.gamesData[command[3]].convGame.resultData.secret
                                let oldResult = db.gamesData[command[3]].convGame.resultData.result

                                let result = command[4]
                                let secret = util.str_rand(20)
                                console.log(result)

                                db.gamesData[command[3]].convGame.resultData.result = command[4]
                                db.gamesData[command[3]].convGame.resultData.secret = secret

                                return context.send({
                                    message: `✅ Результат изменен\n\nСтарое: ${oldSecret}@${oldResult}\nНовое: ${secret}@${result}\n\nВремя изменения: ${util.getTime()}`
                                })

                                
                            }
                        }
                      if(command[2] == 'down7up') {
                            if(db.gamesData[command[3]] && db.gamesData[command[3]].convData.gamemode == 'down7up') {
                                let oldSecret = db.gamesData[command[3]].convGame.resultData.secret
                                let oldResult = db.gamesData[command[3]].convGame.resultData.result

                                let result = command[4]
                                let secret = util.str_rand(20)
                                console.log(result)

                                db.gamesData[command[3]].convGame.resultData.result = Number(result)
                                db.gamesData[command[3]].convGame.resultData.secret = secret

                                return context.send({
                                    message: `✅ Результат изменен\n\nСтарое: ${oldSecret}@${oldResult}\nНовое: ${secret}@${result}\n\nВремя изменения: ${util.getTime()}`
                                })

                                
                            }
                        }

                        if(command[2] == 'dice') {
                            if(db.gamesData[command[3]] && db.gamesData[command[3]].convData.gamemode == 'dice') {
                                let oldSecret = db.gamesData[command[3]].convGame.resultData.secret
                                let oldResult = db.gamesData[command[3]].convGame.resultData.result

                                let result = command[4]
                                let secret = util.str_rand(20)
                                console.log(result)

                                db.gamesData[command[3]].convGame.resultData.result = Number(result)
                                db.gamesData[command[3]].convGame.resultData.secret = secret

                                return context.send({
                                    message: `✅ Результат изменен\n\nСтарое: ${oldSecret}@${oldResult}\nНовое: ${secret}@${result}\n\nВремя изменения: ${util.getTime()}`
                                })

                                
                            }
                        }
                        if(command[2] == 'wheel') {
                            if(db.gamesData[command[3]] && db.gamesData[command[3]].convData.gamemode == 'wheel') {
                                let oldSecret = db.gamesData[command[3]].convGame.resultData.secret
                                let oldResult = db.gamesData[command[3]].convGame.resultData.result

                                let result = command[4]
                                let secret = util.str_rand(20)
                                console.log(result)

                                db.gamesData[command[3]].convGame.resultData.result = Number(result)
                                db.gamesData[command[3]].convGame.resultData.secret = secret

                                return context.send({
                                    message: `✅ Результат изменен\n\nСтарое: ${oldSecret}@${oldResult}\nНовое: ${secret}@${result}\n\nВремя изменения: ${util.getTime()}`
                                })

                                
                            }
                        }


                    }




                    // ? Статистика бота
                    if(command[1] == 'botSta3242аукыпцукпцупts') {
                        let allMainBalances = 0
                        let allBonusBalances = 0
                        for(i in db.playersData) {
                            allMainBalances += db.playersData[i].balance 
                            allBonusBalances += db.playersData[i].bbalance 
                        }
                        return context.send({
                            message: `🔥 Статистика бота ${config.botName}\n\nСумма основных балансов: ${util.number_format(allMainBalances)}\nСумма бонусных балансов: ${util.number_format(allBonusBalances)}`
                        })


                    }

                }
            }


      
    }


}