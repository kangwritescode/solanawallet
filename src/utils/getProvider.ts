import { type PhantomProvider } from '../shared/types';

/**
 * Retrieves the Phantom Provider from the window object
 * @returns {PhantomProvider | undefined} a Phantom provider if one exists in the window
 */
const getProvider = (): PhantomProvider | undefined => {
    if (typeof window !== "undefined" && 'phantom' in window) {
        const phantom = window.phantom as { solana: PhantomProvider };
        const provider = phantom.solana;

        return provider;
    }
};

export default getProvider;