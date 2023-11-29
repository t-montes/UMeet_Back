import { UserEntity } from "src/user/user.entity";

export class NotificationDto {
    readonly id: string;
    readonly text: string;
    readonly date: Date;
    readonly redirection: string;
    readonly user: UserEntity;
}
