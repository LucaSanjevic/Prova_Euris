export interface Product {
    id?: string;
    title: string
    category: string
    price: number
    employee: string
    description: string
    reviews: string[]
}

export interface Store {
    name: string
    category: string
    employees: string[]
}

export interface StatsCategories {
    numberOfProducts: number
    category: string
}