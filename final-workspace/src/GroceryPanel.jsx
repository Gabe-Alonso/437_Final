import React from "react";
import {Spinner} from "./assets/Spinner.jsx";

const MDN_URL = "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json";

/**
 * Creates and returns a new promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms the number of milliseconds to delay
 * @returns {Promise<undefined>} a promise that resolves with the value of `undefined` after the specified delay
 */
function delayMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



export function GroceryPanel(props) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);


    const [groceryData, setGroceryData] = React.useState([]);

    async function fetchData(url) {
        console.log(url);
        setIsLoading(true);

        delayMs(2000).then(async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                console.log(data[0].name);
                setGroceryData(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setError("Failed to fetch data");
            } finally {
                setIsLoading(false);
            }
        });
        console.log("fetching data from " + url);
    }

    function handleDropdownChange(changeEvent) {
        setGroceryData([]);
        setError(null);
        if (changeEvent.target.value.length > 0) {
            fetchData(changeEvent.target.value).then();
        }
    }

    function handleAddTodoClicked(item) {
        const todoName = `Buy ${item.name} (${item.price.toFixed(2)})`;
        props.addTask(todoName);
    }

    return (
        <div>
            <h1 className="text-xl font-bold">Groceries prices today</h1>
            <div className="flex flex-row">
                <label className="mb-4 flex gap-4">
                    Get prices from:
                    <select
                        disabled={isLoading}
                        className="border border-gray-300 p-1 rounded-sm disabled:opacity-50"
                        onChange={handleDropdownChange}
                    >
                        <option value="">(None selected)</option>
                        <option value={MDN_URL}>MDN</option>
                        <option value="invalid">Who knows?</option>
                    </select>
                </label>
                {isLoading ? <Spinner className="ml-2 mt-2"/> : null}
                {error ? error : null}
            </div>

            {groceryData.length > 0 ? (
                <PriceTable items={groceryData} onAddClicked={handleAddTodoClicked}/>
            ) : (
                "No data"
            )}
        </div>
    );


}

function PriceTable(props) {
    return (
        <table className="mt-4">
            <thead>
            <tr>
                <th className="text-left">Name</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {
                props.items.map(item =>
                    <PriceTableRow
                        key={item.name}
                        item={item}
                        onAddClicked={() => props.onAddClicked(item)}
                    />
                )
            }
            </tbody>
        </table>
    );
}

function PriceTableRow({item, onAddClicked}) {
    const buttonClasses = `italic px-2 rounded-sm border border-gray-300
        hover:bg-gray-100 active:bg-gray-200 cursor-pointer`;
    return (
        <tr>
            <td>{item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>
                <button className={buttonClasses} onClick={onAddClicked}>
                    Add to todos
                </button>
            </td>
        </tr>
    );
}

