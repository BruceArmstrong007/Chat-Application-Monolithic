import { Injectable } from '@nestjs/common';
import { ContactRepository } from './database/repository/contact.repository';
import { Fields, UpdateArray } from '@app/common';
import { ChatRepository } from '../chat/database/repository/chat.repository';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly chatRepository: ChatRepository,
  ) {}

  // this funciton is for user that sends invite, they can either Send invite or Cancel the sent invite
  async sentInvite(
    senderUserName: string,
    receiverUserName: string,
    option: UpdateArray,
  ) {
    // Fetch sender's and receiver's records
    const sender = await this.contactRepository.findAndPopulate(
      senderUserName,
      [Fields.SENTINVITES],
    );
    const receiver = await this.contactRepository.findAndPopulate(
      receiverUserName,
      [Fields.RECEIVEDINVITES],
    );

    // Add/Remove receiver's id in senders sentInvites array
    await this.contactRepository.updateUserArray(
      sender,
      receiver?.id,
      option,
      Fields.SENTINVITES,
    );

    // Add/Remove senders's id in receiver's receivedInvites array
    await this.contactRepository.updateUserArray(
      receiver,
      sender?.id,
      option,
      Fields.RECEIVEDINVITES,
    );

    // Notify users
    await this.chatRepository.publish(
      'contact',
      JSON.stringify({
        type: 'contact',
        data: {
          option: UpdateArray.PUSH === option ? 'sent-invite' : 'cancel-invite',
          senderID: sender?._id,
          receiverID: receiver?._id,
          sender: sender?.name,
          receiver: receiver?.name,
        },
      }),
    );

    return {
      message: 'Operation Successful.',
    };
  }

  // this funciton is for user that recieved a invite , they can either Accept invite or Decline the received invite
  async receivedInvite(
    senderUserName: string,
    receiverUserName: string,
    option: UpdateArray,
  ) {
    const sent: Fields[] = [Fields.SENTINVITES];
    const received = [Fields.RECEIVEDINVITES];
    if (option === UpdateArray.PUSH) {
      sent.push(Fields.CONTACTS);
      received.push(Fields.CONTACTS);
    }

    // Fetch sender's and receiver's records
    const sender = await this.contactRepository.findAndPopulate(
      senderUserName,
      received,
    );
    const receiver = await this.contactRepository.findAndPopulate(
      receiverUserName,
      sent,
    );

    // Remove receiver's id in senders receivedInvites array
    await this.contactRepository.updateUserArray(
      sender,
      receiver?.id,
      UpdateArray.PULL,
      Fields.RECEIVEDINVITES,
    );

    // Remove sender's id in senders sentInvites array
    await this.contactRepository.updateUserArray(
      receiver,
      sender?.id,
      UpdateArray.PULL,
      Fields.SENTINVITES,
    );

    // if accept request then additionally both have to add each other's id in contacts array
    if (option === UpdateArray.PUSH) {
      await this.contactRepository.updateUserArray(
        sender,
        receiver?.id,
        option,
        Fields.CONTACTS,
      );
      await this.contactRepository.updateUserArray(
        receiver,
        sender?.id,
        option,
        Fields.CONTACTS,
      );
    }

    // Notify users
    await this.chatRepository.publish(
      'contact',
      JSON.stringify({
        type: 'contact',
        data: {
          option: UpdateArray.PUSH === option ? 'accept-invite' : 'decline-invite',
          senderID: sender?._id,
          receiverID: receiver?._id,
          sender: sender?.name,
          receiver: receiver?.name,
        },
      }),
    );

    return {
      message: 'Operation Successful.',
    };
  }

  // this funciton is for removing Contact
  async removeContact(senderUserName: string, receiverUserName: string) {
    // Fetch sender's and receiver's records
    const sender = await this.contactRepository.findAndPopulate(
      senderUserName,
      [Fields.CONTACTS],
    );
    const receiver = await this.contactRepository.findAndPopulate(
      receiverUserName,
      [Fields.CONTACTS],
    );

    //  both have to remove each other's id in contacts array
    await this.contactRepository.updateUserArray(
      sender,
      receiver?.id,
      UpdateArray.PULL,
      Fields.CONTACTS,
    );
    await this.contactRepository.updateUserArray(
      receiver,
      sender?.id,
      UpdateArray.PULL,
      Fields.CONTACTS,
    );

    // Notify users
    await this.chatRepository.publish(
      'contact',
      JSON.stringify({
        type: 'contact',
        data: {
          option: 'remove-contact',
          senderID: sender?._id,
          receiverID: receiver?._id,
          sender: sender?.name,
          receiver: receiver?.name,
        },
      }),
    );

    return {
      message: 'Operation Successful.',
    };
  }
}
