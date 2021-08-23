export interface MundoAPI_ProfileResponse {
    rp: number
    experience: number[]
    free_remain_time: number
    grid_rewards: GridReward[]
    pass_setting: PassSetting
    is_first_free_draw: boolean
    single_cost: number
    multi_cost: number
    multi_draw_count: number
    free_draw_switcher: number
    max_level: number
    uid: number
    tokens: number
    level: number
    is_first_use_pass: boolean
    is_skip_single_draw: boolean
    is_skip_multi_draw: boolean
}

export interface GridReward {
    id: number
    name: string
    image: string
    point: number
    is_special: boolean
}

export interface PassSetting {
    basic: Basic
    pro: Pro
}

export interface Basic {
    pass_id: number
    unlock_rp_cost: number
    expectation: number
    is_unlocked: number
    detail: Detail[]
}

export interface Detail {
    level: number
    is_claimed: boolean
    is_special: boolean
    rewards: Reward[]
}

export interface Reward {
    id: number
    name: string
    image: string
    point: number
}

export interface Pro {
    pass_id: number
    unlock_rp_cost: number
    expectation: number
    is_unlocked: number
    detail: Detail2[]
}

export interface Detail2 {
    level: number
    is_claimed: boolean
    is_special: boolean
    rewards: Reward2[]
}

export interface Reward2 {
    id: number
    name: string
    image: string
    point: number
}
