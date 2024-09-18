import { useEffect, useState } from "react";
import "./App.css";
function generateGrid() {
    let grid = [];
    for (let i = 0; i < 8; i++) {
        let row = [];
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 == 0) row.push("white");
            else row.push("black");
        }
        grid.push(row);
    }
    return grid;
}

function generateElephant() {
    let row = Math.floor(Math.random() * 8);
    let col = Math.floor(Math.random() * 8);
    return [row, col];
}
function generateCamel(elephant) {
    let row, col;

    // Keep generating new positions for camel until they don't overlap with the elephant
    do {
        row = Math.floor(Math.random() * 8);
        col = Math.floor(Math.random() * 8);
    } while (row === elephant[0] && col === elephant[1]);

    return [row, col];
}

function generateDiagonals(n, x, y) {
    const points = [];

    // Add current position
    points.push([x, y]);

    // Calculate possible points in top left direction
    for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
        points.push([i, j]);
    }

    // Calculate possible points in top right direction
    for (let i = x - 1, j = y + 1; i >= 0 && j < n; i--, j++) {
        points.push([i, j]);
    }

    // Calculate possible points in bottom left direction
    for (let i = x + 1, j = y - 1; i < n && j >= 0; i++, j--) {
        points.push([i, j]);
    }

    // Calculate possible points in bottom right direction
    for (let i = x + 1, j = y + 1; i < n && j < n; i++, j++) {
        points.push([i, j]);
    }

    // Sort the points in lexicographical order
    points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    // Remove duplicates
    const uniquePoints = [];
    for (const point of points) {
        if (!uniquePoints.some((p) => p[0] === point[0] && p[1] === point[1])) {
            uniquePoints.push(point);
        }
    }
    return uniquePoints;
}
export default function App() {
    const [board, setBoard] = useState(generateGrid() || []);
    const [elephant, setElephant] = useState(generateElephant() || []);
    console.log("elephant: ", elephant);
    const [camel, setCamel] = useState(generateCamel(elephant) || []);
    console.log("camel: ", camel);
    const [diagonals, setDiagonals] = useState([]);
    // console.log("diagonals: ", diagonals);

    useEffect(() => {
        const diagonals = generateDiagonals(8, camel[0], camel[1]);
        setDiagonals(diagonals);
    }, [camel]);

    const findPoint = (i, j) => {
        return diagonals.some((point) => point[0] === i && point[1] === j);
    };
    return (
        <div className="max-w-xl mx-auto mt-20">
            {board?.map((row, i) => {
                return (
                    <div key={i} className="flex item-center flex-col ">
                        <div className="flex items-center">
                            {row?.map((item, j) => {
                                return (
                                    <div
                                        key={j}
                                        className={`${
                                            (i === elephant[0] ||
                                                j === elephant[1]) &&
                                            findPoint(i, j)
                                                ? "bg-red-600"
                                                : i === elephant[0] ||
                                                  j === elephant[1]
                                                ? "bg-yellow-700"
                                                : findPoint(i, j)
                                                ? "bg-blue-600"
                                                : ""
                                        } ${
                                            // if overlapping
                                            ""
                                        } w-16 h-16 border border-black`}
                                    >
                                        {j === elephant[1] && i === elephant[0]
                                            ? "Ele"
                                            : j === camel[1] && i === camel[0]
                                            ? "Camel"
                                            : ""}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            <div>
                <button
                    className="border p-1"
                    onClick={() => {
                        setElephant(generateElephant());
                        setCamel(generateCamel());
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
