export interface User {
  username: string,
  password: string,
  confirmPassword: string
}

export interface UpdateStatus {
  roomID: string,
  userID: string,
  messageID: string[],
  prevStatus: string,
  crntStatus: string,
}




export interface SectionStatus {
  contacts: number,
  sentInv: number,
  receivedInv: number
}
