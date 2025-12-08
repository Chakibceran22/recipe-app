import { IsUUID } from "class-validator";

export class RecomendRecipeDto {
    @IsUUID()
    id: string;
}
