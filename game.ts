class Game {
  private deck: Establishment[] //TODO: randomize + initialize this
  private _marketplace: Establishment[]
  get marketplace(): Establishment[] { return this._marketplace.slice() }
  readonly players: Player[]

  private getWinner(): Player {return null} //TODO

  private fillMarketplace() {
    let marketplaceSize = this._marketplace.length //if size is already enough, don't add any more cards
    for (let i = 0; i < this._marketplace.length; i++)
      for (let j = 0; j < i; j++)
        if (this._marketplace[i] == this._marketplace[j]) {
          marketplaceSize--
          break
        }
    if (marketplaceSize >= 10) return

    this._marketplace.push(this.deck[0]) //add top card of deck onto marketplace
    this.deck.splice(0,1)

    this.fillMarketplace() //repeat until marketplace has enough cards
  }

  buyEstablishment(num: number, player: Player) {
    if (num%1 != 0 || num >= this._marketplace.length || num < 0) return //check if num is a valid array element
    let card = this._marketplace[num]
    if (player.money < card.cost) return
    player.money -= card.cost
    player.establishments.push(card)
    this._marketplace.splice(num,1)
  }

  run() {
    //players take their turns until one winner is found
    for (let turn = 0; this.getWinner() == null; turn = (turn+1)%this.players.length) {
      let playerGoing = this.players[turn]

      let diceRoll: DiceRoll = Math.ceil(Math.random()*6)
      diceRoll += playerGoing.checkIfRollTwoDice() ? Math.ceil(Math.random()*6) : 0

      //activate all establishments that match the dice roll in order of color
      for (let color = EstablishmentColor.Red; color <= EstablishmentColor.Purple; color++)
        for (let playerNum = 0; playerNum < this.players.length; playerNum++) {
          //player who's going's cards are activated first, then the player who's next, then the player after that, etc
          let player = this.players[(turn+playerNum)%this.players.length]
          for (let establishment of player.establishments)
            if (establishment.color == color && establishment.activation.indexOf(diceRoll) != -1)
              establishment.activate(playerGoing,player,this)
        }

      //give them a pity coin if they have nothing; money should never be less than 0 but just in case we deal with that too
      if (playerGoing.money <= 0) playerGoing.money = 1

      playerGoing.takeTurn() //let them buy things etc
    }
  }
}
