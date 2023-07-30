import { Injectable } from '@nestjs/common';
import { ContactRepository } from './database/repository/contact.repository';

export enum UpdateArray{
    PUSH = 'push',
    PULL = 'pull' 
}

export enum Fields{
    CONTACTS = 'contacts',
    SENTINVITES = 'sentInvites',
    RECEIVEDINVITES = 'receivedInvites'

}


@Injectable()
export class ContactService {
    constructor(private readonly contactRepository : ContactRepository){}

    async sentInvite(username1: string,username2: string,option : UpdateArray){

       const user1 = await this.contactRepository.findAndPopulate(username1,[Fields.SENTINVITES]);
       const user2 = await this.contactRepository.findAndPopulate(username2,[Fields.RECEIVEDINVITES]);

       await this.contactRepository.updateUserArray(user1,user2?.id, option, Fields.SENTINVITES);
       await this.contactRepository.updateUserArray(user2,user1?.id, option, Fields.RECEIVEDINVITES);
        
        return {
            message: 'Operation Successful.'
        }
    }
    
    
    async receivedInvite(username1: string,username2: string,option : UpdateArray){

        let sent : Fields[] = [Fields.SENTINVITES];
        let received = [Fields.RECEIVEDINVITES]
        if(option === UpdateArray.PUSH){
            sent.push(Fields.CONTACTS);
            received.push(Fields.CONTACTS);
        }
        
       const user1 = await this.contactRepository.findAndPopulate(username1,received);
       const user2 = await this.contactRepository.findAndPopulate(username2,sent);

        await this.contactRepository.updateUserArray(user1,user2?.id, UpdateArray.PULL, Fields.RECEIVEDINVITES);
        await this.contactRepository.updateUserArray(user2,user1?.id, UpdateArray.PULL, Fields.SENTINVITES);
         
        if(option === UpdateArray.PUSH){
            await this.contactRepository.updateUserArray(user1,user2?.id, option, Fields.CONTACTS);
            await this.contactRepository.updateUserArray(user2,user1?.id, option, Fields.CONTACTS);
        }

        return {
            message: 'Operation Successful.'
        }
    }

    async removeContact(username1: string,username2: string){
        const user1 = await this.contactRepository.findAndPopulate(username1,[Fields.CONTACTS]);
        const user2 = await this.contactRepository.findAndPopulate(username2,[Fields.CONTACTS]);

        await this.contactRepository.updateUserArray(user1,user2?.id, UpdateArray.PULL, Fields.CONTACTS);
        await this.contactRepository.updateUserArray(user2,user1?.id, UpdateArray.PULL, Fields.CONTACTS);
 
        return {
            message: 'Operation Successful.'
        }
    }

}
