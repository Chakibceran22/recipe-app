import { registerAs } from "@nestjs/config"

export default registerAs('recipes', () => ({
    coffeeApiKey: "the api key that would be in the env ",
    coffeeApiUrl: "The Url that would be i the env",
}))