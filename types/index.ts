export interface SJTOption {
  label: string
  text: string
  tags: string[]
}

export interface UserInfo {
  age: number
  affiliation: string
}

export interface ScenarioAnswer {
  sjtRatings: number[] // [A, B, C, D] each 1-5
  attributions: number[] // [Q1, Q2, Q3] each 1-7
}

export interface Layer2Answers {
  axisA: number[]
  axisB: number[]
  axisC: number[]
}

export type Zone = 'Green' | 'Yellow' | 'Red'

export interface Scores {
  OS: number
  A: number
  B: number
  C: number
  zone: Zone
}

export interface DiagnosisSession {
  userInfo: UserInfo
  scenarioAnswers: ScenarioAnswer[]
  layer2Answers?: Layer2Answers
  scores: Scores
}
