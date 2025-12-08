import { RecipeDifficulty } from "../generated/prisma";


export function mapDifficultyToEnum(difficulty: string): RecipeDifficulty {
    difficulty = difficulty.toLowerCase();
    const mapping: Record<string, RecipeDifficulty> = {
        'easy': RecipeDifficulty.EASY,
        'medium': RecipeDifficulty.MEDIUM,
        'hard': RecipeDifficulty.HARD
    };
    
    return mapping[difficulty] || RecipeDifficulty.EASY;

}

