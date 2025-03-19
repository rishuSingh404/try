import * as SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'history.db', location: 'default' });

export function createTable() {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS History (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prediction TEXT,
        solution TEXT,
        imageUri TEXT
      );`
    );
  });
}

export function insertHistory(prediction, solution, imageUri) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO History (prediction, solution, imageUri) VALUES (?, ?, ?);',
      [prediction, solution, imageUri],
      (txObj, resultSet) => {
        console.log('History inserted:', resultSet.insertId);
      },
      (txObj, error) => {
        console.log('Error inserting history:', error);
      }
    );
  });
}

export function getHistory() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM History;',
        [],
        (txObj, { rows: { _array } }) => {
          resolve(_array);
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
}

// Call createTable once, e.g. in App.js or index.js
createTable();
