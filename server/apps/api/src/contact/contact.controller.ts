import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser, UpdateArray } from '@app/common';
import { User } from '../user/database/model/user.model';
import { ContactService } from './contact.service';
import { ContactRequest } from './dto/request/contact.request';

@UseGuards(JwtAuthGuard)
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService){}

    @Post('send-invite')
    async sendRequest(@CurrentUser() user : User, @Body() request : ContactRequest){
        return await this.contactService.sentInvite(user?.username,request?.username,UpdateArray.PUSH);
    }

    @Post('cancel-invite')
    async cancelRequest(@CurrentUser() user : User, @Body() request : ContactRequest){
        return await this.contactService.sentInvite(user?.username,request?.username,UpdateArray.PULL);
    }

    @Post('accept-invite')
    async acceptRequest(@CurrentUser() user : User, @Body() request : ContactRequest){
        return await this.contactService.receivedInvite(user?.username,request?.username,UpdateArray.PUSH);
    }

    @Post('decline-invite')
    async declineRequest(@CurrentUser() user : User, @Body() request : ContactRequest){
        return await this.contactService.receivedInvite(user?.username,request?.username,UpdateArray.PULL);
    }

    @Post('remove-contact')
    async removeContact(@CurrentUser() user : User, @Body() request : ContactRequest){
        return await this.contactService.removeContact(user?.username,request?.username);
    }    
}
