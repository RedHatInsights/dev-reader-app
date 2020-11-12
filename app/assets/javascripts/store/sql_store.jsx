import create from 'zustand'

const useSqlStore = create(set => ({
  sql: 'SELECT * FROM SOURCES',
  data: [],
  loading: false,
  error: '',
  queryBuilder: {
    loaded: false,
    value: '',
    loading: false,
    structure: undefined,
    query: ''
  },
  setSql: (sql) => set(() => ({sql})),
  setData: (data) => set(() => ({data, loading: false })),
  setLoading: (loading) => set(() => ({loading, error: '' })),
  setError: (error) => set(() => ({error, loading: false })),
  setQueryState: (newState) => set(state => ({queryBuilder: { ...state.queryBuilder, ...newState} }))
}))

export default useSqlStore;
