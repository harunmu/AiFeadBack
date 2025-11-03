export interface ChatlogProps{
    chat_id: string;
    user_id: string;
    chatlog: any; // JSON形式で保存
}

export interface UserProps{
    user_name: string;
    password: string;
    character_id: number;
}
