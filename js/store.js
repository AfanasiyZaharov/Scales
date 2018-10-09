console.log(Redux);

const { createStore } = Redux;

const initialState = {
  selectedFrets: [],
  selectedStrings: [],
  colorSelectedFrets: 'rgba(0,0,255, 0.2)',
  colorSelectedStrings: 'rgba(250,0,0, 0.2)',
};

const dataReducer = (state = initialState, { type, payload }) => {
  console.log('update state', state, type, payload);
  switch (type) {
    case window.types.ADD_HIGHLIGHTS:
      return {
        ...state,
        selectedFrets: [...state.selectedFrets, payload],
      };

    case window.types.ADD_SELECTION_STRING:
      return {
        ...state,
        selectedStrings: [...state.selectedStrings, payload],
      };
    case window.types.REMOVE_ALL_SELECTION:
      return {
        ...state,
        selectedStrings: [],
        selectedFrets: [],
      };
    default:
      return { ...state };
  }
}

window.types = {
  ADD_HIGHLIGHTS: 'ADD_HIGHLIGHTS',
  ADD_SELECTION_STRING: 'ADD_SELECTION_STRING',
  REMOVE_ALL_SELECTION: 'REMOVE_ALL_SELECTION',
};

window.actions = {
  addHighlights: (fret, string) => ({ type: types.ADD_HIGHLIGHTS, payload: { fret, string } }),
  addSelectionString: (string, fret) => ({ type: types.ADD_SELECTION_STRING, payload: { string, fret } }),
  removeAllSelection: () => ({ type: types.REMOVE_ALL_SELECTION }),
}



window.store = createStore(dataReducer);
