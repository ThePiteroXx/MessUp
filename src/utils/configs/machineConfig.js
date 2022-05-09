const state = {
  empty: 'empty',
  error: 'error',
  isLoading: 'loading',
  hasLoaded: 'loaded',
};

const initialContext = { errorMessage: '', successMessage: '' };
export const actions = { fetch: 'FETCH', success: 'SUCCESS', failure: 'FAILURE', reset: 'RESET' };

export const machineConfig = {
  initial: state.empty,
  context: initialContext,
  states: {
    [state.empty]: {
      on: {
        [actions.fetch]: state.isLoading,
      },
    },
    [state.isLoading]: {
      on: {
        [actions.success]: state.hasLoaded,
        [actions.failure]: state.error,
      },
    },
    [state.hasLoaded]: {
      on: {
        [actions.fetch]: state.isLoading,
        [actions.reset]: state.empty,
      },
      effect({ setContext, event, context }) {
        setContext(() => ({ ...context, successMessage: event.value }));
        return () => setContext(() => initialContext);
      },
    },
    [state.error]: {
      on: {
        [actions.fetch]: state.isLoading,
        [actions.reset]: state.empty,
      },
      effect({ setContext, event, context }) {
        setContext(() => ({ ...context, errorMessage: event.value }));
        return () => setContext(() => initialContext);
      },
    },
  },
};
