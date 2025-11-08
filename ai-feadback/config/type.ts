export interface ChatlogProps{
    chat_id: string;
    user_id: string;
    chatlog: any; // JSON形式で保存
    created_at: string;
}

export interface UserProps{
    user_id: string;
    user_name: string;
    password: string;
    character_id: number;
}

export interface UserData{
    user_id: string;
    character_id: number;
    user_name: string;
}
