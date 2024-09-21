import dashboardReducer from '@/app/(dahboard)/store/dashboardReducer'
import layout  from './layoutReducer'
import auth from '@/app/(auth)/store/authReducer'
const rootReducer = {
  layout,
  auth,
  dashboardReducer
}
export default rootReducer