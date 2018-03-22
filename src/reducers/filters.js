import moment from 'moment';

// Filters Reducer

const filterReducerDefaultState = {
    text: '',
    sortBy: 'date', //by date or amount
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month')
};
export default (state = filterReducerDefaultState, action) => {
    switch (action.type) {
        case 'FILTER_TEXT':
            return {
                ...state,
                text: action.text
            }
        case "SORT_BY_AMOUNT":
            return {
                ...state,
                sortBy: 'amount'
            }
        case "SORT_BY_DATE":
            return {
                ...state,
                sortBy: 'date'
            }    
        case "SET_START_DATE":
            return {
                ...state,
                startDate: action.startDate
            } 
        case "SET_END_DATE":
            return {
                ...state,
                endDate: action.endDate
            } 
        default:
            return state;
    }
};


