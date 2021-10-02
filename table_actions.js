let newRowInner1 = `<td>
                        <input onchange="setInputLimit(this, -100, 100)" class="x-input"/>
                    </td>
                    <td>
                        <input onchange="setInputLimit(this, -100, 100)" class="y-input"/>
                    </td>
                    <td>
                        <button onclick="deleteRow(this)">Delete</button>
                    </td>`

let newRowInner2 = `<td>
                        <input onchange="setInputLimit(this, -100, 100)" class="x-input"/>
                    </td>
                    <td>
                        <input onchange="setInputLimit(this, -100, 100)" class="y-input"/>
                    </td>`

function addNewRow(bottomTableBtn, innerTemplate = newRowInner1) {

    let addBeforeTarget = bottomTableBtn.closest('tr');
    let newRow = document.createElement('tr');
        newRow.classList.add('input-row');
        newRow.innerHTML = innerTemplate;

    addBeforeTarget.before(newRow);
}

function addNewRows(bottomTableBtn, innerTemplate, count) {

    for (let i = 0; i < count; i++) {

        addNewRow(bottomTableBtn, innerTemplate);
    }
}

function deleteRow(deleteBtn) {

    let rowsCount = getTableRowsCount(deleteBtn.closest('table'));

    if (rowsCount > 1) {
        deleteBtn.closest('tr').remove();
    }
}

function deleteRows(table, count) {

    let rows = getTableRowsCount(table, true);

    for (let i = 0; i < count ; i++) {

        rows[count - i].remove();
    }
}

function calculate(bottomTableBtn) {

    let tableSection = bottomTableBtn.closest('.tables-section');
    let firstTable = tableSection.querySelector('.first-table');
    let secondTable = tableSection.querySelector('.second-table');
    let thirdTable = tableSection.querySelector('.third-table');

    let rowsToAdd = getLessRowsCount(firstTable, secondTable) - getTableRowsCount(thirdTable);

    if (rowsToAdd > 0) {
        addNewRows(bottomTableBtn, newRowInner2, rowsToAdd);
    } else if (rowsToAdd < 0) {
        deleteRows(thirdTable, Math.abs(rowsToAdd));
    }

    let thirdTableRowsCount = getTableRowsCount(thirdTable);

    for (let i = 2; i < thirdTableRowsCount + 2; i++) {

        let firstX = firstTable.querySelector(`.input-row:nth-child(${i}) .x-input`);
        let secondX = secondTable.querySelector(`.input-row:nth-child(${i}) .x-input`);
        let thirdX = thirdTable.querySelector(`.input-row:nth-child(${i}) .x-input`);

        let firstY = firstTable.querySelector(`.input-row:nth-child(${i}) .y-input`);
        let secondY = secondTable.querySelector(`.input-row:nth-child(${i}) .y-input`);
        let thirdY = thirdTable.querySelector(`.input-row:nth-child(${i}) .y-input`);

        thirdX.value = '';
        thirdY.value = '';

        thirdX.value = (Number(firstX.value) + Number(secondX.value)) / 2;
        thirdY.value = (Number(firstY.value) + Number(secondY.value)) / 2;
    }

    drawGraph(firstTable.closest('.table-box').querySelector('.graph'), getCoordinates(firstTable), true);
    drawGraph(secondTable.closest('.table-box').querySelector('.graph'), getCoordinates(secondTable), true);
    drawGraph(thirdTable.closest('.table-box').querySelector('.graph'), getCoordinates(thirdTable), true);
}

// Returns the smallest number of rows from the entered tables
function getLessRowsCount(...tables) {

    let result;

    for (const table of tables) {

        if (result === undefined) {
            result = getTableRowsCount(table);
        } else if (result > getTableRowsCount(table)) {
            result = getTableRowsCount(table);
        }
    }

    return result;
}

function getTableRowsCount(table, elems = false) {

    let rows = table.querySelectorAll('.input-row');

    if (elems) {
        return rows;
    } else {
        return rows.length;
    }
}

function getCoordinates(table) {

    let x;
    let y;
    let result = [];
    let toPush = [];

    for (const row of getTableRowsCount(table,true)) {

        x = row.querySelector('.x-input').value;
        y = row.querySelector('.y-input').value

        x === '' ? x = 0 : x;
        y === '' ? y = 0 : y;

        toPush = [x, y];
        result.push(toPush);
    }

    return result;
}

function setInputLimit(input, min, max) {

    isNaN(Number(input.value)) ? input.value = 0 : input.value;
    input.value < min ? input.value = min : input.value;
    input.value > max ? input.value = max : input.value;
}