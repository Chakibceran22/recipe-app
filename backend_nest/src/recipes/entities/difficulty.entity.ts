import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('difficulties')
export class Difficulty {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    level: string;

    @OneToMany(() => Recipe, (recipe) => recipe.difficulty)
    recipes : Recipe[]
    
}