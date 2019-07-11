import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  startAddExpense, 
  addExpense, 
  editExpense, 
  removeExpense, 
  setExpenses, 
  startSetExpenses,
  startRemoveExpense,
  startEditExpense
} from '../../actions/expenses';
import expenses from '../fixtures.js/expenses';
import database from '../../firebase/firebase'

const uid ='testUID';
const authState = {auth: {uid}};
const createMockStore = configureMockStore([thunk]);

beforeEach((done)=> {
  const expensesData = {};
  expenses.forEach(({id, description, note, amount, createdAt}) => {
    expensesData[id] = {description, note, amount, createdAt};
  });
  database.ref(`users/${uid}/expenses`).set(expensesData).then(()=>done());
});

test('should setup remove expense action object', () => {
    const action = removeExpense({id: '123abc'});
    expect(action).toEqual({
        type: 'REMOVE_EXPENSE',
        id: '123abc'
    });
});

test('should remove expense from firebase', (done) => {
  const store = createMockStore({ auth: {uid}}); //ensures when ran, it will have all necessary info
  const id = expenses[2].id;
  store.dispatch(startRemoveExpense({id})).then(()=> {
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'REMOVE_EXPENSE',
      id
    });
    return database.ref(`users/${uid}/expenses/${id}`).once('value');
  }).then((snapshot)=>{
    expect(snapshot.val()).toBeFalsy();
    done();
  });
 
});

test('Should setup edit expense action', () => {
    const action = editExpense('123abc', { note: 'banks'});
    expect(action).toEqual({
        type: 'EDIT_EXPENSE',
        id: '123abc',
        updates: {
            note: 'banks'
        }
    });
});

test('should edit expense from firebase', (done) => {
  const store = createMockStore(authState);
  const id = expenses[0].id;
  const updates = {
    amount: 200
  };
  store.dispatch(startEditExpense(id, updates)).then(() => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'EDIT_EXPENSE',
      id,
      updates
    });
    return database.ref(`users/${uid}/expenses/${id}`).once('value');
  }).then((snapshot) => {
    expect(snapshot.val().amount).toBe(updates.amount);
    done();
  });
});

test('Should setup add expense action', () => {
    const action = addExpense(expenses[2]);
    expect(action).toEqual({
       type: 'ADD_EXPENSE',
       expense: expenses[2] 
    });
});

test('should add expense to database and store', (done) => {
    const store = createMockStore(authState);
    const expenseData = {
      description: 'Mouse',
      amount: 3000,
      notes: 'This one is better',
      createdAt: 1000
    };
  
    store.dispatch(startAddExpense(expenseData)).then(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: 'ADD_EXPENSE',
        expense: {
          id: expect.any(String),
          ...expenseData
        }
      });
  
      return database.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value');
    }).then((snapshot) => {
      expect(snapshot.val()).toEqual(expenseData);
      done();
    });
  });
  

test('Should add expense with defaults to database store', (done) => {
    const store = createMockStore(authState);
    const expenseDefaults = {
      description: '',
      amount: 0,
      notes: '',
      createdAt: 0
    };
  
    store.dispatch(startAddExpense({})).then(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: 'ADD_EXPENSE',
        expense: {
          id: expect.any(String),
          ...expenseDefaults
        }
      });
  
      return database.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value');
    }).then((snapshot) => {
      expect(snapshot.val()).toEqual(expenseDefaults);
      done();
    });
});

test('should setup set expense action object with data', () => {
  const action = setExpenses(expenses);
  expect(action).toEqual({
    type: 'SET_EXPENSES',
    expenses
  });
});

test('shhould fetch expenses from firebase', (done) => {
  const store = createMockStore(authState);
  store.dispatch(startSetExpenses()).then(()=>{
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'SET_EXPENSES',
      expenses
    });
    done();
  });
})

 