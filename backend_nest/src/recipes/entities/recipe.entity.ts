import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Difficulty } from "./difficulty.entity";

@Entity('recipes')
export class Recipe {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string

    @Column()
    description:string
    
    @Column({default : 0})
    recomendations: number

    @Column()
    image:string

    @Column()
    cookTime:number

    @JoinTable()
    @ManyToOne(() => Difficulty, (difficulty) => difficulty.recipes, {
        cascade: true,
        eager: true
    })
    difficulty:Difficulty

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