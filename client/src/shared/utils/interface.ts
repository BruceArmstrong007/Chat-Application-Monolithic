export interface User {
  username: string,
  password: string,
  confirmPassword: string
}


export interface Message{
  messageID: string;
  senderID: string;
  receiverID: string;
  timestamp: string;
  content: string;
  status: string;
  actions: string;
  type: string;
}
