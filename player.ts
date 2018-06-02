interface Player {
  name: string
  money: Money
  establishments: Establishment[]
  landmarks: Landmark[]
  checkIfRollTwoDice(): boolean
  takeTurn()
}
