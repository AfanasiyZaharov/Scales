console.log(Redux);

const { createStore } = Redux;

const initialState = {
  selectedFrets: [],
  selectedStrings: [],
  colorSelectedFrets: 'rgba(0,0,255, 0.4)',
  colorSelectedStrings: 'rgba(250,0,0, 0.8)',

  selectFretsMode: false,
  selectNotesMode: false,
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

    case window.types.TOGGLE_SELECT_NOTES_MODE:
      return {
        ...state,
        selectNotesMode: !state.selectNotesMode,
        selectFretsMode: false,
      };
    case window.types.TOGGLE_SELECT_FRETS_MODE:
      return {
        ...state,
        selectNotesMode: false,
        selectFretsMode: !state.selectFretsMode,
      };

    default:
      return { ...state };
  }
}

window.types = {
  ADD_HIGHLIGHTS: 'ADD_HIGHLIGHTS',
  ADD_SELECTION_STRING: 'ADD_SELECTION_STRING',
  REMOVE_ALL_SELECTION: 'REMOVE_ALL_SELECTION',
  TOGGLE_SELECT_NOTES_MODE: 'TOGGLE_SELECT_NOTES_MODE',
  TOGGLE_SELECT_FRETS_MODE: 'TOGGLE_SELECT_FRETS_MODE',
};

window.actions = {
  addHighlights: (fret, string) => ({ type: types.ADD_HIGHLIGHTS, payload: { fret, string } }),
  addSelectionString: (fret, string) => ({ type: types.ADD_SELECTION_STRING, payload: { string, fret } }),
  toggleSelectFretsMode: () => ({ type: window.types.TOGGLE_SELECT_FRETS_MODE }),
  toggleSelectNotesMode: () => ({ type: window.types.TOGGLE_SELECT_NOTES_MODE }),
  removeAllSelection: () => ({ type: types.REMOVE_ALL_SELECTION }),
}

window.store = createStore(dataReducer);
