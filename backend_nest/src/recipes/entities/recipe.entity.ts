export class Recipe {
    id: string;
    title: string
    description:string
    image:string
    cookTime:number
    difficulty:string
    servings :number
    category :string
    ingredients: string[]
    instructions: string[]
    createdAt : Date
    updatedAt : Date
}