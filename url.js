// const sqlite3 = require('sqlite3').verbose();

var db3 = new sqlite3.Database('/Users/mymac/Desktop/DesktopApplication/Desktop_Application/Browser/api/tmp/db.sqlite3');
let newRowCounter2 = 0;
let optionValues2 = [];
// module.exports = optionValues2;


function fetchDataAndCompare2() {
  db3.all('SELECT * FROM tbl_events', (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    // check for new rows
    const tableBody2 = document.querySelector('#myTable tbody');
    const existingRows2 = tableBody2.querySelectorAll('tr');
    const existingData2 = Array.from(existingRows2).map(row2 => ({
      id: parseInt(row2.id.split('-')[1]), // Extract the id from the tr's id attribute
      timestamp: row2.cells[0].textContent,
      name: row2.cells[2].textContent,
      url: row2.cells[3].textContent
    }));

    const newData2 = rows.filter(row2 => !existingData2.some(data2 => data2.id === row2.id));
    console.log(newData2)

    // generate HTML code for new rows
    const newRows2 = newData2.map(row2 => `
      <tr id="tab-${row2.id}" class="tab">
        <td>${row2.created_at}</td>
        <td>Chrome</td>
        <td>${row2.name}</td>
        <td>${row2.tab_name}</td>
        <td>
          <select id="mySelect" value="${row2.value}" onchange="saveOption2(event)" dataid="${row2.id}">
            <option></option>
            <option value="work" ${row2.value === 'work' ? 'selected' : ''}>work</option>
            <option value="leasure" ${row2.value === 'leasure' ? 'selected' : ''}>leasure</option>
            <option value="learning" ${row2.value === 'learning' ? 'selected' : ''}>learning</option>
          </select>
        </td>
        </tr>
        `);
    
        if (newRows2.length > 0) {
          tableBody2.insertAdjacentHTML('beforeend', newRows2.join(''));
          newRowCounter2 += newRows2.length;
          optionValues2.push(...newData2.map(row2 => row2.value));
    
          updateRowColors2();
    
          // Check if 10 new rows have been added and their select options have values
          if (newRowCounter2 >= 1) {
            if (optionValues2.every(value => value !== '')) {
              ipcRenderer.send('not-new-rows-added');

            }else {
              ipcRenderer.send('new-rows-added');

            }
            newRowCounter2 = 0;
            optionValues2.length = 0;
          }
        }
    
      });
    
      function updateRowColors2() {
        const allSelects = document.querySelectorAll('#mySelect');
    
        allSelects.forEach(selectElement => {
          const selectedValue = selectElement.value;
          const tableRow = selectElement.closest('tr');
          if (selectedValue === '') {
            tableRow.style.backgroundColor = 'lightgray';
          } else {
            tableRow.style.backgroundColor = 'transparent';
          }
        });
      }
    
    }
    
    setInterval(fetchDataAndCompare2, 6000);
    
