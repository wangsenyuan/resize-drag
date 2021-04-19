import React from 'react'
import {atom, atomFamily, selector, selectorFamily, noWait} from "recoil";


// 拖入Editor的组件是atom（通过atomFamily构建），
// 选中id，通过selectorFamily传递给其他组件；
// 拖入的时候直接保存到后端，产生新的id；


export const selectedControlId = atom({
    key: "atom/selectedControlId",
    default: -1
})

export const currentControl = selector({
    key: "selector/currentControl",
    get: ({get}) => {
        const id = get(selectedControlId)
        if (id < 0) {
            return {}
        }
        return get(control(id));
    },
    set: ({set, get}, newValue) => {
        set(control(get(selectedControlId)), prev => Object.assign({}, prev, newValue))
    }
})

async function getControl(id) {
    return new Promise(resolve => {
        let container = {
            rows: Array(100).fill(60),
            columns: Array(26).fill(100)
        }
        setTimeout(() => resolve(container), 1000)
    })
}

export const control = selectorFamily({
    key: "atom/control",
    default: (id) => async () => {
        let container = await getControl(id)
        return container
    }
})


export const grid = selectorFamily({
    key: "selector/grid",
    get: containerId => ({get}) => {
        // containerId should be -1
        let loadable = get(noWait(control(containerId)))
        return {
            hasValue: {data: loadable.contents},
            hasError: {error: loadable.contents},
            loading: {data: 'placeholder while loading'},
        }[loadable.state];
    }
})

export const viewBox = atom({
    key: "atom/viewBox",
    default: {width: 2000, height: 2000}
})