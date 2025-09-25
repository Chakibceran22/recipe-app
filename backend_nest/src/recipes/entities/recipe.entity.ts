import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('recipes')
export class Recipe {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    title: string

    @Column()
    description:string

    @Column()
    image:string

    @Column()
    cookTime:number

    @Column()
    difficulty:string

    @Column()
    servings :number

    @Column()
    category :string

    @Column("text", { array: true })
    ingredients: string[]

    @Column("text", { array: true })
    instructions: string[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt : Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt : Date
}