import { ReactNode } from 'react'

export interface NestedRoute {
    path: string
    children?: Array<NestedRoute>
}

type MenuType = 'menu' | 'subMenu'

export interface MenuRoute extends NestedRoute {
    // path: string
    name?: string
    children?: MenuRoute[] | undefined
    title?: string
    icon?: string | ReactNode
    type?: MenuType

    [key: string]: any
}
