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

// this funciton is for user that sends invite, they can either Send invite or Cancel the sent invite
    async sentInvite(senderUserName: string,receiverUserName: string,option : UpdateArray){

        // Fetch sender's and receiver's records
       const sender = await this.contactRepository.findAndPopulate(senderUserName,[Fields.SENTINVITES]);
       const receiver = await this.contactRepository.findAndPopulate(receiverUserName,[Fields.RECEIVEDINVITES]);

       // Add/Remove receiver's id in senders sentInvites array
       await this.contactRepository.updateUserArray(sender,receiver?.id, option, Fields.SENTINVITES);
       
       // Add/Remove senders's id in receiver's receivedInvites array
       await this.contactRepository.updateUserArray(receiver,sender?.id, option, Fields.RECEIVEDINVITES);
        
        return {
            message: 'Operation Successful.'
        }
    }
    
// this funciton is for user that recieved a invite , they can either Accept invite or Decline the received invite   
    async receivedInvite(senderUserName: string,receiverUserName: string,option : UpdateArray){

        let sent : Fields[] = [Fields.SENTINVITES];
        let received = [Fields.RECEIVEDINVITES]
        if(option === UpdateArray.PUSH){
            sent.push(Fields.CONTACTS);
            received.push(Fields.CONTACTS);
        }
        
        // Fetch sender's and receiver's records
       const sender = await this.contactRepository.findAndPopulate(senderUserName,received);
       const receiver = await this.contactRepository.findAndPopulate(receiverUserName,sent);

       
       // Remove receiver's id in senders receivedInvites array
        await this.contactRepository.updateUserArray(sender,receiver?.id, UpdateArray.PULL, Fields.RECEIVEDINVITES);

       // Remove sender's id in senders sentInvites array
        await this.contactRepository.updateUserArray(receiver,sender?.id, UpdateArray.PULL, Fields.SENTINVITES);
         
        // if accept request then additionally both have to add each other's id in contacts array 
        if(option === UpdateArray.PUSH){
            await this.contactRepository.updateUserArray(sender,receiver?.id, option, Fields.CONTACTS);
            await this.contactRepository.updateUserArray(receiver,sender?.id, option, Fields.CONTACTS);
        }

        return {
            message: 'Operation Successful.'
        }
    }

// this funciton is for removing Contact
    async removeContact(senderUserName: string,receiverUserName: string){
        
        // Fetch sender's and receiver's records
        const sender = await this.contactRepository.findAndPopulate(senderUserName,[Fields.CONTACTS]);
        const receiver = await this.contactRepository.findAndPopulate(receiverUserName,[Fields.CONTACTS]);

        //  both have to remove each other's id in contacts array 
        await this.contactRepository.updateUserArray(sender,receiver?.id, UpdateArray.PULL, Fields.CONTACTS);
        await this.contactRepository.updateUserArray(receiver,sender?.id, UpdateArray.PULL, Fields.CONTACTS);
 
        return {
            message: 'Operation Successful.'
        }
    }

}
