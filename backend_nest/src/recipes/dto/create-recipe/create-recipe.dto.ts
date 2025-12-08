import { IsString, IsNumber } from "class-validator";

export class CreateRecipeDto {
  @IsString()
  readonly name: string;
  
  @IsString()
  readonly description: string;

  @IsString()
  readonly image: string;

  @IsNumber()
  readonly cookTime: number;

  @IsString()
  readonly difficulty: string;
  @IsNumber()
  readonly servings: number;

  @IsString()
  readonly category: string;

  @IsString({ each: true })
  readonly ingredients: string[];

  @IsString({ each: true })
  readonly instructions: string[];
}
