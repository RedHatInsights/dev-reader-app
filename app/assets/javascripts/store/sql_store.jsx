import create from 'zustand'

const useSqlStore = create(set => ({
  sql: 'SELECT * FROM SOURCES',
  data: [],
  loading: false,
  setSql: (sql) => set(state => ({ ...state, sql })),
  setData: (data) => set(state => ({...state, data, loading: false })),
  setLoading: (loading) => set(state => ({...state, loading }))
}))

export default useSqlStore;
