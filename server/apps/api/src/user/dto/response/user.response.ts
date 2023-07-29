import { User } from '../../database/model/user.model';
export class SearchUserResponse {
    search: string; 

    constructor(partial : Partial<SearchUserResponse>){
        Object.assign(this,partial);
    }
}