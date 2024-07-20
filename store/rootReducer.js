import layout  from './layoutReducer'
import auth from '@/app/(auth)/store/authReducer'
const rootReducer = {
  layout,
  auth
}
export default rootReducer