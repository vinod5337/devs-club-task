import { TOKEN } from './appActions';

export default function AppReducer(state, action) {
    switch (action.type) {
        case TOKEN:
            return {
                ...state,
                token: action.payload,
            };
        default:
            break;
    }
}