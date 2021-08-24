export interface MundoAPI_DiceResponse {
    rp: number
    tokens: number
    experience: number[]
    level: number
    free_remain_time: number
    receive_rewards: ReceiveReward[]
    grid_rewards: any[]
}

export interface ReceiveReward {
    id: number
    name: string
    image: string
    point: number
}
