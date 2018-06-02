enum EstablishmentColor {
  Red,
  Green,
  Blue,
  Purple
}

interface Establishment {
  readonly name: string
  readonly description: string
  readonly color: EstablishmentColor
  readonly activation: DiceRoll[]
  readonly cost: Money
  activate(roller: Player, owner: Player, game: Game)
}

class RedEstablishment implements Establishment {
  // copy and pasted:
  readonly name: string
  readonly description: string
  readonly activation: DiceRoll[]
  readonly cost: Money
  //
  readonly color = EstablishmentColor.Red
  readonly reward: Money
  readonly extraRequirements = (roller: Player, owner: Player, game: Game)=>true
  activate(roller: Player, owner: Player, game: Game) {
    if (roller == owner) return
    if (!this.extraRequirements(roller,owner,game)) return

    if (roller.money < this.reward) {
      owner.money += roller.money
      roller.money = 0
    } else {
      owner.money += this.reward
      roller.money -= this.reward
    }
  }
}

class GreenEstablishment implements Establishment {
  // copy and pasted:
  readonly name: string
  readonly description: string
  readonly activation: DiceRoll[]
  readonly cost: Money
  //
  readonly color = EstablishmentColor.Green
  readonly reward: Money
  readonly multipliers: Establishment[] = [] // for green cards that multiply reward by the num of a certain type of establishment owned
  readonly multiplierForRollerOwned = false // should multiplier be applied only to roller-owned cards?
  readonly extraRequirements = (roller: Player, owner: Player, game: Game)=>true
  activate(roller: Player, owner: Player, game: Game) {
    if (roller != owner) return
    if (!this.extraRequirements(roller,owner,game)) return

    if (this.multipliers.length == 0)
      owner.money += this.reward
    else if (this.multiplierForRollerOwned)
      for (let card of owner.establishments)
        if (this.multipliers.indexOf(card) != -1)
          owner.money += this.reward
    else
      for (let player of game.players)
        for (let card of player.establishments)
          if (this.multipliers.indexOf(card) != -1)
            owner.money += this.reward
  }
}

class BlueEstablishment implements Establishment {
  // copy and pasted:
  readonly name: string
  readonly description: string
  readonly activation: DiceRoll[]
  readonly cost: Money
  //
  readonly color = EstablishmentColor.Blue
  readonly reward: Money
  readonly extraRequirements = (roller: Player, owner: Player, game: Game)=>true
  activate(roller: Player, owner: Player, game: Game) {
    if (!this.extraRequirements(roller,owner,game)) return
    owner.money += this.reward
  }
}
