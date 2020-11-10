import create from 'zustand'

const useSqlStore = create(set => ({
  sql: 'SELECT * FROM SOURCES',
  data: [],
  loading: false,
  error: '',
  setSql: (sql) => set(state => ({ ...state, sql })),
  setData: (data) => set(state => ({...state, data, loading: false })),
  setLoading: (loading) => set(state => ({...state, loading, error: '' })),
  setError: (error) => set(state => ({...state, error, loading: false }))
}))

export default useSqlStore;
