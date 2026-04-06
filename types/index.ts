export interface UserInfo {
  age: number
  affiliation: string
}

export interface ScenarioAnswer {
  scenarioId: number
  attributions: number[] // [Q1, Q2, Q3]
}

export interface DiagnosisScores {
  SE: number
  PE: number
  OS: number
  ES: number
}

export interface DeepAnalysis {
  autonomousMotivation: number
  consistencyOfInterest: number
}

export interface DiagnosisSession {
  userInfo: UserInfo
  scenarioAnswers: ScenarioAnswer[]
  layer2Answers?: number[]
  scores: DiagnosisScores
}
