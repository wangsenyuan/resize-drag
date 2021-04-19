import React from 'react'
import {grid, viewBox} from '../../state'
import {useRecoilValue} from "recoil";

const rootContainerId = -1

function createHorizontalLines(width) {
    return (arr, height) => {
        if (arr.length === 0) {
            return [{x1: 0, x2: width, y1: height, y2: height}]
        }
        let prev = arr[arr.length - 1]
        return [...arr, {x1: 0, x2: width, y1: prev.height + height, y2: prev.height + height}]
    }
}

function HorizontalLines({rows, width}) {
    let lines = rows.reduce([], createHorizontalLines(width))

    return <>
        {lines.map((cur, i) => <line {...cur} stroke="black" key={i} strokeWidth="1px"
                                     shapeRendering="optimizeSpeed"/>)}
    </>
}

function createVerticalLines(height) {
    return (arr, width) => {
        if (arr.length === 0) {
            return [{x1: width, x2: width, y1: 0, y2: height}]
        }
        let prev = arr[arr.length - 1]
        return [...arr, {
            x1: width + prev.width,
            x2: width + prev.width,
            y1: 0,
            y2: height
        }]
    }
}

function VerticalLines({columns, height}) {
    let lines = columns.reduce([], createVerticalLines(height))

    return <>
        {lines.map((cur, i) => <line {...cur} stroke="black" key={i} strokeWidth="1px"
                                     shapeRendering="optimizeSpeed"/>)}
    </>
}

function Page() {
    const grid = useRecoilValue(grid(rootContainerId))
    const viewBox = useRecoilValue(viewBox)
    return <div>
        <HorizontalLines rows={grid.rows} width={viewBox.width}/>
        <VerticalLines columns={grid.columns} height={viewBox.height}/>
    </div>
}

export default Page